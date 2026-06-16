import { useState, useEffect } from 'react';
import MonthSelector from '@/components/common/MonthSelector';
import { useCategoryStore } from '@/stores/categoryStore';
import { useUserStore } from '@/stores/userStore';
import { useReactionStore } from '@/stores/reactionStore';
import BubbleChart from '@/components/dashboard/bubbleChart';
import ProgressBar from '@/components/dashboard/ProgressBar';
import '@/assets/styles/dashboard.css';

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

      <div>
        <p className="subtitle">카테고리 별 수입/지출</p>
        <h2 className="title">
          {store.topCountCategory
            ? `${store.topCountCategory.img} ${store.topCountCategory.name}에 가장 자주 지출하고 있어요`
            : '이번 달 지출 내역이 없어요'}
        </h2>
      </div>

      {store.chartData.length > 0 ? (
        <div className="content">
          <BubbleChart
            chartData={store.chartData}
            expenseCount={store.expenseCountByCategory}
          />
          <ProgressBar chartData={store.chartData} />
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-icon">📭</p>
          <p className="empty-text">이번 달 지출 내역이 없어요</p>
        </div>
      )}
    </div>
  );
}
