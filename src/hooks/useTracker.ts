
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TrackerItem } from '@/lib/types';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

const getItems = async (userId: string): Promise<TrackerItem[]> => {
  const itemsCollectionRef = collection(db, 'users', userId, 'trackerItems');
  const q = query(itemsCollectionRef, orderBy('createdAt', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TrackerItem[];
};

const addItem = async ({ text, userId }: { text: string; userId: string; }) => {
  const itemsCollectionRef = collection(db, 'users', userId, 'trackerItems');
  const newItem = { text, completed: false, createdAt: serverTimestamp() };
  const docRef = await addDoc(itemsCollectionRef, newItem);
  return { id: docRef.id, ...newItem };
};

const toggleItem = async ({ id, completed, userId }: { id: string; completed: boolean; userId: string; }) => {
  const itemDocRef = doc(db, 'users', userId, 'trackerItems', id);
  await updateDoc(itemDocRef, { completed: !completed });
  return { id, completed: !completed };
};

const deleteItem = async ({ id, userId }: { id: string; userId: string; }) => {
  const itemDocRef = doc(db, 'users', userId, 'trackerItems', id);
  await deleteDoc(itemDocRef);
  return id;
};

export const useTracker = () => {
  const queryClient = useQueryClient();
  const { user: authUser, isLoading: authLoading } = useAuth();
  const userId = authUser?.uid;

  const queryKey = ['trackerItems', userId];

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey,
    queryFn: () => {
      if (!userId) return [];
      return getItems(userId);
    },
    enabled: !!userId,
  });

  const addItemMutation = useMutation({
    mutationFn: (text: string) => {
      if (!userId) throw new Error("User not authenticated.");
      return addItem({ text, userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Goal added!');
    },
    onError: () => toast.error('Failed to add goal.'),
  });

  const toggleItemMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => {
      if (!userId) throw new Error("User not authenticated.");
      return toggleItem({ id, completed, userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => toast.error('Failed to update goal.'),
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => {
      if (!userId) throw new Error("User not authenticated.");
      return deleteItem({ id, userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Goal deleted.');
    },
    onError: () => toast.error('Failed to delete goal.'),
  });

  return {
    items: items ?? [],
    isLoading: authLoading || itemsLoading,
    addItem: addItemMutation.mutate,
    toggleItem: toggleItemMutation.mutate,
    deleteItem: deleteItemMutation.mutate,
  };
};
