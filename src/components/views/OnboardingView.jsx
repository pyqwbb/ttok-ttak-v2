import React, { useState } from 'react';
import AuthModal from '@/components/auth/AuthModal';
import '@/assets/styles/onboarding.css';

export default function OnboardingView() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="onboarding">
      <button className="btn-start" onClick={() => setShowModal(true)}>
        시작하기
      </button>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
