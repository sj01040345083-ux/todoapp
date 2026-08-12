import React from 'react';
import { CheckCircle2, ListTodo, Trash2, RotateCcw } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  completedCount: number;
  onClearCompleted: () => void;
  onResetSampleData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  completedCount,
  onClearCompleted,
  onResetSampleData,
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const todayFormatted = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date());

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-10 backdrop-blur-md bg-white/90">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Title & Date */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm shadow-indigo-200">
                <ListTodo className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                오늘의 할 일
              </h1>
            </div>
            <p className="text-sm font-medium text-slate-500 mt-1 pl-0.5">
              {todayFormatted}
            </p>
          </div>

          {/* Actions & Progress Summary */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {completedCount > 0 && (
              <button
                onClick={onClearCompleted}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                title="완료된 할 일 삭제"
              >
                <Trash2 className="w-3.5 h-3.5" />
                완료 항목 정리 ({completedCount})
              </button>
            )}

            {totalCount === 0 && (
              <button
                onClick={onResetSampleData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                title="샘플 데이터 복원"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                샘플 불러오기
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-2">
              <span className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                진행률 {percentage}%
              </span>
              <span className="text-slate-500 font-medium">
                총 {totalCount}개 중 {completedCount}개 완료
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
