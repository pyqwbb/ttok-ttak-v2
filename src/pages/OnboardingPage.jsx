import React, { useState } from 'react';
import AuthModal from '@/components/auth/AuthModal';
import './onboarding-page.css';

const imgEllipse22 =
  'https://www.figma.com/api/mcp/asset/45410fcf-ee0d-43a6-9ad3-2389a0ae3a68';
const imgGroup24 =
  'https://www.figma.com/api/mcp/asset/66e9129b-2133-4bfa-bf4f-8e948863fc3b';
const imgStar3 =
  'https://www.figma.com/api/mcp/asset/23205f26-b4bf-4c61-b003-18b641cbff23';

export default function OnboardingView() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="onboarding">
      <div className="onboarding-logo-wrapper">
        <img
          className="onboarding-logo-bg"
          src={imgEllipse22}
          alt="background glow"
        />
        <div className="onboarding-logo-text">
          똑딱
          <span>ttok ttak</span>
        </div>
      </div>

      <div className="onboarding-hero">
        <img
          className="hero-asset"
          src={imgGroup24}
          alt="ttok ttak illustration"
        />
        <img className="hero-star hero-star--left" src={imgStar3} alt="star" />
        <img className="hero-star hero-star--right" src={imgStar3} alt="star" />
        <div className="hero-badge hero-badge--left">₩</div>
        <div className="hero-badge hero-badge--right">₩</div>
      </div>

      <p className="onboarding-subtitle">똑똑하게 딱 기록하는 가계부</p>

      <button className="btn-start" onClick={() => setShowModal(true)}>
        시작하기
      </button>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
