import React from 'react';
import { CheckCircle2, Circle, AlertCircle, Calendar } from 'lucide-react';
import { Todo } from '../types';

interface TaskStatsCardProps {
  todos: Todo[];
}

export const TaskStatsCard: React.FC<TaskStatsCardProps> = ({ todos }) => {
  const total = todos.length;
  const active = todos.filter((t) => !t.completed).length;
  const completed = todos.filter((t) => t.completed).length;
  const highPriorityActive = todos.filter((t) => !t.completed && t.priority === 'high').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const dueTodayCount = todos.filter((t) => !t.completed && t.dueDate === todayStr).length;

  if (total === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
          <Circle className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500">진행 중</p>
          <p className="text-lg font-bold text-slate-900">{active}개</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500">완료됨</p>
          <p className="text-lg font-bold text-slate-900">{completed}개</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500">높은 우선순위</p>
          <p className="text-lg font-bold text-slate-900">{highPriorityActive}개</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
          <Calendar className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500">오늘 마감</p>
          <p className="text-lg font-bold text-slate-900">{dueTodayCount}개</p>
        </div>
      </div>
    </div>
  );
};
