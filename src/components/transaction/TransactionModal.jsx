import React, { useState, useMemo } from 'react';
import { useCategoryStore } from '@/stores/categoryStore';
import BaseModal from '@/components/common/BaseModal';
import '@/assets/styles/transaction-modal.css';

export default function TransactionModal({ transaction, onClose, onSubmit }) {
  const categoryStore = useCategoryStore();
  const isEditMode = transaction !== null;

  const [form, setForm] = useState({
    date: transaction?.date || new Date().toISOString().slice(0, 10),
    type: transaction?.type || 'expense',
    title: transaction?.title || '',
    amount: transaction?.amount || '',
    cid: transaction?.cid || '',
    memo: transaction?.memo || '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentCategories = useMemo(
    () => categoryStore.categories.filter((c) => c.type === form.type),
    [categoryStore.categories, form.type],
  );

  const handleSubmit = async () => {
    setErrorMsg('');

    // 유효성 검사
    if (!form.date || !form.title.trim() || !form.amount || !form.cid) {
      setErrorMsg('필수 항목을 입력해주세요.');
      return;
    }

    if (form.amount <= 0) {
      setErrorMsg('금액은 0보다 커야 합니다.');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: 실제 API 호출 - POST 또는 PUT
      console.log('거래 제출:', form);

      onSubmit?.({
        ...form,
        amount: parseInt(form.amount),
        cid: parseInt(form.cid),
      });
    } catch (e) {
      setErrorMsg('거래 저장에 실패했습니다.');
      console.error('Failed to save transaction:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const footer = (
    <div style={{ display: 'flex', gap: '12px' }}>
      <button className="btn-cancel" onClick={onClose}>
        취소
      </button>
      <button
        className="btn-submit"
        disabled={isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? '처리 중...' : isEditMode ? '수정' : '등록'}
      </button>
    </div>
  );

  return (
    <BaseModal
      title={isEditMode ? '거래 수정' : '거래 등록'}
      onClose={onClose}
      footer={footer}
    >
      <div className="form">
        <div className="type-toggle">
          <button
            className={`type-btn ${form.type === 'expense' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, type: 'expense', cid: '' })}
          >
            지출
          </button>
          <button
            className={`type-btn ${form.type === 'income' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, type: 'income', cid: '' })}
          >
            수입
          </button>
        </div>

        <div className="field">
          <label>제목</label>
          <input
            type="text"
            placeholder="예: 스타벅스 커피, 월급"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            maxLength={50}
          />
        </div>

        <div className="field">
          <label>날짜</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <div className="field">
          <label>금액</label>
          <input
            type="number"
            placeholder="금액을 입력해주세요"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            min="0"
          />
        </div>

        <div className="field">
          <label>카테고리</label>
          <select
            value={form.cid}
            onChange={(e) => setForm({ ...form, cid: e.target.value })}
          >
            <option value="">카테고리를 선택해주세요</option>
            {currentCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.img} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>
            메모 <span className="optional">(선택)</span>
          </label>
          <input
            type="text"
            placeholder="메모를 입력해주세요"
            value={form.memo}
            onChange={(e) => setForm({ ...form, memo: e.target.value })}
          />
        </div>

        {errorMsg && <p className="error">{errorMsg}</p>}
      </div>
    </BaseModal>
  );
}
