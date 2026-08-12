import { Category, Todo } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: '업무', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', iconName: 'Briefcase' },
  { id: 'personal', name: '개인', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', iconName: 'User' },
  { id: 'shopping', name: '쇼핑', color: 'bg-amber-100 text-amber-700 border-amber-200', iconName: 'ShoppingCart' },
  { id: 'health', name: '건강', color: 'bg-rose-100 text-rose-700 border-rose-200', iconName: 'Heart' },
  { id: 'study', name: '공부', color: 'bg-purple-100 text-purple-700 border-purple-200', iconName: 'BookOpen' },
];

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const INITIAL_TODOS: Todo[] = [
  {
    id: 'demo-1',
    title: '주간 업무 보고서 작성 및 공유하기',
    description: '이번 주 진행한 프로젝트 성과 정리 및 팀 공유',
    completed: false,
    priority: 'high',
    categoryId: 'work',
    dueDate: today,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'demo-2',
    title: '비타민 및 건강 영양제 챙겨먹기',
    description: '물 한 컵과 함께 오메가3, 비타민C 복용',
    completed: true,
    priority: 'medium',
    categoryId: 'health',
    dueDate: today,
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'demo-3',
    title: 'TypeScript 최신 문법 가이드 읽기',
    description: '타입스크립트 공식 문서 가이드 및 모범 사례 복습',
    completed: false,
    priority: 'medium',
    categoryId: 'study',
    dueDate: tomorrow,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'demo-4',
    title: '주말 식재료 장보기 목록 확인',
    description: '우유, 계란, 샐러드 채소, 아보카도',
    completed: false,
    priority: 'low',
    categoryId: 'shopping',
    dueDate: tomorrow,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];
