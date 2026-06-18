import { useState, useEffect } from 'react';
import { useCategoryStore } from '@/stores/categoryStore';
import { useUserStore } from '@/stores/userStore';
import BudgetModal from '@/components/budget/BudgetModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import './budget-page.css';

export default function BudgetView() {
  const categoryStore = useCategoryStore();
  const userStore = useUserStore();

  const [budgets, setBudgets] = useState([]); // 설정된 예산 목록
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null); // null이면 등록, 값 있으면 수정

  const uid = userStore.user?.id ?? localStorage.getItem('userId');

  // 예산 목록 불러오기
  const fetchBudgets = async () => {
    try {
      // 2주차에 실제 API 연결 예정
      // const { data } = await api.get('/category-budget', { params: { uid } })
      // setBudgets(data)
      console.log('예산 목록 조회:', uid);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBudgets();
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
    setSelectedBudget(budget);
    setShowConfirmModal(true);
  };

  // 저장 완료 후 처리
  const handleSubmit = (savedBudget) => {
    if (selectedBudget) {
      // 수정: 기존 항목 교체
      setBudgets((prev) =>
        prev.map((b) => (b.id === savedBudget.id ? savedBudget : b)),
      );
    } else {
      // 등록: 목록에 추가
      setBudgets((prev) => [...prev, savedBudget]);
    }
    setShowBudgetModal(false);
    setSelectedBudget(null);
  };

  // 삭제 처리
  const handleDelete = async () => {
    try {
      // 2주차에 실제 API 연결 예정
      // await api.delete(`/category-budget/${selectedBudget.id}`)
      console.log('삭제:', selectedBudget.id);

      setBudgets((prev) => prev.filter((b) => b.id !== selectedBudget.id));
      setShowConfirmModal(false);
      setSelectedBudget(null);
    } catch (e) {
      console.error(e);
    }
  };

  // 예산 설정된 카테고리 ID 목록
  const setBudgetCids = budgets.map((b) => String(b.cid));

  // 카테고리 정보 가져오기
  const getCategory = (cid) =>
    categoryStore.categories.find((c) => String(c.id) === String(cid));

  return (
    <div className="budget-page">
      {/* 헤더 */}
      <div className="budget-header">
        <h1 className="budget-title">예산 설정</h1>
        <button className="btn-add" onClick={openAddModal}>
          + 예산 추가
        </button>
      </div>

      {/* 예산 목록 */}
      {budgets.length > 0 ? (
        <div className="budget-list">
          {budgets.map((budget) => {
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
      ) : (
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
