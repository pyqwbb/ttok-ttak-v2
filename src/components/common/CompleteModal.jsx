import React from 'react';
import './complete-modal.css';

export default function CompleteModal({ icon = '✓', title, message, onClose }) {
  return (
    <div className="complete-modal-overlay" onClick={onClose}>
      <div
        className="complete-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="complete-icon">{icon}</div>

        {title && <h3 className="complete-title">{title}</h3>}

        {message && <p className="complete-message">{message}</p>}
      </div>
    </div>
  );
}
