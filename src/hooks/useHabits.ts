
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Habit } from '@/types/habits';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

const getHabits = async (userId: string): Promise<Habit[]> => {
  const habitsCollectionRef = collection(db, 'users', userId, 'habits');
  const q = query(habitsCollectionRef, orderBy('createdAt', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Habit[];
};

const addHabit = async ({ text, userId }: { text: string; userId: string }) => {
  const habitsCollectionRef = collection(db, 'users', userId, 'habits');
  const newHabit = { text, completions: {}, createdAt: serverTimestamp() };
  const docRef = await addDoc(habitsCollectionRef, newHabit);
  return { id: docRef.id, ...newHabit };
};

const deleteHabit = async ({ id, userId }: { id: string; userId: string }) => {
  const habitDocRef = doc(db, 'users', userId, 'habits', id);
  await deleteDoc(habitDocRef);
  return id;
};

const toggleCompletion = async ({ habit, dateKey, userId }: { habit: Habit; dateKey: string; userId: string }) => {
    const habitDocRef = doc(db, 'users', userId, 'habits', habit.id);
    const newCompletions = { ...habit.completions };
    if (newCompletions[dateKey]) {
        delete newCompletions[dateKey];
    } else {
        newCompletions[dateKey] = true;
    }
    await updateDoc(habitDocRef, { completions: newCompletions });
    return { ...habit, completions: newCompletions };
};

export const useHabits = () => {
  const queryClient = useQueryClient();
  const { user: authUser, isLoading: authLoading } = useAuth();
  const userId = authUser?.uid;

  const queryKey = ['habits', userId];

  const { data: habits, isLoading: habitsLoading } = useQuery({
    queryKey,
    queryFn: () => {
      if (!userId) return [];
      return getHabits(userId);
    },
    enabled: !!userId,
  });

  const addHabitMutation = useMutation({
    mutationFn: (text: string) => {
      if (!userId) throw new Error("User not authenticated.");
      return addHabit({ text, userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Habit added!');
    },
    onError: () => toast.error('Failed to add habit.'),
  });

  const deleteHabitMutation = useMutation({
    mutationFn: (id: string) => {
      if (!userId) throw new Error("User not authenticated.");
      return deleteHabit({ id, userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Habit deleted.');
    },
    onError: () => toast.error('Failed to delete habit.'),
  });

  const toggleCompletionMutation = useMutation({
    mutationFn: ({ habit, dateKey }: { habit: Habit; dateKey: string }) => {
      if (!userId) throw new Error("User not authenticated.");
      return toggleCompletion({ habit, dateKey, userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => toast.error('Failed to update habit.'),
  });

  return {
    habits: habits ?? [],
    isLoading: authLoading || habitsLoading,
    addHabit: addHabitMutation.mutate,
    deleteHabit: deleteHabitMutation.mutate,
    toggleCompletion: toggleCompletionMutation.mutate,
  };
};
