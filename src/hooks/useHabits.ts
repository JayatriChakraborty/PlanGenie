
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Habit } from '@/types/habits';
import { toast } from 'sonner';

const userId = 'testUser'; // Hardcoded user ID

const getHabits = async (): Promise<Habit[]> => {
  const habitsCollectionRef = collection(db, 'users', userId, 'habits');
  const q = query(habitsCollectionRef, orderBy('createdAt', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Habit[];
};

const addHabit = async (text: string) => {
  const habitsCollectionRef = collection(db, 'users', userId, 'habits');
  const newHabit = { text, completions: {}, createdAt: serverTimestamp() };
  const docRef = await addDoc(habitsCollectionRef, newHabit);
  return { id: docRef.id, ...newHabit };
};

const deleteHabit = async (id: string) => {
  const habitDocRef = doc(db, 'users', userId, 'habits', id);
  await deleteDoc(habitDocRef);
  return id;
};

const toggleCompletion = async ({ habit, dateKey }: { habit: Habit; dateKey: string }) => {
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
  const queryKey = ['habits', userId];

  const { data: habits, isLoading } = useQuery({
    queryKey,
    queryFn: getHabits,
  });

  const addHabitMutation = useMutation({
    mutationFn: addHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Habit added!');
    },
    onError: () => toast.error('Failed to add habit.'),
  });

  const deleteHabitMutation = useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Habit deleted.');
    },
    onError: () => toast.error('Failed to delete habit.'),
  });

  const toggleCompletionMutation = useMutation({
    mutationFn: toggleCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => toast.error('Failed to update habit.'),
  });

  return {
    habits: habits ?? [],
    isLoading,
    addHabit: addHabitMutation.mutate,
    deleteHabit: deleteHabitMutation.mutate,
    toggleCompletion: toggleCompletionMutation.mutate,
  };
};
