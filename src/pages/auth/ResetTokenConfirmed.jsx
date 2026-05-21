import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import loginPhoto from '../../assets/arch-login.png';
import '../../styles/auth.css';

export default function ResetTokenConfirmed() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Extract variables passed from Laravel Redirect
  const status = searchParams.get('status');
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const reason = searchParams.get('reason'); // Decodes the custom string messages seamlessly

  const [phase, setPhase] = useState('loading'); // loading | success | error

  useEffect(() => {
    // Elegant temporary loading buffer to match your interface pacing
    const timer = setTimeout(() => {
      setPhase(status === 'success' ? 'success' : 'error');
    }, 1800);
    return () => clearTimeout(timer);
  }, [status]);

  // Handle successful validation transition forward
  useEffect(() => {
    if (phase !== 'success') return;

    const timer = setTimeout(() => {
      // Directs seamlessly to your change form layout while packing state properties safely
      navigate('/update-password', {
        state: {
          email: decodeURIComponent(email),
          token: decodeURIComponent(token),
        },
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
          {/* ── PHASE 1: LOADING STATE ── */}
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

          {/* ── PHASE 2: SUCCESS STATE ── */}
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
                Your reset token is valid. Preparing your secure password update
                terminal...
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

          {/* ── PHASE 3: ERROR STATE ── */}
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
                {/* Dynamically fallback to server text parameters directly passed by Laravel code */}
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
