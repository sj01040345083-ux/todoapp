import React, { useState } from 'react';
import { Plus, Calendar, Flag, Tag, ChevronDown, ChevronUp, AlignLeft } from 'lucide-react';
import { Category, Priority, Todo } from '../types';

interface TaskInputProps {
  categories: Category[];
  onAddTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ categories, onAddTodo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || 'work');
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTodo({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      categoryId,
      dueDate: dueDate || undefined,
    });

    // Reset inputs
    setTitle('');
    setDescription('');
    setPriority('medium');
    setShowDetails(false);
  };

  const priorityLabels: Record<Priority, { label: string; color: string }> = {
    low: { label: '낮음', color: 'text-slate-600 bg-slate-100 hover:bg-slate-200 border-slate-200' },
    medium: { label: '보통', color: 'text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200' },
    high: { label: '높음', color: 'text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200' },
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="새로운 할 일을 입력하세요..."
            className="flex-1 text-slate-900 text-sm sm:text-base placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />

          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-semibold ${
              showDetails
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="세부 설정"
          >
            <Tag className="w-4 h-4" />
            <span className="hidden sm:inline">세부설정</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="submit"
            disabled={!title.trim()}
            className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>추가</span>
          </button>
        </div>

        {/* Expandable Details Section */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                카테고리
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Flag className="w-3.5 h-3.5 text-slate-400" />
                우선순위
              </label>
              <div className="flex gap-1">
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                      priority === p
                        ? `${priorityLabels[p].color} font-semibold ring-1 ring-offset-1 ring-indigo-400`
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {priorityLabels[p].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                마감 기한
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              />
            </div>

            {/* Memo / Description */}
            <div className="sm:col-span-3 mt-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
                메모 (선택사항)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="상세 설명이나 참고할 내용을 입력하세요"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
