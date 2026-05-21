import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import loginPhoto from '../../assets/arch-login.png';
import '../../styles/auth.css';

const MESSAGES = {
  not_found: 'We could not find an account linked to this email address.',
  invalid_token: 'This confirmation link is invalid or has already been used.',
  expired: 'This confirmation link has expired. Please request a new one.',
  server_error: 'Something went wrong on our end. Please try again later.',
};

export default function EmailConfirmed() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get('status');
  const reason = searchParams.get('reason');

  const [phase, setPhase] = useState('loading'); // loading | success | error

  useEffect(() => {
    // Brief loading phase for UX polish
    const timer = setTimeout(() => {
      setPhase(status === 'success' ? 'success' : 'error');
    }, 1800);
    return () => clearTimeout(timer);
  }, [status]);

  // Auto-redirect to login after success
  useEffect(() => {
    if (phase !== 'success') return;
    const timer = setTimeout(() => navigate('/login'), 4000);
    return () => clearTimeout(timer);
  }, [phase, navigate]);

  return (
    <div className="auth-page">
      <LanguageSwitcher />
      <div
        className="auth-photo"
        style={{ backgroundImage: `url(${loginPhoto})` }}
      />

      <div className="auth-form-panel">
        <div className="form-inner verify-inner">
          {/* ── LOADING ── */}
          {phase === 'loading' && (
            <>
              <div className="confirmed-spinner" />
              <p className="brand-label" style={{ marginTop: '1.5rem' }}>
                Turath Digital
              </p>
              <h1 className="auth-title verify-title">
                Verifying
                <br />
                your email
              </h1>
              <p className="verify-desc">Please wait a moment…</p>
            </>
          )}

          {/* ── SUCCESS ── */}
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
                Turath Digital
              </p>
              <h1 className="auth-title verify-title">
                Email
                <br />
                confirmed!
              </h1>
              <p className="verify-desc">
                Your account is now active. You'll be redirected to the login
                page in a few seconds.
              </p>
              <div className="confirmed-progress">
                <div className="confirmed-progress-bar" />
              </div>
              <button
                className="btn-cta"
                style={{ marginTop: '1.5rem' }}
                onClick={() => navigate('/login')}
              >
                Go to Login →
              </button>
            </>
          )}

          {/* ── ERROR ── */}
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
                Turath Digital
              </p>
              <h1
                className="auth-title verify-title"
                style={{ fontSize: '2rem' }}
              >
                Verification
                <br />
                failed
              </h1>
              <p className="verify-desc">
                {MESSAGES[reason] || MESSAGES.server_error}
              </p>
              <button className="btn-cta" onClick={() => navigate('/signup')}>
                Back to Sign Up →
              </button>
              <div className="switch-line" style={{ marginTop: '1rem' }}>
                <a href="/login">Already confirmed? Log in</a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
