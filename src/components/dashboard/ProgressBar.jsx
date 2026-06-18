import React from 'react';
import './progress-bar.css';

export default function ProgressBar({ chartData }) {
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
