import React, { useState } from 'react';
import { Check, Trash2, Edit3, Calendar, Flag, Save, X, AlertCircle, Clock } from 'lucide-react';
import { Category, Priority, Todo } from '../types';

interface TaskItemProps {
  todo: Todo;
  category?: Category;
  categories: Category[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  todo,
  category,
  categories,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [editCategoryId, setEditCategoryId] = useState(todo.categoryId);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
      categoryId: editCategoryId,
      dueDate: editDueDate || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setEditCategoryId(todo.categoryId);
    setEditDueDate(todo.dueDate || '');
    setIsEditing(false);
  };

  // Due Date status calculation
  const getDueDateStatus = (dueDateStr?: string) => {
    if (!dueDateStr) return null;
    const today = new Date().toISOString().split('T')[0];
    const due = new Date(dueDateStr).toISOString().split('T')[0];

    if (due < today && !todo.completed) {
      return { text: '기한 초과', color: 'bg-rose-100 text-rose-700 border-rose-200 font-semibold' };
    }
    if (due === today) {
      return { text: '오늘 마감', color: 'bg-amber-100 text-amber-800 border-amber-200 font-semibold' };
    }
    return { text: dueDateStr, color: 'bg-slate-100 text-slate-600 border-slate-200' };
  };

  const dueDateStatus = getDueDateStatus(todo.dueDate);

  const priorityBadges: Record<Priority, { label: string; color: string }> = {
    low: { label: '낮음', color: 'bg-slate-100 text-slate-600 border-slate-200' },
    medium: { label: '보통', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    high: { label: '높음', color: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold' },
  };

  if (isEditing) {
    return (
      <div className="bg-indigo-50/50 border-2 border-indigo-500/30 rounded-2xl p-4 transition-all">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full text-sm font-medium text-slate-900 bg-white border border-indigo-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="할 일 제목"
            autoFocus
          />

          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full text-xs text-slate-700 bg-white border border-indigo-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="상세 설명 (선택사항)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* Category */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">카테고리</label>
              <select
                value={editCategoryId}
                onChange={(e) => setEditCategoryId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">우선순위</label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as Priority)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
              >
                <option value="low">낮음</option>
                <option value="medium">보통</option>
                <option value="high">높음</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">마감 기한</label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> 취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> 저장
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group bg-white rounded-2xl border transition-all duration-200 hover:shadow-sm ${
        todo.completed
          ? 'bg-slate-50/60 border-slate-200/60 opacity-80'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="p-4 sm:p-4.5 flex items-start gap-3 sm:gap-3.5">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`mt-0.5 shrink-0 w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
            todo.completed
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
              : 'border-slate-300 hover:border-indigo-500 bg-white'
          }`}
          title={todo.completed ? '미완료로 변경' : '완료로 표시'}
        >
          {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {/* Category badge */}
            {category && (
              <span
                className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                  category.color || 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {category.name}
              </span>
            )}

            {/* Priority badge */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md border ${
                priorityBadges[todo.priority].color
              }`}
            >
              <Flag className="w-2.5 h-2.5" />
              {priorityBadges[todo.priority].label}
            </span>

            {/* Due date badge */}
            {dueDateStatus && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md border ${dueDateStatus.color}`}
              >
                <Calendar className="w-2.5 h-2.5" />
                {dueDateStatus.text}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`text-sm sm:text-base font-semibold leading-snug break-words transition-all ${
              todo.completed ? 'text-slate-400 line-through' : 'text-slate-900'
            }`}
          >
            {todo.title}
          </h3>

          {/* Description */}
          {todo.description && (
            <p
              className={`text-xs mt-1 leading-relaxed break-words ${
                todo.completed ? 'text-slate-400 line-through' : 'text-slate-600'
              }`}
            >
              {todo.description}
            </p>
          )}

          {/* Timestamp info */}
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(todo.createdAt).toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
              })}{' '}
              등록
            </span>
            {todo.completedAt && (
              <span>
                • {new Date(todo.completedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} 완료
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            title="수정"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
