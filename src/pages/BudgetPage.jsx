import { useState, useEffect, useMemo } from 'react';
import { useCategoryStore } from '@/stores/categoryStore';
import { useUserStore } from '@/stores/userStore';
import { useCategoryBudgetStore } from '@/stores/categoryBudgetStore';
import BudgetModal from '@/components/budget/BudgetModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import './budget-page.css';

export default function BudgetView() {
  const { categories, getCategories } = useCategoryStore();
  const userStore = useUserStore();
  const {
    categoryBudget,
    loading,
    error,
    getCategoryBudget,
    deleteCategoryBudget,
  } = useCategoryBudgetStore();

  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');

  const uid = userStore.user?.id ?? localStorage.getItem('userId');

  const categoryBudgets = Array.isArray(categoryBudget) ? categoryBudget : [];

  // 예산은 지출 카테고리 기준이므로 로컬에서 필터링
  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === 'expense'),
    [categories],
  );

  // 카테고리(전체) + 예산 목록 불러오기
  useEffect(() => {
    getCategories();
    getCategoryBudget();
  }, [uid]);

  const openAddModal = () => {
    setSelectedBudget(null);
    setShowBudgetModal(true);
  };

  const openEditModal = (budget) => {
    setSelectedBudget(budget);
    setShowBudgetModal(true);
  };

  const openDeleteConfirm = (budget) => {
    setDeleteErrorMsg('');
    setSelectedBudget(budget);
    setShowConfirmModal(true);
  };

  const handleSubmit = () => {
    setShowBudgetModal(false);
    setSelectedBudget(null);
  };

  const handleDelete = async () => {
    try {
      await deleteCategoryBudget(selectedBudget.id);
      setShowConfirmModal(false);
      setSelectedBudget(null);
    } catch (e) {
      setDeleteErrorMsg('삭제 중 오류가 발생했어요. 다시 시도해주세요.');
    }
  };

  const setBudgetCids = categoryBudgets.map((b) => String(b.cid));

  const getCategory = (cid) =>
    categories.find((c) => String(c.id) === String(cid));

  return (
    <div className="budget-page">
      <div className="budget-header">
        <h1 className="budget-title">예산 설정</h1>
        <button className="btn-add" onClick={openAddModal}>
          + 예산 추가
        </button>
      </div>

      {loading && categoryBudgets.length === 0 && (
        <div className="budget-empty">
          <p>불러오는 중...</p>
        </div>
      )}

      {!loading && categoryBudgets.length > 0 && (
        <div className="budget-list">
          {categoryBudgets.map((budget) => {
            const category = getCategory(budget.cid);
            return (
              <div key={budget.id} className="budget-item">
                <div
                  className="budget-icon"
                  style={{ background: (category?.color ?? '#eee') + '22' }}
                >
                  {category?.img ?? '❓'}
                </div>

                <div className="budget-info">
                  <p className="budget-category">
                    {category?.name ?? '알 수 없음'}
                  </p>
                  <p className="budget-amount">
                    월 {budget.amount.toLocaleString()}원
                  </p>
                </div>

                <div className="budget-actions">
                  <button
                    className="btn-edit"
                    onClick={() => openEditModal(budget)}
                  >
                    수정
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => openDeleteConfirm(budget)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && categoryBudgets.length === 0 && (
        <div className="budget-empty">
          <p>💰</p>
          <p>설정된 예산이 없어요</p>
          <p className="budget-empty-sub">
            카테고리별 예산을 설정하면 대시보드에서 지출 현황을 확인할 수 있어요
          </p>
          <button className="btn-add-empty" onClick={openAddModal}>
            예산 추가하기
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {deleteErrorMsg && <p className="error">{deleteErrorMsg}</p>}

      {showBudgetModal && (
        <BudgetModal
          budget={selectedBudget}
          categories={expenseCategories}
          setBudgetCids={setBudgetCids}
          onClose={() => {
            setShowBudgetModal(false);
            setSelectedBudget(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          title="예산 삭제"
          message={`${getCategory(selectedBudget?.cid)?.name ?? ''} 예산을 삭제할까요?`}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowConfirmModal(false);
            setSelectedBudget(null);
          }}
        />
      )}
    </div>
  );
}
