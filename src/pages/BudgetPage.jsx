import { useState, useEffect } from 'react';
import { useCategoryStore } from '@/stores/categoryStore';
import { useUserStore } from '@/stores/userStore';
import { useCategoryBudgetStore } from '@/stores/categoryBudgetStore';
import BudgetModal from '@/components/budget/BudgetModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import './budget-page.css';

export default function BudgetView() {
  const { categories, getExpenseCategories } = useCategoryStore();
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
  const [selectedBudget, setSelectedBudget] = useState(null); // null이면 등록, 값 있으면 수정
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');

  const uid = userStore.user?.id ?? localStorage.getItem('userId');

  // 스토어에 담긴 예산 목록
  const categoryBudgets = Array.isArray(categoryBudget) ? categoryBudget : [];

  // 카테고리 + 예산 목록 불러오기
  useEffect(() => {
    getExpenseCategories();
    getCategoryBudget();
  }, [uid]);

  // 등록 모달 열기
  const openAddModal = () => {
    setSelectedBudget(null);
    setShowBudgetModal(true);
  };

  // 수정 모달 열기
  const openEditModal = (budget) => {
    setSelectedBudget(budget);
    setShowBudgetModal(true);
  };

  // 삭제 확인 모달 열기
  const openDeleteConfirm = (budget) => {
    setDeleteErrorMsg('');
    setSelectedBudget(budget);
    setShowConfirmModal(true);
  };

  // 등록/수정은 모달 내부에서 API 호출까지 끝냄 -> 모달만 닫으면 됨
  const handleSubmit = () => {
    setShowBudgetModal(false);
    setSelectedBudget(null);
  };

  // 삭제 처리
  const handleDelete = async () => {
    try {
      await deleteCategoryBudget(selectedBudget.id);
      setShowConfirmModal(false);
      setSelectedBudget(null);
    } catch (e) {
      setDeleteErrorMsg('삭제 중 오류가 발생했어요. 다시 시도해주세요.');
    }
  };

  // 예산 설정된 카테고리 ID 목록
  const setBudgetCids = categoryBudgets.map((b) => String(b.cid));

  // 카테고리 정보 가져오기
  const getCategory = (cid) =>
    categories.find((c) => String(c.id) === String(cid));

  return (
    <div className="budget-page">
      {/* 헤더 */}
      <div className="budget-header">
        <h1 className="budget-title">예산 설정</h1>
        <button className="btn-add" onClick={openAddModal}>
          + 예산 추가
        </button>
      </div>

      {/* 로딩 */}
      {loading && categoryBudgets.length === 0 && (
        <div className="budget-empty">
          <p>불러오는 중...</p>
        </div>
      )}

      {/* 예산 목록 */}
      {!loading && categoryBudgets.length > 0 && (
        <div className="budget-list">
          {categoryBudgets.map((budget) => {
            const category = getCategory(budget.cid);
            return (
              <div key={budget.id} className="budget-item">
                {/* 카테고리 아이콘 */}
                <div
                  className="budget-icon"
                  style={{ background: (category?.color ?? '#eee') + '22' }}
                >
                  {category?.img ?? '❓'}
                </div>

                {/* 카테고리명 + 금액 */}
                <div className="budget-info">
                  <p className="budget-category">
                    {category?.name ?? '알 수 없음'}
                  </p>
                  <p className="budget-amount">
                    월 {budget.amount.toLocaleString()}원
                  </p>
                </div>

                {/* 수정/삭제 버튼 */}
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

      {/* 빈 상태 */}
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

      {/* 예산 등록/수정 모달 */}
      {showBudgetModal && (
        <BudgetModal
          budget={selectedBudget}
          setBudgetCids={setBudgetCids}
          onClose={() => {
            setShowBudgetModal(false);
            setSelectedBudget(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {/* 삭제 확인 모달 */}
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
