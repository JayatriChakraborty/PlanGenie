
export interface TrackerItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt?: any;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
}
