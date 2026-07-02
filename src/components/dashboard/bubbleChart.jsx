import { useState, useRef, useEffect, useMemo } from 'react';
import './bubble-chart.css';

export default function BubbleChart({ transactions, categories }) {
  const bubbleWrapRef = useRef(null);
  const [bubbles, setBubbles] = useState([]);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    data: null,
  });

  const svgSize = 300;

  // 지출 카테고리만 로컬 필터링
  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === 'expense'),
    [categories],
  );

  const { chartData, expenseCount } = useMemo(() => {
    const list = Array.isArray(transactions) ? transactions : [];
    const expenses = list.filter((t) => t.type === 'expense');

    const amountMap = {};
    const countMap = {};
    expenses.forEach((t) => {
      const key = String(t.cid);
      amountMap[key] = (amountMap[key] ?? 0) + t.amount;
      countMap[key] = (countMap[key] ?? 0) + 1;
    });

    const totalExpense = Object.values(amountMap).reduce(
      (sum, v) => sum + v,
      0,
    );

    const data = Object.keys(amountMap)
      .map((cid) => {
        const category = expenseCategories.find((c) => String(c.id) === cid);
        const amount = amountMap[cid];
        return {
          id: cid,
          name: category?.name ?? '알 수 없음',
          img: category?.img ?? '❓',
          color: category?.color ?? '#cccccc',
          amount,
          ratio: totalExpense ? Math.round((amount / totalExpense) * 100) : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return { chartData: data, expenseCount: countMap };
  }, [transactions, expenseCategories]);

  // 겹침 방지 버블 배치 알고리즘
  const placeBubbles = (data) => {
    const placed = [];
    const maxAmount = Math.max(...data.map((d) => d.amount));

    for (const d of data) {
      const r = Math.max(
        12,
        Math.round((d.amount / maxAmount) * (svgSize * 0.32)),
      );

      let cx,
        cy,
        attempts = 0;

      do {
        cx = Math.random() * (svgSize - r * 2) + r;
        cy = Math.random() * (svgSize - r * 2) + r;
        attempts++;
      } while (
        attempts < 50 &&
        placed.some((p) => {
          const dist = Math.sqrt((cx - p.cx) ** 2 + (cy - p.cy) ** 2);
          return dist < (r + p.r) * 0.3;
        })
      );

      placed.push({ ...d, cx, cy, r });
    }

    return placed;
  };

  useEffect(() => {
    if (chartData.length) {
      setBubbles(placeBubbles(chartData));
    } else {
      setBubbles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData]);

  const showTooltip = (e, bubble) => {
    const rect = bubbleWrapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTooltip({
      visible: true,
      x: x + 140 > rect.width ? x - 145 : x + 12,
      y: y - 10,
      data: bubble,
    });
  };

  const moveTooltip = (e) => {
    const rect = bubbleWrapRef.current?.getBoundingClientRect();
    if (!rect || !tooltip.visible) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTooltip((prev) => ({
      ...prev,
      x: x + 140 > rect.width ? x - 145 : x + 12,
      y: y - 10,
    }));
  };

  const hideTooltip = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  if (!chartData.length) return null;

  return (
    <div className="bubble-wrap" ref={bubbleWrapRef}>
      {tooltip.visible && (
        <div
          className="bubble-tooltip"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          <span className="tooltip-icon">{tooltip.data?.img}</span>
          <div className="tooltip-body">
            <p className="tooltip-name">{tooltip.data?.name}</p>
            <p className="tooltip-amount">
              {tooltip.data?.amount.toLocaleString()}원
            </p>
            <p className="tooltip-count">
              {expenseCount?.[tooltip.data?.id] ?? 0}회 지출
            </p>
            <p className="tooltip-ratio">전체의 {tooltip.data?.ratio}%</p>
          </div>
        </div>
      )}

      <svg
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        width={svgSize}
        height={svgSize}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          overflow: 'visible',
        }}
      >
        {bubbles.map((bubble, i) => (
          <g
            key={bubble.id}
            className="bubble-group"
            onMouseEnter={(e) => showTooltip(e, bubble)}
            onMouseMove={moveTooltip}
            onMouseLeave={hideTooltip}
          >
            <circle
              cx={bubble.cx}
              cy={bubble.cy}
              r={bubble.r}
              fill={bubble.color + '4D'}
              strokeWidth="1"
              className="bubble-circle"
              style={{
                animationDelay: `${i * 80}ms`,
                '--target-r': `${bubble.r}px`,
              }}
            />

            <text
              x={bubble.cx}
              y={bubble.cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={Math.max(11, Math.round(bubble.r * 0.4))}
              fontWeight="bold"
              fill={bubble.color}
              className="bubble-label"
              style={{
                animationDelay: `${i * 80 + 300}ms`,
                pointerEvents: 'none',
              }}
            >
              {bubble.ratio}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}