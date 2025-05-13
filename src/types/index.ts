
export type Priority = 'low' | 'medium' | 'high';
export type CategoryId = 'homework' | 'exam' | 'project' | 'reading' | 'other';
export type TaskFilter = 'all' | 'today' | 'upcoming' | 'completed';

export interface Category {
  id: CategoryId;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO date string
  priority: Priority;
  category: CategoryId;
  completed: boolean;
  createdAt: string; // ISO date string
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string
  startTime?: string;
  endTime?: string;
  location?: string;
  color?: string;
}

export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}
