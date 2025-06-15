
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Note } from '@/types/notes';
import { toast } from 'sonner';

// Hardcoded user ID for now. In a real app, this would come from an auth context.
const userId = 'testUser';

// --- API Functions ---

const getNotes = async (): Promise<Note[]> => {
  const notesCollectionRef = collection(db, 'users', userId, 'notes');
  const q = query(notesCollectionRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Note[];
};

const addNote = async (note: Omit<Note, 'id'>) => {
  const notesCollectionRef = collection(db, 'users', userId, 'notes');
  const newNote = { ...note, createdAt: serverTimestamp() };
  const docRef = await addDoc(notesCollectionRef, newNote);
  return { id: docRef.id, ...newNote };
};

const updateNote = async (note: Note) => {
  const noteDocRef = doc(db, 'users', userId, 'notes', note.id);
  // We only update title and content, not createdAt
  await updateDoc(noteDocRef, {
    title: note.title,
    content: note.content,
  });
  return note;
};

const deleteNote = async (id: string) => {
  const noteDocRef = doc(db, 'users', userId, 'notes', id);
  await deleteDoc(noteDocRef);
  return id;
};


// --- React Query Hooks ---

export const useNotes = () => {
  const queryClient = useQueryClient();
  const queryKey = ['notes', userId];

  const notesQuery = useQuery({
    queryKey: queryKey,
    queryFn: getNotes,
  });

  const addNoteMutation = useMutation({
    mutationFn: addNote,
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
    mutationFn: updateNote,
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
    mutationFn: deleteNote,
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
    isLoading: notesQuery.isLoading,
    addNote: addNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
  };
};
