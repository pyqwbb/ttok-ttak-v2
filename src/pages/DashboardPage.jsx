import { useState, useEffect, useMemo } from 'react';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useUserStore } from '@/stores/userStore';
import { useReactionStore } from '@/stores/reactionStore';
import MonthSelector from '@/components/common/MonthSelector';
import SummaryCards from '@/components/dashboard/SummaryCards';
import BubbleChart from '@/components/dashboard/BubbleChart';
import ProgressBar from '@/components/dashboard/ProgressBar';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import './dashboard-page.css';

export default function DashboardView() {
  const {
    transactions,
    loading: transactionLoading,
    getTransactions,
  } = useTransactionStore();
  const {
    categories,
    loading: categoryLoading,
    getCategories,
  } = useCategoryStore();
  const userStore = useUserStore();
  const { monthlySummaryMessages, fetchMonthlySummaryMessages } =
    useReactionStore();

  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // 데이터 fetch는 여기서 한 번만 수행 (자식 컴포넌트는 props로만 받음)
  useEffect(() => {
    const uid = userStore.user?.id || localStorage.getItem('userId');

    if (!hasLoaded && uid) {
      getTransactions();
      getCategories();
      fetchMonthlySummaryMessages();
      setHasLoaded(true);
    }
  }, [hasLoaded]);

  // 이번 달 지출을 카테고리별로 집계 -> 지출 1위 / 횟수 1위 카테고리 도출
  const { hasExpenses, topExpenseCategory, topCountCategory } = useMemo(() => {
    const thisMonth = new Date().toISOString().slice(0, 7);
    const list = Array.isArray(transactions) ? transactions : [];
    const monthlyExpenses = list.filter(
      (t) => t.type === 'expense' && t.date?.startsWith(thisMonth),
    );

    const amountMap = {};
    const countMap = {};
    monthlyExpenses.forEach((t) => {
      const key = String(t.cid);
      amountMap[key] = (amountMap[key] ?? 0) + t.amount;
      countMap[key] = (countMap[key] ?? 0) + 1;
    });

    const summarize = (cid) => ({
      id: cid,
      name: categories.find((c) => String(c.id) === cid)?.name ?? '알 수 없음',
    });

    const topExpenseCid = Object.keys(amountMap).sort(
      (a, b) => amountMap[b] - amountMap[a],
    )[0];
    const topCountCid = Object.keys(countMap).sort(
      (a, b) => countMap[b] - countMap[a],
    )[0];

    return {
      hasExpenses: monthlyExpenses.length > 0,
      topExpenseCategory: topExpenseCid ? summarize(topExpenseCid) : null,
      topCountCategory: topCountCid ? summarize(topCountCid) : null,
    };
  }, [transactions, categories]);

  const messages = (monthlySummaryMessages ?? []).filter(
    (m) => String(m.cid) === String(topExpenseCategory?.id),
  );

  const summaryMessage =
    messages[Math.floor(Math.random() * messages.length)]?.message ??
    '이번 달 소비 패턴을 분석 중이에요.';

  if (transactionLoading || categoryLoading) {
    return <div className="loading">로딩중...</div>;
  }

  return (
    <div className="chart-page">
      <div className="dashboard-header">
        <MonthSelector currentDate={currentDate} onChange={setCurrentDate} />
        {summaryMessage && (
          <div className="summary-message">{summaryMessage}</div>
        )}
      </div>

      <div className="dashboard-content">
        <div className="left-section">
          <SummaryCards transactions={transactions} />

          {hasExpenses ? (
            <div className="content">
              <div>
                <p className="subtitle">카테고리 별 수입/지출</p>
                <h2 className="title">
                  {topCountCategory
                    ? `${topCountCategory.name}에 가장 많이 지출하고 있어요`
                    : '이번 달 지출 내역이 없어요'}
                </h2>
              </div>
              <div className="content-main">
                <div className="content-item">
                  <BubbleChart
                    transactions={transactions}
                    categories={categories}
                  />
                </div>

                <div className="content-item">
                  <ProgressBar
                    transactions={transactions}
                    categories={categories}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-icon">📭</p>
              <p className="empty-text">이번 달 지출 내역이 없어요</p>
            </div>
          )}
        </div>

        <div className="right-section">
          <RecentTransactions limit={5} />
        </div>
      </div>
    </div>
  );
}
