import React, { useState, useMemo } from 'react';
import { useCategoryStore } from '@/store/useCategoryStore';
import TransactionModal from '@/components/transaction/TransactionModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import MonthSelector from '@/components/common/MonthSelector';
import '@/assets/styles/transaction.css';

export default function TransactionView() {
  const categoryStore = useCategoryStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState('');
  const [selectedCid, setSelectedCid] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const typeOptions = [
    { value: '', label: '전체' },
    { value: 'expense', label: '지출' },
    { value: 'income', label: '수입' },
  ];

  // 필터링된 거래 목록
  const filteredBudgets = useMemo(() => {
    const yearStr = String(currentYear);
    const monthStr = String(currentMonth).padStart(2, '0');

    return categoryStore.budgets.filter((item) => {
      const dateMatch = item.date.startsWith(`${yearStr}-${monthStr}`);
      const typeMatch = !selectedType || item.type === selectedType;
      const cidMatch = !selectedCid || item.cid === parseInt(selectedCid);

      return dateMatch && typeMatch && cidMatch;
    });
  }, [
    categoryStore.budgets,
    currentYear,
    currentMonth,
    selectedType,
    selectedCid,
  ]);

  // 합계 계산
  const { totalIncome, totalExpense } = useMemo(() => {
    let income = 0;
    let expense = 0;

    filteredBudgets.forEach((item) => {
      if (item.type === 'income') {
        income += item.amount;
      } else {
        expense += item.amount;
      }
    });

    return { totalIncome: income, totalExpense: expense };
  }, [filteredBudgets]);

  const getCategoryImg = (cid) => {
    const cat = categoryStore.categories.find((c) => c.id === cid);
    return cat?.img || '📁';
  };

  const getCategoryName = (cid) => {
    const cat = categoryStore.categories.find((c) => c.id === cid);
    return cat?.name || '카테고리';
  };

  const getCategoryColor = (cid) => {
    // 간단한 색상 매핑 (실제로는 DB에서 가져올 수 있음)
    return '#FFB6C1';
  };

  const openEditModal = (item) => {
    setEditingTransaction(item);
  };

  const openDeleteConfirm = (item) => {
    setShowDeleteConfirm(item);
  };

  return (
    <div className="transaction-page">
      <div className="page-header">
        <h1 className="page-title">거래 내역</h1>
      </div>

      <div className="filter-bar">
        <MonthSelector currentDate={currentDate} onChange={setCurrentDate} />

        <div className="filter-type">
          {typeOptions.map((t) => (
            <button
              key={t.value}
              className={`type-btn ${selectedType === t.value ? 'active' : ''}`}
              onClick={() => setSelectedType(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <select
          value={selectedCid}
          onChange={(e) => setSelectedCid(e.target.value)}
          className="filter-select"
        >
          <option value="">전체 카테고리</option>
          {categoryStore.categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.img} {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="summary-bar">
        <span className="income">수입 +{totalIncome.toLocaleString()}원</span>
        <span className="expense">지출 -{totalExpense.toLocaleString()}원</span>
      </div>

      {filteredBudgets.length > 0 ? (
        <div className="transaction-list">
          {filteredBudgets.map((item) => (
            <div key={item.id} className="transaction-item">
              <div
                className="item-icon"
                style={{
                  background: getCategoryColor(item.cid) + '22',
                }}
              >
                {getCategoryImg(item.cid)}
              </div>

              <div className="item-info">
                <p className="item-title">{item.title}</p>
                <p className="item-meta">
                  {item.date} · {getCategoryName(item.cid)}
                </p>
                {item.memo && <p className="item-memo">{item.memo}</p>}
              </div>

              <div className="item-right">
                <p
                  className={`item-amount ${
                    item.type === 'income' ? 'income' : 'expense'
                  }`}
                >
                  {item.type === 'income' ? '+' : '-'}
                  {item.amount.toLocaleString()}원
                </p>

                <div className="item-actions">
                  <button
                    className="btn-edit"
                    onClick={() => openEditModal(item)}
                  >
                    수정
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => openDeleteConfirm(item)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>📭</p>
          <p>이번 달 거래 내역이 없어요</p>
        </div>
      )}

      {editingTransaction && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSubmit={() => setEditingTransaction(null)}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title="삭제 확인"
          message="이 거래를 삭제하시겠습니까?"
          onConfirm={() => setShowDeleteConfirm(null)}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
