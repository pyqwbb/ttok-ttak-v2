import React from 'react';
import './complete-modal.css';

export default function CompleteModal({ message, onClose }) {
  return (
    <div className="complete-modal-overlay" onClick={onClose}>
      <div className="complete-modal-content">
        <div className="complete-icon">✓</div>
        <p className="complete-message">{message || '완료되었습니다!'}</p>
      </div>
    </div>
  );
}
