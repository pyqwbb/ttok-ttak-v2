import React, { useState } from 'react';
import { useUserStore } from '@/stores/userStore';

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

  const handleSignup = async () => {
    setErrorMsg('');

    // 유효성 검사
    if (!form.email || !form.password || !form.nickname) {
      setErrorMsg('모든 필드를 입력해주세요.');
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (form.password.length < 6) {
      setErrorMsg('비밀번호는 최소 6글자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: 실제 API 연결
      console.log('회원가입 시도:', form);

      // 임시 처리
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
    if (e.key === 'Enter') {
      handleSignup();
    }
  };

  return (
    <div className="form">
      <div className="field">
        <label>이메일</label>
        <input
          type="email"
          placeholder="이메일을 입력해주세요"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onKeyUp={handleKeyUp}
        />
      </div>

      <div className="field">
        <label>닉네임</label>
        <input
          type="text"
          placeholder="닉네임을 입력해주세요"
          value={form.nickname}
          onChange={(e) => setForm({ ...form, nickname: e.target.value })}
          onKeyUp={handleKeyUp}
          maxLength={10}
        />
      </div>

      <div className="field">
        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onKeyUp={handleKeyUp}
        />
      </div>

      <div className="field">
        <label>비밀번호 확인</label>
        <input
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          value={form.passwordConfirm}
          onChange={(e) =>
            setForm({ ...form, passwordConfirm: e.target.value })
          }
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
        이미 계정이 있으신가요?
        <span
          onClick={onSwitch}
          style={{ cursor: 'pointer', color: '#0066cc' }}
        >
          로그인
        </span>
      </p>
    </div>
  );
}
