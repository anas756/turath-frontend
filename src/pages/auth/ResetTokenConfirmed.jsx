import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import loginPhoto from '../../assets/arch-login.png';
import '../../styles/auth.css';

export default function ResetTokenConfirmed() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const status = searchParams.get('status');
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';
  const reason = searchParams.get('reason');

  const [phase, setPhase] = useState('loading');

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase(status === 'success' ? 'success' : 'error');
    }, 1800);
    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (phase !== 'success') return;

    const timer = setTimeout(() => {
      navigate('/update-password', {
        state: { email, token },
      });
    }, 3500);

    return () => clearTimeout(timer);
  }, [phase, email, token, navigate]);

  return (
    <div className="auth-page">
      <LanguageSwitcher />
      <div
        className="auth-photo"
        style={{ backgroundImage: `url(${loginPhoto})` }}
      />

      <div className="auth-form-panel">
        <div className="form-inner verify-inner">
          {phase === 'loading' && (
            <>
              <div className="confirmed-spinner" />
              <p className="brand-label" style={{ marginTop: '1.5rem' }}>
                {t('brandLabel')}
              </p>
              <h1 className="auth-title verify-title">
                {t('verifyingTitle') || 'Validating\nReset Link'}
              </h1>
              <p className="verify-desc">Please wait a moment…</p>
            </>
          )}

          {phase === 'success' && (
            <>
              <div className="confirmed-icon success-icon">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1e4d8c"
                  strokeWidth="2"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <p className="brand-label" style={{ marginTop: '1.5rem' }}>
                {t('brandLabel')}
              </p>
              <h1 className="auth-title verify-title">
                Link
                <br />
                Verified!
              </h1>
              <p className="verify-desc">
                Your reset token is valid. Preparing password update terminal...
              </p>
              <div className="confirmed-progress">
                <div className="confirmed-progress-bar" />
              </div>
              <button
                className="btn-cta"
                style={{ marginTop: '1.5rem' }}
                onClick={() =>
                  navigate('/update-password', { state: { email, token } })
                }
              >
                Change Password Now →
              </button>
            </>
          )}

          {phase === 'error' && (
            <>
              <div className="confirmed-icon error-icon">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c0392b"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <p className="brand-label" style={{ marginTop: '1.5rem' }}>
                {t('brandLabel')}
              </p>
              <h1
                className="auth-title verify-title"
                style={{ fontSize: '2rem' }}
              >
                Link
                <br />
                Rejected
              </h1>
              <p className="verify-desc">
                {reason || 'This reset link has expired or is invalid.'}
              </p>
              <button
                className="btn-cta"
                onClick={() => navigate('/forgot-password')}
              >
                Request New Link →
              </button>
              <div className="switch-line" style={{ marginTop: '1rem' }}>
                <Link to="/login">{t('backToLogin')}</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
