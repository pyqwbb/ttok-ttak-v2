import { createRouter, createWebHistory } from 'vue-router';
import OnboardingView from '@/components/views/OnboardingView.vue';
import DashboardView from '@/components/views/DashboardView.vue';
import TransactionView from '@/components/views/TransactionView.vue';
import ProfileView from '@/components/views/ProfileView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'onboarding',
      component: OnboardingView,
      meta: { isFullPage: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { isFullPage: false },
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionView,
      meta: { isFullPage: false },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { isFullPage: false },
    },
  ],
});

export default router;
