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

// ---- 지점 소통게시판 ----
export type BoardCategory = 'notice' | 'request' | 'question' | 'share' | 'suggestion';

export interface Branch {
  id: string;
  name: string;
  region: string;
}

export interface BoardPost {
  id: string;
  title: string;
  category: BoardCategory;
  branchId: string; // 'hq' = 본사
  author: string;
  createdAt: string; // ISO
  views: number;
  comments: number;
  urgent: boolean;
  pinned?: boolean;
  answered?: boolean; // 질문·업무요청만 해당
  readBy?: string[]; // 공지: 확인한 지점 id
}
