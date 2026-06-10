import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useCategoryStore } from '@/stores/categoryStore';
import { useUserStore } from '@/stores/userStore';
import { useReactionStore } from '@/stores/reactionStore';
import BadgeGrid from '@/components/gamification/BadgeGrid';
import TransactionModal from '@/components/transaction/TransactionModal';
import ReactionModal from '@/components/gamification/ReactionModal';
import logo from '@/assets/icons/logo-signiture.svg';
import profileIcon from '@/assets/icons/profile.svg';
import coinIcon from '@/assets/icons/money.svg';
import '@/assets/styles/sidebar.css';

const navItems = [
  { name: '대시보드', icon: '📊', path: '/dashboard' },
  { name: '거래내역', icon: '📝', path: '/transactions' },
  { name: '프로필', icon: '👤', path: '/profile' },
];

export default function Layout() {
  const location = useLocation();
  const userStore = useUserStore();
  const categoryStore = useCategoryStore();
  const reactionStore = useReactionStore();

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showReactionModal, setShowReactionModal] = useState(false);
  const [reactionMessage, setReactionMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const uid = localStorage.getItem('userId') || '1';

  // 마운트 시 데이터 로드 (한 번만)
  useEffect(() => {
    if (!hasInitialized) {
      const loadInitialData = async () => {
        try {
          if (
            categoryStore.categories &&
            categoryStore.categories.length === 0
          ) {
            await categoryStore.fetchAll(uid);
          }
        } catch (error) {
          console.error('Failed to fetch category data:', error);
        }

        try {
          if (!userStore.user) {
            await userStore.fetchUser(uid);
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }

        try {
          await reactionStore.fetchReactionMessages();
        } catch (error) {
          console.error('Failed to fetch reaction messages:', error);
        }

        setHasInitialized(true);
      };

      loadInitialData();
    }
  }, [hasInitialized]); // 한 번만 실행

  const handleOpenTransactionModal = () => {
    setShowTransactionModal(true);
  };

  const handleTransactionSubmit = async (formData) => {
    setShowTransactionModal(false);

    // 비동기로 DOM 업데이트 기다린 후 반응 모달 열기
    setTimeout(() => {
      const message = reactionStore.resolveMessage(
        formData.cid,
        1, // 임시 횟수
        formData.cid,
      );
      setReactionMessage(message);
      setShowReactionModal(true);
    }, 100);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  return (
    <div className="app-layout">
      <div className="mobile-topbar">
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="메뉴 열기"
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
        <div className="mobile-logo">
          <img src={logo} alt="똑딱 로고" />
        </div>
      </div>

      <div className={`sidebar ${mobileMenuOpen ? 'is-open' : ''}`}>
        <div className="sidebar-logo">
          <img src={logo} alt="똑딱 로고" />
        </div>

        <div className="user-profile">
          <img src={profileIcon} alt="프로필 아이콘" />
          <p className="user-name">
            {userStore.user?.nickname || '사용자'}님의 가계부
          </p>
        </div>

        <BadgeGrid
          monthlyTopCountCategories={categoryStore.monthlyTopCountCategories}
        />

        <div className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-item ${
                location.pathname === item.path ? 'is-active' : ''
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>

        <div className="add-transaction-btn">
          <button className="btn" onClick={handleOpenTransactionModal}>
            <img src={coinIcon} alt="coin" />
            <span className="label">가계부 쓰기</span>
          </button>
        </div>
      </div>

      <div className="main-content">
        <Outlet />
      </div>

      {mobileMenuOpen && (
        <button
          className="sidebar-overlay"
          type="button"
          onClick={closeMobileMenu}
          aria-label="메뉴 닫기"
        />
      )}

      {showTransactionModal && (
        <TransactionModal
          transaction={null}
          onClose={() => setShowTransactionModal(false)}
          onSubmit={handleTransactionSubmit}
        />
      )}

      {showReactionModal && (
        <ReactionModal
          message={reactionMessage}
          onClose={() => setShowReactionModal(false)}
        />
      )}
    </div>
  );
}
