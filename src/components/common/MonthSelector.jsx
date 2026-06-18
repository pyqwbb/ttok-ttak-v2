import './month-selector.css';

export default function MonthSelector({ currentDate, onChange }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const changeMonth = (offset) => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + offset);
    onChange(next);
  };

  return (
    <div className="month-selector">
      <button
        className="month-arrow"
        onClick={() => changeMonth(-1)}
        aria-label="이전 달"
      >
        ◀
      </button>
      <span className="month-label">{month}월</span>
      <button
        className="month-arrow"
        onClick={() => changeMonth(1)}
        aria-label="다음 달"
      >
        ▶
      </button>
    </div>
  );
}
