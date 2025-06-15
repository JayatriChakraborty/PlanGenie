
export interface Habit {
  id: string;
  text: string;
  completions: Record<string, boolean>; // YYYY-MM-DD
  createdAt?: any;
}
