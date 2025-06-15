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

export interface Assignment {
  id:string;
  topic: string;
  dueDate: any;
  started: boolean;
  inProgress: boolean;
  handedIn: boolean;
  createdAt?: any;
}
