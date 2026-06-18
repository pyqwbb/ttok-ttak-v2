import React, { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';

export default function SignupForm({ onSwitch }) {
  const userStore = useUserStore();

  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    if (!form.email || !form.password || !form.nickname) {
      setErrorMsg('모든 항목을 입력해주세요.');
      return false;
    }

    // 닉네임 2~10글자
    if (form.nickname.length < 2 || form.nickname.length > 10) {
      setErrorMsg('닉네임은 2~10글자로 입력해주세요.');
      return false;
    }

    // 이메일 형식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setErrorMsg('올바른 이메일 형식이 아니에요.');
      return false;
    }

    // 비밀번호 6글자 이상
    if (form.password.length < 6) {
      setErrorMsg('비밀번호는 최소 6글자 이상이어야 합니다.');
      return false;
    }

    // 비밀번호 확인
    if (form.password !== form.passwordConfirm) {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    setErrorMsg('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      // TODO: 실제 API 연결
      console.log('회원가입 시도:', form);

      await userStore.createUser({
        email: form.email,
        password: form.password,
        nickname: form.nickname,
      });

      onSwitch?.();
    } catch (e) {
      setErrorMsg(
        e.response?.data?.message ||
          '회원가입에 실패했어요. 다시 시도해주세요.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') handleSignup();
  };

  return (
    <div className="form">
      {/* 이메일 */}
      <div className="field">
        <label>이메일</label>
        <input
          type="email"
          placeholder="이메일을 입력해주세요"
          value={form.email}
          onChange={handleChange('email')}
          onKeyUp={handleKeyUp}
        />
      </div>

      {/* 닉네임 */}
      <div className="field">
        <label>닉네임</label>
        <input
          type="text"
          placeholder="2~10글자로 입력해주세요"
          value={form.nickname}
          onChange={handleChange('nickname')}
          onKeyUp={handleKeyUp}
          maxLength={10}
        />
      </div>

      {/* 비밀번호 */}
      <div className="field">
        <label>비밀번호</label>
        <input
          type="password"
          placeholder="6글자 이상 입력해주세요"
          value={form.password}
          onChange={handleChange('password')}
          onKeyUp={handleKeyUp}
        />
      </div>

      {/* 비밀번호 확인 */}
      <div className="field">
        <label>비밀번호 확인</label>
        <input
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          value={form.passwordConfirm}
          onChange={handleChange('passwordConfirm')}
          onKeyUp={handleKeyUp}
        />
      </div>

      {errorMsg && <p className="error">{errorMsg}</p>}

      <button
        className="btn-primary"
        disabled={isLoading}
        onClick={handleSignup}
      >
        {isLoading ? '가입 중...' : '회원가입'}
      </button>

      <p className="switch-link">
        이미 계정이 있으신가요?&nbsp;&nbsp;
        <span onClick={onSwitch}>로그인</span>
      </p>
    </div>
  );
}
