import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import CompleteModal from '@/components/common/CompleteModal';
import profileIcon from '@/assets/icons/profile.svg';
import '@/assets/styles/profile.css';

export default function ProfileView() {
  const navigate = useNavigate();

  const userStore = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const [form, setForm] = useState({
    nickname: userStore.user?.nickname || '',
    email: userStore.user?.email || '',
  });

  const userInfo = userStore.user || {};

  const handleLogout = () => {
    // 필요 시 사용자 정보 초기화
    // userStore.logout?.();
    localStorage.removeItem('userId');
    navigate('/');
  };

  const startEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm({
      nickname: userInfo.nickname || '',
      email: userInfo.email || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    // 유효성 검사
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
      await userStore.updateUser(userInfo.id, form);
      setIsEditing(false);
      setErrors({});
      setShowCompleteModal(true); // 저장 완료 모달 표시
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className={`profile-card ${isEditing ? 'editing' : ''}`}>
        <div className="profile-avatar">
          <img src={profileIcon} alt="프로필" />
        </div>

        <h2 className="profile-heading">
          {isEditing ? '프로필 수정' : '내 프로필'}
        </h2>

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

        <div
          className={`mode-section edit-mode ${isEditing ? 'active' : 'inactive'}`}
          aria-hidden={!isEditing}
        >
          <div className="form">
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
            <button className="btn-logout" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        )}
      </div>

      {/* 저장 완료 모달 */}
      {showCompleteModal && (
        <CompleteModal
          visible={showCompleteModal}
          icon="✅"
          title="수정 완료!"
          description="프로필이 수정됐어요."
          onClose={() => setShowCompleteModal(false)}
        />
      )}
    </div>
  );
}
