import { createBrowserRouter } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import OnboardingView from '@/components/views/OnboardingView';
import DashboardView from '@/components/views/DashboardView';
import TransactionView from '@/components/views/TransactionView';
import ProfileView from '@/components/views/ProfileView';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Sidebar />,
    children: [
      {
        index: true,
        element: <OnboardingView />,
      },
      {
        path: 'dashboard',
        element: <DashboardView />,
      },
      {
        path: 'transactions',
        element: <TransactionView />,
      },
      {
        path: 'profile',
        element: <ProfileView />,
      },
    ],
  },
]);

export default router;
