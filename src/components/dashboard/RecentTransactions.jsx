import './recent-transactions.css';

export default function RecentTransactions({ transactions, categories }) {
  const getCategory = (cid) =>
    categories.find((c) => String(c.id) === String(cid));

  return (
    <div className="recent-card">
      <h3 className="recent-title">최근 거래 내역</h3>

      <div className="recent-list">
        {transactions.map((item) => {
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
