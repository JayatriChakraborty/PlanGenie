
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Note } from '@/types/notes';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

// --- API Functions ---

const getNotes = async (userId: string): Promise<Note[]> => {
  const notesCollectionRef = collection(db, 'users', userId, 'notes');
  const q = query(notesCollectionRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Note[];
};

const addNote = async ({ note, userId }: { note: Omit<Note, 'id'>, userId: string }) => {
  const notesCollectionRef = collection(db, 'users', userId, 'notes');
  const newNote = { ...note, createdAt: serverTimestamp() };
  const docRef = await addDoc(notesCollectionRef, newNote);
  return { id: docRef.id, ...newNote };
};

const updateNote = async ({ note, userId }: { note: Note, userId: string }) => {
  const noteDocRef = doc(db, 'users', userId, 'notes', note.id);
  // We only update title and content, not createdAt
  await updateDoc(noteDocRef, {
    title: note.title,
    content: note.content,
  });
  return note;
};

const deleteNote = async ({ id, userId }: { id: string, userId: string }) => {
  const noteDocRef = doc(db, 'users', userId, 'notes', id);
  await deleteDoc(noteDocRef);
  return id;
};


// --- React Query Hooks ---

export const useNotes = () => {
  const queryClient = useQueryClient();
  const { user: authUser, isLoading: authLoading } = useAuth();
  const userId = authUser?.uid;
  const queryKey = ['notes', userId];

  const notesQuery = useQuery({
    queryKey: queryKey,
    queryFn: () => {
      if (!userId) return [];
      return getNotes(userId);
    },
    enabled: !!userId,
  });

  const addNoteMutation = useMutation({
    mutationFn: (note: Omit<Note, 'id'>) => {
      if (!userId) throw new Error("User not authenticated.");
      return addNote({ note, userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Note created!');
    },
    onError: (error) => {
      console.error("Error creating note:", error);
      toast.error('Failed to create note.');
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: (note: Note) => {
        if (!userId) throw new Error("User not authenticated.");
        return updateNote({ note, userId });
    },
    onSuccess: (updatedNote) => {
      // Optimistically update the cache
      queryClient.setQueryData(queryKey, (oldData: Note[] = []) =>
        oldData.map((note) => (note.id === updatedNote.id ? updatedNote : note))
      );
      toast.success('Note updated!');
    },
    onError: (error) => {
        console.error("Error updating note:", error);
        toast.error('Failed to update note.');
    }
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => {
        if (!userId) throw new Error("User not authenticated.");
        return deleteNote({ id, userId });
    },
    onSuccess: (deletedId) => {
      // Optimistically update the cache
      queryClient.setQueryData(queryKey, (oldData: Note[] = []) =>
        oldData.filter((note) => note.id !== deletedId)
      );
      toast.success('Note deleted.');
    },
    onError: (error) => {
        console.error("Error deleting note:", error);
        toast.error('Failed to delete note.');
    }
  });

  return {
    notes: notesQuery.data ?? [],
    isLoading: authLoading || notesQuery.isLoading,
    addNote: addNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
  };
};
