import { useMemo } from 'react';
import placeholder from '@/assets/icons/placeholder.svg';
import './badge-grid.css';

export default function BadgeGrid({ monthlyTopCountCategories = [] }) {
  const badges = useMemo(() => {
    const result = Array(6).fill(null);

    // month별로 그룹핑 (동률 count가 여러 카테고리로 나뉠 수 있음)
    const byMonth = new Map();
    monthlyTopCountCategories.forEach((data) => {
      if (!byMonth.has(data.month)) {
        byMonth.set(data.month, []);
      }
      byMonth.get(data.month).push(data);
    });

    // month 최신순 정렬 후, 동률이면 그 중 랜덤 하나만 뱃지로 채택
    const months = [...byMonth.keys()].sort((a, b) => (a < b ? 1 : -1));

    months.slice(0, 6).forEach((month, index) => {
      const candidates = byMonth.get(month);
      const picked = candidates[Math.floor(Math.random() * candidates.length)];

      const [year, monthNum] = picked.month.split('-');
      result[index] = {
        emoji: picked.categoryImg,
        title: `${year.slice(-2)}년 ${parseInt(monthNum)}월 지출 빈도가 높은 카테고리: ${picked.categoryName} (${picked.count}회)`,
      };
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
