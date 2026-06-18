import React, { useState, useRef, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useNavigate } from 'react-router-dom';

export default function LoginForm({ onSwitch, onSuccess }) {
  const userStore = useUserStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailInputRef = useRef(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleLogin = async () => {
    setErrorMsg('');

    if (!form.email || !form.password) {
      setErrorMsg('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: 실제 API 연결
      console.log('로그인 시도:', form);

      // 임시 처리
      localStorage.setItem('userId', '1');
      onSuccess?.();
      navigate('/dashboard');
    } catch (e) {
      setErrorMsg(
        e.response?.data?.message || '로그인에 실패했어요. 다시 시도해주세요.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="form">
      <div className="field">
        <label>이메일</label>
        <input
          ref={emailInputRef}
          type="email"
          placeholder="이메일을 입력해주세요"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onKeyUp={handleKeyUp}
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

      {errorMsg && <p className="error">{errorMsg}</p>}

      <button
        className="btn-primary"
        disabled={isLoading}
        onClick={handleLogin}
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </button>

      <div className="divider">
        <span>또는</span>
      </div>

      <button className="btn-kakao" disabled>
        카카오로 시작하기
      </button>

      <p className="switch-link">
        아직 계정이 없으신가요?&nbsp;&nbsp;
        <span onClick={onSwitch}>회원가입</span>
      </p>
    </div>
  );
}
