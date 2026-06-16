import { useMemo } from 'react';
import { useCategoryStore } from '@/stores/categoryStore';
import '@/assets/styles/summaryCards.css';

export default function SummaryCards() {
  const { budgets, totalExpense } = useCategoryStore();

  const currentMonth = new Date().toISOString().slice(0, 7);

  const totalIncome = useMemo(() => {
    return budgets
      .filter((b) => b.type === 'income' && b.date.startsWith(currentMonth))
      .reduce((sum, b) => sum + b.amount, 0);
  }, [budgets]);

  const netIncome = totalIncome - totalExpense;

  const cards = [
    {
      icon: '📉',
      label: '이번달 지출',
      amount: totalExpense,
      className: 'expense',
    },
    {
      icon: '📈',
      label: '이번달 수입',
      amount: totalIncome,
      className: 'income',
    },
    {
      icon: '💰',
      label: '이번달 순수익',
      amount: netIncome,
      className: 'profit',
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card) => (
        <div className="summary-card" key={card.label}>
          <div className="card-icon">{card.icon}</div>

          <p className={`card-label ${card.className}`}>{card.label}</p>

          <h2 className="card-amount">{card.amount.toLocaleString()}원</h2>
        </div>
      ))}
    </div>
  );
}
