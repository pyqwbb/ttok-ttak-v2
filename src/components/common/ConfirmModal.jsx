import React from 'react';
import BaseModal from '@/components/common/BaseModal';

export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <BaseModal title={title} onClose={onCancel}>
      <p style={{ marginBottom: '20px', fontSize: '16px' }}>{message}</p>
      <div className="modal-footer" style={{ display: 'flex', gap: '12px' }}>
        <button className="btn-cancel" onClick={onCancel}>
          취소
        </button>
        <button className="btn-confirm" onClick={onConfirm}>
          확인
        </button>
      </div>
    </BaseModal>
  );
}
