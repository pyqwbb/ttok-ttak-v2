import React, { useState, useEffect, useMemo } from 'react';
import { useCategoryStore } from '@/stores/categoryStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { useGamificationStore } from '@/stores/gamificationStore';
import BaseModal from '@/components/common/BaseModal';
import CompleteModal from '@/components/common/CompleteModal';
import './transaction-modal.css';

export default function TransactionModal({ transaction, onClose, onSubmit }) {
  const {
    categories,
    loading: categoryLoading,
    error: categoryError,
    getCategories,
  } = useCategoryStore();

  const {
    transactions,
    createTransaction,
    updateTransaction,
    loading: transactionLoading,
  } = useTransactionStore();

  const { resolveMessage } = useGamificationStore();

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
  const [completeInfo, setCompleteInfo] = useState(null); // { icon, title, message } | null

  useEffect(() => {
    if (categories.length === 0) {
      getCategories();
    }
  }, [categories.length, getCategories]);

  const filteredCategories = useMemo(
    () => categories.filter((cat) => cat.type === form.type),
    [categories, form.type],
  );

  const handleTypeChange = (type) => {
    setForm({ ...form, type, cid: '' });
  };

  const handleSubmit = async () => {
    setErrorMsg('');

    if (!form.date || !form.title.trim() || !form.amount || !form.cid) {
      setErrorMsg('필수 항목을 입력해주세요.');
      return;
    }

    if (form.amount <= 0) {
      setErrorMsg('금액은 0보다 커야 합니다.');
      return;
    }

    const payload = {
      ...form,
      amount: parseInt(form.amount),
      cid: parseInt(form.cid),
    };

    try {
      if (isEditMode) {
        await updateTransaction(transaction.id, payload);
        setCompleteInfo({
          icon: '✓',
          title: '수정 완료',
          message: '',
        });
        return;
      }

      await createTransaction(payload);

      // 신규 등록 성공 시에만 리액션 메시지 노출
      const matchedCategory = filteredCategories.find(
        (c) => String(c.id) === String(payload.cid),
      );
      const categoryName = matchedCategory?.name ?? '';
      const categoryIcon = matchedCategory?.img ?? '🎉';

      const monthStr = payload.date.slice(0, 7);
      const list = Array.isArray(transactions) ? transactions : [];
      // 방금 등록한 거래는 아직 목록에 반영되지 않았을 수 있어 +1
      const count =
        list.filter(
          (t) =>
            String(t.cid) === String(payload.cid) &&
            t.date?.startsWith(monthStr),
        ).length + 1;

      const message = resolveMessage(payload.cid, count, categoryName);
      setCompleteInfo({ icon: categoryIcon, title: '등록 완료', message });
    } catch (e) {
      setErrorMsg('거래 저장에 실패했습니다.');
      console.error('Failed to save transaction:', e);
    }
  };

  // 완료 모달을 닫을 때 실제로 부모에게 완료를 알림
  const handleCompleteClose = () => {
    setCompleteInfo(null);
    onSubmit?.();
  };

  const footer = (
    <div style={{ display: 'flex', gap: '12px' }}>
      <button className="btn-cancel" onClick={onClose}>
        취소
      </button>
      <button
        className="btn-submit"
        disabled={transactionLoading}
        onClick={handleSubmit}
      >
        {transactionLoading ? '처리 중...' : isEditMode ? '수정' : '등록'}
      </button>
    </div>
  );

  return (
    <>
      {!completeInfo && (
        <BaseModal
          title={isEditMode ? '거래 수정' : '거래 등록'}
          onClose={onClose}
          footer={footer}
        >
          <div className="form">
            <div className="type-toggle">
              <button
                className={`type-btn ${form.type === 'expense' ? 'active' : ''}`}
                onClick={() => handleTypeChange('expense')}
              >
                지출
              </button>
              <button
                className={`type-btn ${form.type === 'income' ? 'active' : ''}`}
                onClick={() => handleTypeChange('income')}
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
                disabled={categoryLoading}
              >
                <option value="">카테고리를 선택해주세요</option>
                {filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.img} {cat.name}
                  </option>
                ))}
              </select>
              {categoryError && <p className="error">{categoryError}</p>}
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
      )}

      {completeInfo && (
        <CompleteModal
          icon={completeInfo.icon}
          title={completeInfo.title}
          message={completeInfo.message}
          onClose={handleCompleteClose}
        />
      )}
    </>
  );
}
