// src/components/dashboard/BubbleChart.jsx
import { useState, useRef, useEffect, useMemo } from 'react';
import '@/assets/styles/bubble-chart.css';

export default function BubbleChart({ chartData, expenseCount }) {
  const bubbleWrapRef = useRef(null);
  const [bubbles, setBubbles] = useState([]);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    data: null,
  });

  const svgSize = 300;

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

  // chartData 바뀔 때마다 버블 재배치
  useEffect(() => {
    if (chartData?.length) {
      setBubbles(placeBubbles(chartData));
    }
  }, [chartData]);

  // 툴팁 표시
  const showTooltip = (e, bubble) => {
    const rect = bubbleWrapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTooltip({
      visible: true,
      // 오른쪽 밖으로 나가면 왼쪽에 표시
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

  if (!chartData?.length) return null;

  return (
    <div className="bubble-wrap" ref={bubbleWrapRef}>
      {/* 툴팁 */}
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
            {/* 버블 원 */}
            <circle
              cx={bubble.cx}
              cy={bubble.cy}
              r={bubble.r}
              fill={bubble.color + 'AA'}
              stroke={bubble.color}
              strokeWidth="1"
              className="bubble-circle"
              style={{
                animationDelay: `${i * 80}ms`,
                '--target-r': `${bubble.r}px`,
              }}
            />

            {/* 비율 텍스트 */}
            <text
              x={bubble.cx}
              y={bubble.cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={Math.max(11, Math.round(bubble.r * 0.28))}
              fontWeight="500"
              fill="#444"
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
