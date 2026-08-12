import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ClipboardList, SearchX } from 'lucide-react';
import { Category, Todo } from '../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  todos: Todo[];
  categories: Category[];
  searchQuery: string;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  todos,
  categories,
  searchQuery,
  hasActiveFilters,
  onResetFilters,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodo,
}) => {
  const categoryMap = React.useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((cat) => map.set(cat.id, cat));
    return map;
  }, [categories]);

  if (todos.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center my-6">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
          {searchQuery || hasActiveFilters ? (
            <SearchX className="w-7 h-7 text-indigo-500" />
          ) : (
            <ClipboardList className="w-7 h-7 text-indigo-500" />
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
          {searchQuery || hasActiveFilters
            ? '조건에 맞는 할 일이 없습니다'
            : '등록된 할 일이 없습니다'}
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto mb-5">
          {searchQuery || hasActiveFilters
            ? '검색어나 카테고리 필터를 변경해 보세요.'
            : '상단의 입력창에서 새로운 할 일을 등록해 보세요!'}
        </p>

        {(searchQuery || hasActiveFilters) && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            필터 초기화
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 my-6">
      <AnimatePresence initial={false}>
        {todos.map((todo) => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            layout
          >
            <TaskItem
              todo={todo}
              category={categoryMap.get(todo.categoryId)}
              categories={categories}
              onToggle={onToggleTodo}
              onDelete={onDeleteTodo}
              onUpdate={onUpdateTodo}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
