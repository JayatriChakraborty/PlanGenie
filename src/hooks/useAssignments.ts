
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Assignment } from '@/lib/types';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

const getAssignments = async (userId: string): Promise<Assignment[]> => {
  const assignmentsCollectionRef = collection(db, 'users', userId, 'assignments');
  const q = query(assignmentsCollectionRef, orderBy('dueDate', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Assignment[];
};

const addAssignment = async ({ topic, dueDate, userId }: { topic: string; dueDate: Date; userId: string; }) => {
  const assignmentsCollectionRef = collection(db, 'users', userId, 'assignments');
  const newAssignment = { 
    topic, 
    dueDate: Timestamp.fromDate(dueDate), 
    started: false,
    inProgress: false,
    handedIn: false,
    createdAt: serverTimestamp() 
  };
  const docRef = await addDoc(assignmentsCollectionRef, newAssignment);
  return { id: docRef.id, ...newAssignment };
};

const deleteAssignment = async ({ id, userId }: { id: string; userId: string; }) => {
  const assignmentDocRef = doc(db, 'users', userId, 'assignments', id);
  await deleteDoc(assignmentDocRef);
  return id;
};

const updateAssignment = async ({ id, data, userId }: { id: string; data: Partial<Assignment>; userId: string; }) => {
    const assignmentDocRef = doc(db, 'users', userId, 'assignments', id);
    await updateDoc(assignmentDocRef, data);
    return { id, ...data };
};

export const useAssignments = () => {
  const queryClient = useQueryClient();
  const { user: authUser, isLoading: authLoading } = useAuth();
  const userId = authUser?.uid;

  const queryKey = ['assignments', userId];

  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey,
    queryFn: () => {
      if (!userId) return [];
      return getAssignments(userId);
    },
    enabled: !!userId,
  });

  const addAssignmentMutation = useMutation({
    mutationFn: ({ topic, dueDate }: { topic: string; dueDate: Date }) => {
      if (!userId) throw new Error("User not authenticated.");
      return addAssignment({ topic, dueDate, userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Assignment added!');
    },
    onError: () => toast.error('Failed to add assignment.'),
  });

  const deleteAssignmentMutation = useMutation({
    mutationFn: (id: string) => {
      if (!userId) throw new Error("User not authenticated.");
      return deleteAssignment({ id, userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Assignment deleted.');
    },
    onError: () => toast.error('Failed to delete assignment.'),
  });

  const updateAssignmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Assignment> }) => {
      if (!userId) throw new Error("User not authenticated.");
      return updateAssignment({ id, data, userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => toast.error('Failed to update assignment.'),
  });

  return {
    assignments: assignments ?? [],
    isLoading: authLoading || assignmentsLoading,
    addAssignment: addAssignmentMutation.mutate,
    deleteAssignment: deleteAssignmentMutation.mutate,
    updateAssignment: updateAssignmentMutation.mutate,
  };
};
