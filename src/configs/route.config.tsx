import { createBrowserRouter, createHashRouter, Navigate } from 'react-router-dom';

export const router = createHashRouter([
  {
    path: '/',
    element: <Navigate to="/project/1" replace />,
  },
  {
    path: '/project/:id',
    lazy: () => import('@/views/workspace/WorkspacePage'),
    children: [
      {
        path: '',
        lazy: () => import('@/views/workspace/components/MainContent'),
      },
      {
        path: 'settings',
        lazy: () => import('@/views/settings/SettingsPage'),
      },
      {
        path: 'help',
        lazy: () => import('@/views/help/HelpPage'),
      },
      {
        path: 'about',
        lazy: () => import('@/views/about/AboutPage'),
      },
      {
        path: 'user',
        lazy: () => import('@/views/user/UserPage'),
      },
      {
        path: 'search',
        lazy: () => import('@/views/search/SearchPage'),
      },
    ],
  },
  {
    path: '/test',
    lazy: () => import('@/views/test/TestPage'),
  },
  {
    path: '*',
    lazy: () => import('@/views/not-found/NotFoundPage'),
  },
]);

export type RoutePath = '/' | '/project/:id' | '/project/:id/settings' | '/project/:id/help' | 
  '/project/:id/about' | '/project/:id/user' | '/project/:id/search' | '/test' | '*';
