import React, { useState, useEffect, useMemo } from 'react';
import { useCategoryStore } from '@/stores/categoryStore';
import { useTransactionStore } from '@/stores/transactionStore';
import TransactionModal from '@/components/transaction/TransactionModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import MonthSelector from '@/components/common/MonthSelector';
import './transaction-page.css';

export default function TransactionView() {
  const { categories, getCategories } = useCategoryStore();

  const { transactions, loading, error, getTransactions, deleteTransaction } =
    useTransactionStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState('');
  const [selectedCid, setSelectedCid] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const typeOptions = [
    { value: '', label: '전체' },
    { value: 'expense', label: '지출' },
    { value: 'income', label: '수입' },
  ];

  // 최초 진입 시 전체 카테고리 + 거래 내역 조회
  useEffect(() => {
    getCategories();
    getTransactions();
  }, []);

  // 필터링된 거래 목록
  const filteredTransactions = useMemo(() => {
    const yearStr = String(currentYear);
    const monthStr = String(currentMonth).padStart(2, '0');
    const list = Array.isArray(transactions) ? transactions : [];

    return list.filter((item) => {
      const dateMatch = item.date?.startsWith(`${yearStr}-${monthStr}`);
      const typeMatch = !selectedType || item.type === selectedType;
      const cidMatch = !selectedCid || String(item.cid) === String(selectedCid);

      return dateMatch && typeMatch && cidMatch;
    });
  }, [transactions, currentYear, currentMonth, selectedType, selectedCid]);

  // 합계 계산
  const { totalIncome, totalExpense } = useMemo(() => {
    let income = 0;
    let expense = 0;

    filteredTransactions.forEach((item) => {
      if (item.type === 'income') {
        income += item.amount;
      } else {
        expense += item.amount;
      }
    });

    return { totalIncome: income, totalExpense: expense };
  }, [filteredTransactions]);

  const getCategory = (cid) =>
    categories.find((c) => String(c.id) === String(cid));

  const getCategoryImg = (cid) => getCategory(cid)?.img || '📁';

  const getCategoryName = (cid) => getCategory(cid)?.name || '카테고리';

  const getCategoryColor = (cid) => {
    return getCategory(cid)?.color || '#FFB6C1';
  };

  const openEditModal = (item) => {
    setEditingTransaction(item);
  };

  const openDeleteConfirm = (item) => {
    setDeleteErrorMsg('');
    setShowDeleteConfirm(item);
  };

  const handleDelete = async () => {
    try {
      await deleteTransaction(showDeleteConfirm.id);
      setShowDeleteConfirm(null);
    } catch (e) {
      setDeleteErrorMsg('삭제 중 오류가 발생했어요. 다시 시도해주세요.');
    }
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
          {categories.map((cat) => (
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

      {loading && filteredTransactions.length === 0 && (
        <div className="empty-state">
          <p>불러오는 중...</p>
        </div>
      )}

      {!loading && filteredTransactions.length > 0 && (
        <div className="transaction-list">
          {filteredTransactions.map((item) => (
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
      )}

      {!loading && filteredTransactions.length === 0 && (
        <div className="empty-state">
          <p>📭</p>
          <p>이번 달 거래 내역이 없어요</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {deleteErrorMsg && <p className="error">{deleteErrorMsg}</p>}

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
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
