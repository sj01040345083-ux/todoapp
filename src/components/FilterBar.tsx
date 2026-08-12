import React from 'react';
import { Search, X, ArrowUpDown, Tag } from 'lucide-react';
import { Category, FilterStatus, SortBy } from '../types';

interface FilterBarProps {
  categories: Category[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: FilterStatus;
  onStatusFilterChange: (status: FilterStatus) => void;
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  sortBy: SortBy;
  onSortByChange: (sortBy: SortBy) => void;
  activeCount: number;
  completedCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortByChange,
  activeCount,
  completedCount,
  totalCount,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs mb-6 space-y-3.5">
      {/* Top row: Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="할 일 검색..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5" />
            정렬:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortBy)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <option value="createdAt">등록 최신순</option>
            <option value="dueDate">마감 임박순</option>
            <option value="priority">우선순위 높음순</option>
            <option value="title">가나다순</option>
          </select>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        {/* Status Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => onStatusFilterChange('all')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            전체 ({totalCount})
          </button>
          <button
            onClick={() => onStatusFilterChange('active')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            진행 중 ({activeCount})
          </button>
          <button
            onClick={() => onStatusFilterChange('completed')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            완료됨 ({completedCount})
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-medium text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            카테고리:
          </span>
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all shrink-0 cursor-pointer ${
              selectedCategory === null
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            전체
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(selectedCategory === cat.id ? null : cat.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
