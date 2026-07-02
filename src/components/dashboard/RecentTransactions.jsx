import { useEffect, useMemo } from 'react';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';
import './recent-transactions.css';

export default function RecentTransactions({ limit = 5 }) {
  const { transactions, loading, error, getTransactions } =
    useTransactionStore();
  const { categories, getCategories } = useCategoryStore();

  useEffect(() => {
    getTransactions();
    getCategories();
  }, []);

  // 날짜 최신순 정렬 후 상위 N개만
  const recentTransactions = useMemo(() => {
    const list = Array.isArray(transactions) ? transactions : [];
    return [...list]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }, [transactions, limit]);

  const getCategory = (cid) =>
    categories.find((c) => String(c.id) === String(cid));

  return (
    <div className="recent-card">
      <h3 className="recent-title">최근 거래 내역</h3>

      {loading && recentTransactions.length === 0 && (
        <p className="recent-empty">불러오는 중...</p>
      )}

      {!loading && recentTransactions.length === 0 && (
        <p className="recent-empty">최근 거래 내역이 없어요</p>
      )}

      {error && <p className="error">{error}</p>}

      <div className="recent-list">
        {recentTransactions.map((item) => {
          const category = getCategory(item.cid);
          return (
            <div key={item.id} className="recent-item">
              <div
                className="recent-icon"
                style={{ background: (category?.color ?? '#eee') + '33' }}
              >
                {category?.img ?? '❓'}
              </div>

              <p className="recent-name">{item.title ?? category?.name}</p>

              <p
                className={`recent-amount ${
                  item.type === 'income' ? 'income' : 'expense'
                }`}
              >
                {item.type === 'income' ? '+' : '-'}
                {item.amount.toLocaleString()}
                <span className="recent-unit">원</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
