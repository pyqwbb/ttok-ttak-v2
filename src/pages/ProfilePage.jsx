import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import BaseModal from '@/components/common/BaseModal';
import CompleteModal from '@/components/common/CompleteModal';
import { PROFILE_IMAGES } from '@/utils/profileImages';
import './profile-page.css';

export default function ProfileView() {
  const navigate = useNavigate();
  const userStore = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const userInfo = userStore.user || {};

  // 💡 form 초기 값에 profile_img 상태 추가 연동
  const [form, setForm] = useState({
    nickname: userInfo.nickname || '',
    email: userInfo.email || '',
    profile_img: userInfo.profile_img || 'default_1.svg',
  });

  // 유저 전역 정보가 초기 세팅되거나 외부에서 새로고침될 때 폼 상태 동기화
  useEffect(() => {
    if (userStore.user) {
      setForm({
        nickname: userStore.user.nickname || '',
        email: userStore.user.email || '',
        profile_img: userStore.user.profile_img || 'default_1.svg',
      });
    }
  }, [userStore.user]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  const startEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // 💡 취소 시 원본 보호용 복사본 롤백 처리
    setForm({
      nickname: userInfo.nickname || '',
      email: userInfo.email || '',
      profile_img: userInfo.profile_img || 'default_1.svg',
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    const newErrors = {};
    if (
      !form.nickname ||
      form.nickname.length < 2 ||
      form.nickname.length > 10
    ) {
      newErrors.nickname = '닉네임은 2~10글자로 입력해주세요';
    }
    if (!form.email || !form.email.includes('@')) {
      newErrors.email = '유효한 이메일을 입력해주세요';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // 💡 수정한 닉네임, 이메일, 선택한 프로필 파일명 객체를 통째로 전송
      await userStore.updateUser(userInfo.id, form);
      setIsEditing(false);
      setErrors({});
      setShowCompleteModal(true);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className={`profile-card ${isEditing ? 'editing' : ''}`}>
        {/* 상단 프로필 이미지 영역: form 상태를 바라보므로 변경사항이 실시간 프리뷰됩니다. */}
        <div className="profile-avatar">
          <img
            src={
              PROFILE_IMAGES[form.profile_img] ||
              PROFILE_IMAGES['default_1.svg']
            }
            alt="프로필"
          />
        </div>

        <h2 className="profile-heading">
          {isEditing ? '프로필 수정' : '내 프로필'}
        </h2>

        {/* ==================== 1. 조회 모드 (View Mode) ==================== */}
        <div
          className={`mode-section view-mode ${isEditing ? 'inactive' : 'active'}`}
          aria-hidden={isEditing}
        >
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">닉네임</span>
              <span className="info-value">{userInfo.nickname}</span>
            </div>
            <div className="info-item">
              <span className="info-label">이메일</span>
              <span className="info-value">{userInfo.email}</span>
            </div>
          </div>

          <button className="btn-primary" onClick={startEdit}>
            프로필 수정하기
          </button>
        </div>

        {/* ==================== 2. 수정 모드 (Edit Mode) ==================== */}
        <div
          className={`mode-section edit-mode ${isEditing ? 'active' : 'inactive'}`}
          aria-hidden={!isEditing}
        >
          <div className="form">
            {/* 💡 프로필 캐릭터 선택 그리드 추가 구현 */}
            <div className="field">
              <label>프로필 캐릭터 선택</label>
              <div className="profile-selector-grid">
                {Object.keys(PROFILE_IMAGES).map((fileName) => (
                  <button
                    key={fileName}
                    type="button"
                    className={`profile-option-btn ${form.profile_img === fileName ? 'selected' : ''}`}
                    onClick={() => setForm({ ...form, profile_img: fileName })}
                  >
                    <img src={PROFILE_IMAGES[fileName]} alt="캐릭터 인덱스" />
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>닉네임</label>
              <input
                type="text"
                value={form.nickname}
                onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                placeholder="2~10글자로 입력해주세요"
                maxLength={10}
              />
              {errors.nickname && <p className="error">{errors.nickname}</p>}
            </div>

            <div className="field">
              <label>이메일</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="이메일을 입력해주세요"
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
          </div>

          <div className="btn-group">
            <button className="btn-cancel" onClick={handleCancel}>
              취소
            </button>
            <button
              className="btn-primary"
              disabled={isLoading}
              onClick={handleSave}
            >
              {isLoading ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>

        {!isEditing && (
          <div className="logout-wrapper">
            <button className="btn-logout" onClick={handleLogoutClick}>
              로그아웃
            </button>
          </div>
        )}
      </div>

      {showCompleteModal && (
        <CompleteModal
          visible={showCompleteModal}
          icon="✅"
          title="수정 완료!"
          description="프로필이 수정됐어요."
          onClose={() => setShowCompleteModal(false)}
        />
      )}

      {showLogoutModal && (
        <BaseModal
          title="로그아웃"
          onClose={() => setShowLogoutModal(false)}
          footer={
            <div className="modal-btn-group">
              <button
                className="btn-cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                취소
              </button>

              <button
                className="btn-primary"
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
              >
                로그아웃
              </button>
            </div>
          }
        >
          <p>로그아웃 하시겠습니까?</p>
        </BaseModal>
      )}
    </div>
  );
}
