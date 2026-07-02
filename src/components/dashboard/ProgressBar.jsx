import { useEffect, useMemo } from 'react';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useCategoryBudgetStore } from '@/stores/categoryBudgetStore';
import './progress-bar.css';

export default function ProgressBar() {
  const { transactions, getTransactions } = useTransactionStore();
  const { categories, getCategories } = useCategoryStore();
  const { categoryBudget, getCategoryBudget } = useCategoryBudgetStore();

  useEffect(() => {
    getTransactions();
    getCategories();
    getCategoryBudget();
  }, []);

  // 지출 카테고리만 로컬 필터링
  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === 'expense'),
    [categories],
  );

  // 이번 달 지출 top 5 카테고리 + 예산(goalAmount) 매칭
  const chartData = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const list = Array.isArray(transactions) ? transactions : [];
    const budgets = Array.isArray(categoryBudget) ? categoryBudget : [];

    const monthlyExpenses = list.filter(
      (t) => t.type === 'expense' && t.date?.startsWith(currentMonth),
    );

    const amountMap = {};
    monthlyExpenses.forEach((t) => {
      const key = String(t.cid);
      amountMap[key] = (amountMap[key] ?? 0) + t.amount;
    });

    return Object.keys(amountMap)
      .map((cid) => {
        const category = expenseCategories.find((c) => String(c.id) === cid);
        const budget = budgets.find((b) => String(b.cid) === cid);

        return {
          id: cid,
          name: category?.name ?? '알 수 없음',
          img: category?.img ?? '❓',
          color: category?.color ?? '#cccccc',
          amount: amountMap[cid],
          goalAmount: budget?.amount ?? null,
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions, expenseCategories, categoryBudget]);

  return (
    <div className="category-list">
      {chartData.map((item, i) => (
        <div
          key={item.id}
          className="category-item"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="category-row">
            <span
              className="category-icon"
              style={{ background: (item?.color ?? '#eee') + '33' }}
            >
              {item.img}
            </span>
            <span className="category-name">{item.name}</span>
            <span className="category-amount" style={{ color: item.color }}>
              {item.amount.toLocaleString()}원
            </span>
          </div>

          {item.goalAmount ? (
            <>
              <div className="progress-bar-wrap">
                <div
                  className="progress-bar-fill"
                  style={{
                    '--fill-width': `${Math.min(
                      Math.round((item.amount / item.goalAmount) * 100),
                      100,
                    )}%`,
                    backgroundColor: item.color,
                    animationDelay: `${i * 60 + 200}ms`,
                  }}
                ></div>
              </div>
              <span
                className="progress-pct"
                style={{
                  color: item.color,
                }}
              >
                {Math.min(
                  Math.round((item.amount / item.goalAmount) * 100),
                  100,
                )}
                %
              </span>
            </>
          ) : (
            <p className="no-budget">설정된 목표 예산이 없어요</p>
          )}
        </div>
      ))}
    </div>
  );
}
