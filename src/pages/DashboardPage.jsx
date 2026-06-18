import { useState, useEffect } from 'react';
import { useCategoryStore } from '@/stores/categoryStore';
import { useUserStore } from '@/stores/userStore';
import { useReactionStore } from '@/stores/reactionStore';
import MonthSelector from '@/components/common/MonthSelector';
import SummaryCards from '@/components/dashboard/SummaryCards';
import BubbleChart from '@/components/dashboard/bubbleChart';
import ProgressBar from '@/components/dashboard/ProgressBar';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import './dashboard-page.css';

export default function DashboardView() {
  const store = useCategoryStore();
  const userStore = useUserStore();
  const reactionStore = useReactionStore();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const messages = reactionStore.monthlySummaryMessages.filter(
    (m) => String(m.cid) === String(store.topExpenseCategory?.id),
  );

  const summaryMessage =
    messages[Math.floor(Math.random() * messages.length)]?.message ??
    '이번 달 소비 패턴을 분석 중이에요.';

  const recentBudgets = store.budgets
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  useEffect(() => {
    const uid = userStore.user?.id || localStorage.getItem('userId');

    if (!hasLoaded && uid && !store.isLoading) {
      store.fetchAll(uid);
      reactionStore.fetchMonthlySummaryMessages();
      setHasLoaded(true);
    }
  }, [hasLoaded]);

  if (store.isLoading) {
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
          <SummaryCards />

          {store.chartData.length > 0 ? (
            <div className="content">
              <div>
                <p className="subtitle">카테고리 별 수입/지출</p>
                <h2 className="title">
                  {store.topCountCategory
                    ? `${store.topCountCategory.name}에 가장 많이 지출하고 있어요`
                    : '이번 달 지출 내역이 없어요'}
                </h2>
              </div>
              <div className="content-main">
                <div className="content-item">
                  <BubbleChart
                    chartData={store.chartData}
                    expenseCount={store.expenseCountByCategory}
                  />
                </div>

                <div className="content-item">
                  <ProgressBar chartData={store.chartData} />
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
          <RecentTransactions
            transactions={recentBudgets}
            categories={store.categories}
          />
        </div>
      </div>
    </div>
  );
}
