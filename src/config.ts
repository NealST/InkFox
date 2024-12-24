// 应用运行时配置
import { lazy } from 'react';
import Home from './pages/home';

const Todo = lazy(() => import('./pages/todo'));
const Read = lazy(() => import('./pages/read'));
const Collects = lazy(() => import('./pages/collects'))

// 应用的场景类型
export const sceneList = [
  {
    icon: '',
    id: 'home',
    label: '写作',
    path: '/',
    Component: Home
  },
  {
    icon: '',
    id: 'todo',
    label: '待办',
    path: '/todo',
    Component: Todo,
  },
  {
    icon: '',
    id: 'read',
    label: '阅读',
    path: '/read',
    Component: Read,
  },
  {
    icon: '',
    id: 'collects',
    label: '收藏',
    path: '/collects',
    Component: Collects,
  }
];
