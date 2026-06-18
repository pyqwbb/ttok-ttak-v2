import React, { useEffect } from 'react';
import './reaction-modal.css';

export default function ReactionModal({ message, onClose }) {
  useEffect(() => {
    // 2초 후 자동으로 닫기
    const timer = setTimeout(() => {
      onClose?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="reaction-modal-overlay" onClick={onClose}>
      <div className="reaction-modal-content">
        <p className="reaction-message">{message || '축하합니다!'}</p>
      </div>
    </div>
  );
}
