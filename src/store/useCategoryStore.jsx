import { create } from 'zustand';
import { categoryApi } from '@/api/category';

export const useCategoryStore = create((set, get) => ({
  categories: [],
  categoryBudgets: [],
  budgets: [],
  isLoading: false,
  hasInitialized: false, // 캐싱 방어벽용 플래그

  // API Actions
  fetchAll: async (uid) => {
    // 💡 캐싱 전략: 이미 초기화되었다면 API 호출을 생략
    if (get().hasInitialized) return;

    set({ isLoading: true });
    try {
      const [catRes, budgetRes, expenseRes] = await Promise.all([
        categoryApi.getCategories(),
        categoryApi.getCategoryBudgets(uid),
        categoryApi.getBudgets(uid),
      ]);

      set({
        categories: catRes.data.map((c) => ({ ...c, id: String(c.id) })),
        categoryBudgets: budgetRes.data,
        budgets: expenseRes.data,
        hasInitialized: true,
      });
    } catch (error) {
      console.error('Failed to fetch category data:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Computed Values (Getters)
  getExpenseCategories: () =>
    get().categories.filter((c) => c.type === 'expense'),
  getIncomeCategories: () =>
    get().categories.filter((c) => c.type === 'income'),

  getCurrentMonthBudgets: () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return get().budgets.filter(
      (b) => b.type === 'expense' && b.date.startsWith(`${year}-${month}`),
    );
  },

  getExpenseByCategory: () => {
    const map = {};
    get()
      .getCurrentMonthBudgets()
      .forEach((b) => {
        map[b.cid] = (map[b.cid] || 0) + b.amount;
      });
    return map;
  },

  getTotalExpense: () => {
    const map = get().getExpenseByCategory();
    return Object.values(map).reduce((a, b) => a + b, 0);
  },

  getTopExpenseCategory: () => {
    const map = get().getExpenseByCategory();
    const topCid = Object.keys(map).sort((a, b) => map[b] - map[a])[0];
    return get().categories.find((c) => c.id === topCid) || null;
  },

  getExpenseCountByCategory: () => {
    const map = {};
    get()
      .getCurrentMonthBudgets()
      .forEach((b) => {
        map[b.cid] = (map[b.cid] || 0) + 1;
      });
    return map;
  },

  getTopCountCategory: () => {
    const map = get().getExpenseCountByCategory();
    const topCid = Object.keys(map).sort((a, b) => map[b] - map[a])[0];
    return get().categories.find((c) => c.id === String(topCid)) || null;
  },

  getChartData: () => {
    const map = get().getExpenseByCategory();
    const total = get().getTotalExpense();
    return get()
      .categories.filter((c) => map[c.id])
      .map((c) => ({
        ...c,
        amount: map[c.id],
        ratio: total > 0 ? Math.round((map[c.id] / total) * 100) : 0,
        goalAmount:
          get().categoryBudgets.find((b) => String(b.cid) === String(c.id))
            ?.amount || null,
      }))
      .sort((a, b) => b.amount - a.amount);
  },

  getMonthlyTopCountCategories: () => {
    const monthlyGroups = {};
    get().budgets.forEach((b) => {
      if (b.type !== 'expense') return;
      const month = b.date.substring(0, 7);
      if (!monthlyGroups[month]) monthlyGroups[month] = {};
      monthlyGroups[month][b.cid] = (monthlyGroups[month][b.cid] || 0) + 1;
    });

    return Object.keys(monthlyGroups)
      .sort()
      .reverse()
      .map((month) => {
        const counts = monthlyGroups[month];
        const topCid = Object.keys(counts).sort(
          (a, b) => counts[b] - counts[a],
        )[0];
        const category = get().categories.find(
          (c) => String(c.id) === String(topCid),
        );
        return { month, category, count: counts[topCid] };
      });
  },
}));
