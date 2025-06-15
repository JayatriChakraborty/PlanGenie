
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TrackerItem } from '@/lib/types';
import { toast } from 'sonner';

const userId = 'testUser'; // Hardcoded user ID

const getItems = async (): Promise<TrackerItem[]> => {
  const itemsCollectionRef = collection(db, 'users', userId, 'trackerItems');
  const q = query(itemsCollectionRef, orderBy('createdAt', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TrackerItem[];
};

const addItem = async (text: string) => {
  const itemsCollectionRef = collection(db, 'users', userId, 'trackerItems');
  const newItem = { text, completed: false, createdAt: serverTimestamp() };
  const docRef = await addDoc(itemsCollectionRef, newItem);
  return { id: docRef.id, ...newItem };
};

const toggleItem = async ({ id, completed }: { id: string; completed: boolean }) => {
  const itemDocRef = doc(db, 'users', userId, 'trackerItems', id);
  await updateDoc(itemDocRef, { completed: !completed });
  return { id, completed: !completed };
};

const deleteItem = async (id: string) => {
  const itemDocRef = doc(db, 'users', userId, 'trackerItems', id);
  await deleteDoc(itemDocRef);
  return id;
};

export const useTracker = () => {
  const queryClient = useQueryClient();
  const queryKey = ['trackerItems', userId];

  const { data: items, isLoading } = useQuery({
    queryKey,
    queryFn: getItems,
  });

  const addItemMutation = useMutation({
    mutationFn: addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Goal added!');
    },
    onError: () => toast.error('Failed to add goal.'),
  });

  const toggleItemMutation = useMutation({
    mutationFn: toggleItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => toast.error('Failed to update goal.'),
  });

  const deleteItemMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Goal deleted.');
    },
    onError: () => toast.error('Failed to delete goal.'),
  });

  return {
    items: items ?? [],
    isLoading,
    addItem: addItemMutation.mutate,
    toggleItem: toggleItemMutation.mutate,
    deleteItem: deleteItemMutation.mutate,
  };
};
