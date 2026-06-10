import React, { useState } from 'react';
import BaseModal from '@/components/common/BaseModal';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login');

  return (
    <BaseModal
      title={mode === 'login' ? '로그인' : '회원가입'}
      onClose={onClose}
    >
      {mode === 'login' ? (
        <LoginForm onSwitch={() => setMode('signup')} onSuccess={onClose} />
      ) : (
        <SignupForm onSwitch={() => setMode('login')} />
      )}
    </BaseModal>
  );
}
