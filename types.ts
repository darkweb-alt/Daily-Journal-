
export type HabitStatus = 'completed' | 'missed';

export interface HabitEntry {
  date: string; // YYYY-MM-DD format
  status: HabitStatus;
  notes?: string;
}

export interface Streak {
  endDate: string;
  length: number;
}
