export type Priority = 'low' | 'medium' | 'high';

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind color class or hex for badge background/text
  iconName: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  categoryId: string;
  dueDate?: string; // ISO date string (YYYY-MM-DD)
  createdAt: string; // ISO string
  completedAt?: string; // ISO string
}

export type FilterStatus = 'all' | 'active' | 'completed';

export type SortBy = 'createdAt' | 'dueDate' | 'priority' | 'title';
