import { useMemo } from 'react';
import placeholder from '@/assets/icons/placeholder.svg';
import '@/assets/styles/badge-grid.css';

export default function BadgeGrid({ monthlyTopCountCategories = [] }) {
  const badges = useMemo(() => {
    const result = Array(6).fill(null);

    monthlyTopCountCategories.slice(0, 6).forEach((data, index) => {
      if (data.category) {
        const [year, month] = data.month.split('-');
        result[index] = {
          emoji: data.category.img,
          title: `${year.slice(-2)}년 ${parseInt(month)}월 지출 빈도가 높은 카테고리: ${data.category.name} (${data.count}회)`,
        };
      }
    });

    return result;
  }, [monthlyTopCountCategories]);

  const getBadgeIndex = (row, col) => (row - 1) * 3 + (col - 1);
  const getBadgeEmoji = (row, col) =>
    badges[getBadgeIndex(row, col)]?.emoji ?? null;
  const getBadgeTitle = (row, col) =>
    badges[getBadgeIndex(row, col)]?.title ?? '';

  return (
    <div className="user-badge">
      <p>획득한 뱃지</p>
      <div className="badge-grid">
        {[1, 2].map((row) => (
          <div key={row} className="grid-row">
            {[1, 2, 3].map((col) => (
              <div
                key={`${row}-${col}`}
                className="badge-item"
                title={getBadgeTitle(row, col)}
              >
                {getBadgeEmoji(row, col) ? (
                  <span className="badge-emoji">{getBadgeEmoji(row, col)}</span>
                ) : (
                  <img src={placeholder} alt="뱃지" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
