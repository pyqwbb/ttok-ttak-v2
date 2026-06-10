import React, { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import profileIcon from '@/assets/icons/profile.svg';
import '@/assets/styles/profile.css';

const ageOptions = ['10대', '20대', '30대', '40대', '50대', '60대 이상'];

const genderOptions = [
  { value: 'M', label: '남성' },
  { value: 'F', label: '여성' },
];

export default function ProfileView() {
  const userStore = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    nickname: userStore.user?.nickname || '',
    email: userStore.user?.email || '',
    age: userStore.user?.age || '',
    gender: userStore.user?.gender || '',
  });

  const userInfo = userStore.user || {};
  const genderLabel =
    genderOptions.find((g) => g.value === userInfo.gender)?.label || '미선택';

  const startEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm({
      nickname: userInfo.nickname || '',
      email: userInfo.email || '',
      age: userInfo.age || '',
      gender: userInfo.gender || '',
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

        {/* 뷰 모드와 편집 모드를 동시에 렌더하되 CSS 클래스 토글로 전환 애니메이션을 처리합니다. */}
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
            <div className="info-item">
              <span className="info-label">연령대</span>
              <span className="info-value">{userInfo.age}</span>
            </div>
            <div className="info-item">
              <span className="info-label">성별</span>
              <span className="info-value">{genderLabel}</span>
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

            <div className="field">
              <label>연령대</label>
              <select
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              >
                <option value="">선택해주세요</option>
                {ageOptions.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>성별</label>
              <div className="radio-group">
                {genderOptions.map((g) => (
                  <label key={g.value} className="radio-item">
                    <input
                      type="radio"
                      name="gender"
                      value={g.value}
                      checked={form.gender === g.value}
                      onChange={(e) =>
                        setForm({ ...form, gender: e.target.value })
                      }
                    />
                    {g.label}
                  </label>
                ))}
              </div>
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
      </div>
    </div>
  );
}
