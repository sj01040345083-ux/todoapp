import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { TaskInput } from './components/TaskInput';
import { FilterBar } from './components/FilterBar';
import { TaskList } from './components/TaskList';
import { TaskStatsCard } from './components/TaskStatsCard';
import { BoardDashboard } from './components/dashboard/BoardDashboard';
import { LayoutDashboard, ListTodo } from 'lucide-react';
import { DEFAULT_CATEGORIES, INITIAL_TODOS } from './data/initialData';
import { Category, FilterStatus, Priority, SortBy, Todo } from './types';

const STORAGE_KEY = 'todo_app_tasks_v1';

type View = 'dashboard' | 'todo';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  // Load initial state from localStorage or initial sample data
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved todos:', e);
    }
    return INITIAL_TODOS;
  });

  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error('Failed to save todos:', e);
    }
  }, [todos]);

  // Handlers
  const handleAddTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const handleResetSampleData = () => {
    setTodos(INITIAL_TODOS);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSelectedCategory(null);
  };

  // Filter & Sort computation
  const filteredAndSortedTodos = useMemo(() => {
    let result = [...todos];

    // Status filter
    if (statusFilter === 'active') {
      result = result.filter((t) => !t.completed);
    } else if (statusFilter === 'completed') {
      result = result.filter((t) => t.completed);
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((t) => t.categoryId === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    const priorityWeight: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

    result.sort((a, b) => {
      // Completed items go to bottom by default
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      if (sortBy === 'priority') {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'ko');
      }
      // Default: createdAt newest first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [todos, statusFilter, selectedCategory, searchQuery, sortBy]);

  const activeCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos]);
  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos]);

  const hasActiveFilters = Boolean(searchQuery || statusFilter !== 'all' || selectedCategory);

  const nav = (
    <nav className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-1 h-11">
        {([
          ['dashboard', '소통게시판 대시보드', LayoutDashboard],
          ['todo', '할 일', ListTodo],
        ] as const).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
              view === id ? 'bg-white/15 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {nav}
        <BoardDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {nav}
      {/* Header Bar */}
      <Header
        totalCount={todos.length}
        completedCount={completedCount}
        onClearCompleted={handleClearCompleted}
        onResetSampleData={handleResetSampleData}
      />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {/* Quick Stats Summary */}
        <TaskStatsCard todos={todos} />

        {/* Task Input Component */}
        <TaskInput categories={categories} onAddTodo={handleAddTodo} />

        {/* Filter and Search Bar */}
        <FilterBar
          categories={categories}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          activeCount={activeCount}
          completedCount={completedCount}
          totalCount={todos.length}
        />

        {/* Task List */}
        <TaskList
          todos={filteredAndSortedTodos}
          categories={categories}
          searchQuery={searchQuery}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
          onUpdateTodo={handleUpdateTodo}
        />

        {/* Footer info */}
        <footer className="mt-12 text-center text-xs text-slate-400 py-4 border-t border-slate-200/60">
          <p>Tip: 체크박스를 클릭하여 완료 처리하거나, 수정 버튼으로 세부 정보를 변경할 수 있습니다.</p>
        </footer>
      </main>
    </div>
  );
}
