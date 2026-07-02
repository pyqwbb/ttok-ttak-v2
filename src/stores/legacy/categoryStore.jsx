// ================================================================
// stores/categoryStore.js (React Context + Hooks)
// 카테고리별 지출 분석 스토어
// - 카테고리 목록, 목표 예산, 실제 지출 내역을 관리
// - 이달의 지출 통계 및 차트용 데이터를 useMemo로 제공
// ================================================================

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { categoryApi } from '@/api/category';

const CategoryContext = createContext();

export const LegacyCategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 간단한 계산 함수들
  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === 'expense'),
    [categories],
  );

  const incomeCategories = useMemo(
    () => categories.filter((c) => c.type === 'income'),
    [categories],
  );

  // 이번 달 지출 내역만 필터링
  const currentMonthBudgets = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return budgets.filter(
      (b) => b.type === 'expense' && b.date.startsWith(`${year}-${month}`),
    );
  }, [budgets]);

  // 카테고리 ID별 이번 달 지출 금액 합산
  const expenseByCategory = useMemo(() => {
    const map = {};
    currentMonthBudgets.forEach((b) => {
      map[b.cid] = (map[b.cid] || 0) + b.amount;
    });
    return map;
  }, [currentMonthBudgets]);

  // 이번 달 전체 지출 총액
  const totalExpense = useMemo(
    () => Object.values(expenseByCategory).reduce((a, b) => a + b, 0),
    [expenseByCategory],
  );

  // 이번 달 지출액이 가장 큰 카테고리
  const topExpenseCategory = useMemo(() => {
    const map = expenseByCategory;
    const topCid = Object.keys(map).sort((a, b) => map[b] - map[a])[0];
    return categories.find((c) => c.id === topCid) || null;
  }, [expenseByCategory, categories]);

  // 카테고리 ID별 이번 달 지출 횟수
  const expenseCountByCategory = useMemo(() => {
    const map = {};
    currentMonthBudgets.forEach((b) => {
      map[b.cid] = (map[b.cid] || 0) + 1;
    });
    return map;
  }, [currentMonthBudgets]);

  // 이번 달 지출 횟수가 가장 많은 카테고리
  const topCountCategory = useMemo(() => {
    const map = expenseCountByCategory;
    const topCid = Object.keys(map).sort((a, b) => map[b] - map[a])[0];
    return categories.find((c) => c.id === String(topCid)) || null;
  }, [expenseCountByCategory, categories]);

  // 버블 차트 및 카테고리 리스트용 데이터
  const chartData = useMemo(() => {
    const map = expenseByCategory;
    const total = totalExpense;
    return categories
      .filter((c) => map[c.id])
      .map((c) => ({
        ...c,
        amount: map[c.id],
        ratio: total > 0 ? Math.round((map[c.id] / total) * 100) : 0,
        goalAmount:
          categoryBudgets.find((b) => String(b.cid) === String(c.id))?.amount ||
          null,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenseByCategory, totalExpense, categories, categoryBudgets]);

  // 월별 지출 '빈도(횟수)'가 가장 높은 카테고리 목록
  const monthlyTopCountCategories = useMemo(() => {
    const monthlyGroups = {};

    budgets.forEach((b) => {
      if (b.type !== 'expense') return;

      const month = b.date.substring(0, 7);
      if (!monthlyGroups[month]) {
        monthlyGroups[month] = {};
      }

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
        const category = categories.find(
          (c) => String(c.id) === String(topCid),
        );

        return {
          month,
          category,
          count: counts[topCid],
        };
      });
  }, [budgets, categories]);

  // 전체 데이터 fetch
  const fetchAll = useCallback(async (uid) => {
    setIsLoading(true);
    try {
      const [catRes, budgetRes, expenseRes] = await Promise.all([
        categoryApi.getCategories(),
        categoryApi.getCategoryBudgets(uid),
        categoryApi.getBudgets(uid),
      ]);
      setCategories(catRes.data.map((c) => ({ ...c, id: String(c.id) })));
      setCategoryBudgets(budgetRes.data);
      setBudgets(expenseRes.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      categories,
      categoryBudgets,
      budgets,
      isLoading,
      expenseByCategory,
      totalExpense,
      topExpenseCategory,
      expenseCountByCategory,
      topCountCategory,
      monthlyTopCountCategories,
      chartData,
      fetchAll,
      expenseCategories,
      incomeCategories,
    }),
    [
      categories,
      categoryBudgets,
      budgets,
      isLoading,
      expenseByCategory,
      totalExpense,
      topExpenseCategory,
      expenseCountByCategory,
      topCountCategory,
      monthlyTopCountCategories,
      chartData,
      fetchAll,
      expenseCategories,
      incomeCategories,
    ],
  );

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useLegacyCategoryStore = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error(
      'useLegacyCategoryStore  must be used within LegacyCategoryProvider',
    );
  }
  return context;
};
