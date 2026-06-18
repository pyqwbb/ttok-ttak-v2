import { createBrowserRouter } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import OnboardingView from '@/pages/OnboardingPage';
import DashboardView from '@/pages/DashboardPage';
import TransactionView from '@/pages/TransactionPage';
import ProfileView from '@/pages/ProfilePage';
import BudgetView from '@/pages/BudgetPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <OnboardingView />,
  },
  {
    path: 'dashboard',
    element: <Sidebar />,
    children: [
      {
        index: true,
        element: <DashboardView />,
      },
    ],
  },
  {
    path: 'transactions',
    element: <Sidebar />,
    children: [
      {
        index: true,
        element: <TransactionView />,
      },
    ],
  },
  {
    path: 'profile',
    element: <Sidebar />,
    children: [
      {
        index: true,
        element: <ProfileView />,
      },
    ],
  },
  {
    path: 'budget',
    element: <Sidebar />,
    children: [
      {
        index: true,
        element: <BudgetView />,
      },
    ],
  },
]);

export default router;
