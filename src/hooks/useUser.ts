
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/lib/types';

const userId = 'testUser'; // Hardcoded user ID

const getUserProfile = async (): Promise<UserProfile | null> => {
  if (!userId) return null;
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }
  return null;
};

export const useUser = () => {
  const queryKey = ['userProfile', userId];

  const { data: user, isLoading } = useQuery<UserProfile | null>({
    queryKey,
    queryFn: getUserProfile,
  });

  return { user, isLoading, queryKey };
};
