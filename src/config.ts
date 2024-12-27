// 应用运行时配置
import { lazy } from 'react';
import Notes from './pages/notes';
import i18n from './i18n';
import { Notebook, ListTodo, BookOpen, Heart } from 'lucide-react';

const Todo = lazy(() => import('./pages/todo'));
const Read = lazy(() => import('./pages/read'));
const Collects = lazy(() => import('./pages/collects'));

// 应用的场景类型
export const sceneList = [
  {
    icon: Notebook,
    id: 'notes',
    label: i18n.t('notes'),
    path: '/',
    Component: Notes
  },
  {
    icon: ListTodo,
    id: 'todo',
    label: i18n.t('todo'),
    path: '/todo',
    Component: Todo,
  },
  {
    icon: BookOpen,
    id: 'read',
    label: i18n.t('read'),
    path: '/read',
    Component: Read,
  },
  {
    icon: Heart,
    id: 'collects',
    label: i18n.t('collects'),
    path: '/collects',
    Component: Collects,
  }
];
