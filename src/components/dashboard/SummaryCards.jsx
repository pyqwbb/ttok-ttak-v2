import { useMemo } from 'react';
import './summary-cards.css';

export default function SummaryCards({ transactions }) {
  const currentMonth = new Date().toISOString().slice(0, 7);

  // 이번 달 거래만 필터링
  const monthlyTransactions = useMemo(() => {
    const list = Array.isArray(transactions) ? transactions : [];
    return list.filter((t) => t.date?.startsWith(currentMonth));
  }, [transactions, currentMonth]);

  const totalExpense = useMemo(() => {
    return monthlyTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthlyTransactions]);

  const totalIncome = useMemo(() => {
    return monthlyTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthlyTransactions]);

  const netIncome = totalIncome - totalExpense;

  const cards = [
    {
      icon: '📉',
      label: '지출',
      amount: totalExpense,
      className: 'expense',
    },
    {
      icon: '📈',
      label: '수입',
      amount: totalIncome,
      className: 'income',
    },
    {
      icon: '💰',
      label: '순수익',
      amount: netIncome,
      className: 'profit',
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card) => (
        <div className="summary-card" key={card.label}>
          <div className="card-icon">{card.icon}</div>

          <p className={`card-label ${card.className}`}>
            이번달 <span>{card.label}</span>
          </p>

          <h2 className="card-amount">{card.amount.toLocaleString()}원</h2>
        </div>
      ))}
    </div>
  );
}
