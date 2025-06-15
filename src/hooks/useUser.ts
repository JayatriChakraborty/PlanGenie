
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/lib/types';
import { useAuth } from './useAuth';

const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }
  return null;
};

export const useUser = () => {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const userId = authUser?.uid;

  const queryKey = ['userProfile', userId];

  const { data: user, isLoading: profileLoading, ...rest } = useQuery({
    queryKey,
    queryFn: () => {
      if (!userId) return null;
      return getUserProfile(userId);
    },
    enabled: !!userId,
  });

  return { user, authUser, userId, isLoading: authLoading || (!!userId && profileLoading), queryKey, ...rest };
};
