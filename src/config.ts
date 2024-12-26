// 应用运行时配置
import { lazy } from 'react';
import Home from './pages/home';
import i18n from './i18n';
const Todo = lazy(() => import('./pages/todo'));
const Read = lazy(() => import('./pages/read'));
const Collects = lazy(() => import('./pages/collects'))

// 应用的场景类型
export const sceneList = [
  {
    icon: '',
    id: 'home',
    label: i18n.t('home'),
    path: '/',
    Component: Home
  },
  {
    icon: '',
    id: 'todo',
    label: i18n.t('todo'),
    path: '/todo',
    Component: Todo,
  },
  {
    icon: '',
    id: 'read',
    label: i18n.t('read'),
    path: '/read',
    Component: Read,
  },
  {
    icon: '',
    id: 'collects',
    label: i18n.t('collects'),
    path: '/collects',
    Component: Collects,
  }
];
