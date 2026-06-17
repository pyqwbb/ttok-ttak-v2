import { useState, useEffect } from 'react';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useUserStore } from '@/store/useUserStore';
import { useReactionStore } from '@/store/useReactionStore';
import MonthSelector from '@/components/common/MonthSelector';
import SummaryCards from '@/components/dashboard/SummaryCards';
import BubbleChart from '@/components/dashboard/bubbleChart';
import ProgressBar from '@/components/dashboard/ProgressBar';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import '@/assets/styles/dashboard.css';

export default function DashboardView() {
  const store = useCategoryStore();
  const userStore = useUserStore();
  const reactionStore = useReactionStore();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // 💡 [수정] Zustand 게터 함수 호출 방식으로 변경
  const topExpenseCategory = store.getTopExpenseCategory();
  const chartData = store.getChartData();
  const topCountCategory = store.getTopCountCategory();
  const expenseCountByCategory = store.getExpenseCountByCategory();

  // 💡 [수정] topExpenseCategory?.id 기반으로 필터링하도록 수정
  const messages = reactionStore.monthlySummaryMessages.filter(
    (m) => String(m.cid) === String(topExpenseCategory?.id),
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
  }, [hasLoaded, userStore.user?.id, store, reactionStore]); // 의존성 배열 보완

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

          {/* 💡 [수정] 변수명 매핑 */}
          {chartData.length > 0 ? (
            <div className="content">
              <div>
                <p className="subtitle">카테고리 별 수입/지출</p>
                <h2 className="title">
                  {topCountCategory
                    ? `${topCountCategory.name}에 가장 자주 지출하고 있어요`
                    : '이번 달 지출 내역이 없어요'}
                </h2>
              </div>
              <div className="content-main">
                <div className="content-item">
                  <BubbleChart
                    chartData={chartData}
                    expenseCount={expenseCountByCategory}
                  />
                </div>

                <div className="content-item">
                  <ProgressBar chartData={chartData} />
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
