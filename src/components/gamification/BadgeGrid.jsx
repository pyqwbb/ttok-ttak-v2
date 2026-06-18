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

  return (
    <div className="user-badge">
      <p>획득한 뱃지</p>
      <div className="badge-grid">
        {badges.map((badge, index) => (
          <div key={index} className="badge-item" title={badge?.title ?? ''}>
            {badge?.emoji ? (
              <span className="badge-emoji">{badge.emoji}</span>
            ) : (
              <img src={placeholder} alt="뱃지" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
