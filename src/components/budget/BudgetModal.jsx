import { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import BaseModal from '@/components/common/BaseModal';

export default function BudgetModal({
  budget,
  setBudgetCids,
  onClose,
  onSubmit,
}) {
  const userStore = useUserStore();
  const categoryStore = useCategoryStore();

  const isEditMode = budget !== null;

  const [form, setForm] = useState({
    cid: budget?.cid ?? '',
    amount: budget?.amount ?? '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 등록 모드: 예산 미설정 카테고리만 표시
  // 수정 모드: 현재 카테고리 고정
  const availableCategories = isEditMode
    ? categoryStore.categories.filter(
        (c) => String(c.id) === String(budget.cid),
      )
    : categoryStore.categories.filter(
        (c) => !setBudgetCids.includes(String(c.id)),
      );

  const handleSubmit = async () => {
    setErrorMsg('');

    if (!form.cid) {
      setErrorMsg('카테고리를 선택해주세요.');
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setErrorMsg('올바른 금액을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const uid = userStore.user?.id ?? localStorage.getItem('userId');

      // 실제 API 연결 예정
      // if (isEditMode) {
      //   const { data } = await api.put(`/category-budget/${budget.id}`, { amount: form.amount })
      //   onSubmit(data)
      // } else {
      //   const { data } = await api.post('/category-budget', { uid, ...form })
      //   onSubmit(data)
      // }

      // 임시 처리
      const saved = {
        id: budget?.id ?? String(Date.now()),
        uid,
        cid: form.cid,
        amount: Number(form.amount),
      };
      console.log(isEditMode ? '예산 수정:' : '예산 등록:', saved);
      onSubmit(saved);
    } catch (e) {
      setErrorMsg('처리 중 오류가 발생했어요. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal
      title={isEditMode ? '예산 수정' : '예산 추가'}
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          <button className="btn-cancel" onClick={onClose}>
            취소
          </button>
          <button
            className="btn-primary"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? '저장 중...' : isEditMode ? '수정' : '추가'}
          </button>
        </div>
      }
    >
      <div className="form">
        {/* 카테고리 */}
        <div className="field">
          <label>카테고리</label>
          <select
            value={form.cid}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, cid: e.target.value }))
            }
            disabled={isEditMode} // 수정 모드에서는 카테고리 변경 불가
          >
            <option value="" disabled>
              카테고리를 선택해주세요
            </option>
            {availableCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.img} {cat.name}
              </option>
            ))}
          </select>
          {isEditMode && (
            <p className="field-hint">
              수정 모드에서는 카테고리를 변경할 수 없어요.
            </p>
          )}
        </div>

        {/* 예산 금액 */}
        <div className="field">
          <label>월 예산 금액</label>
          <input
            type="number"
            placeholder="금액을 입력해주세요"
            value={form.amount}
            min="0"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, amount: e.target.value }))
            }
            onKeyUp={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
          />
        </div>

        {errorMsg && <p className="error">{errorMsg}</p>}
      </div>
    </BaseModal>
  );
}
