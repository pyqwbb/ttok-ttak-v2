import { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useCategoryBudgetStore } from '@/stores/categoryBudgetStore';
import BaseModal from '@/components/common/BaseModal';

export default function BudgetModal({
  budget,
  setBudgetCids,
  onClose,
  onSubmit,
}) {
  const userStore = useUserStore();
  const { categories } = useCategoryStore();
  const { createCategoryBudget, updateCategoryBudget } =
    useCategoryBudgetStore();

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
    ? categories.filter((c) => String(c.id) === String(budget.cid))
    : categories.filter((c) => !setBudgetCids.includes(String(c.id)));

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

      if (isEditMode) {
        // id는 URL 파라미터로, 나머지는 payload로 분리
        await updateCategoryBudget(budget.id, {
          uid,
          cid: form.cid,
          amount: Number(form.amount),
        });
      } else {
        await createCategoryBudget({
          uid,
          cid: form.cid,
          amount: Number(form.amount),
        });
      }

      onSubmit();
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
          <button
            className="btn-cancel"
            style={{ width: '20%' }}
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="btn-primary"
            style={{ width: '80%' }}
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
