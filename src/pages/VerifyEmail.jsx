import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import loginPhoto from '../assets/arch-login.png';
import '../styles/auth.css';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [checking, setChecking] = useState(false);
  const [dots, setDots] = useState('');
  const [resendStatus, setResendStatus] = useState(''); // add this with the other useState lines at the top

  // Animate the waiting dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Poll the backend every 4 seconds to check if email is verified
  useEffect(() => {
    if (!email) return;

    const poll = setInterval(async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACK_END_URL}/api/auth/email-verified/${encodeURIComponent(email)}`
        );
        const data = await res.json();
        if (data.verified) {
          clearInterval(poll);
          navigate('/login');
        }
      } catch (e) {
        // keep polling silently
      }
    }, 4000);

    return () => clearInterval(poll);
  }, [email, navigate]);


  const handleResend = async () => {
    setChecking(true);
    setResendStatus('');
    try {
      const res = await fetch(`${import.meta.env.VITE_BACK_END_URL}/api/auth/resend-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setResendStatus('success');
      } else {
        setResendStatus(data.message || 'error');
      }
    } catch (e) {
      setResendStatus('Could not reach the server.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="auth-page">
      <LanguageSwitcher />

      <div className="auth-photo" style={{ backgroundImage: `url(${loginPhoto})` }} />

      <div className="auth-form-panel">
        <div className="form-inner verify-inner">

          <div className="verify-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1e4d8c" strokeWidth="1.4">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m2 7 10 7 10-7" />
            </svg>
          </div>

          <p className="brand-label">Turath Digital</p>
          <h1 className="auth-title verify-title">Check your<br />inbox</h1>

          <p className="verify-desc">
            We sent a verification link to your email address. Click the link to activate your account.
          </p>

          <div className="verify-waiting">
            <span className="waiting-dot" />
            <span className="waiting-dot" />
            <span className="waiting-dot" />
            <span className="verify-waiting-text">Waiting for verification{dots}</span>
          </div>

          <div className="verify-divider" />

          <p className="verify-hint">
            Didn't receive it? Check your spam folder or
          </p>
          <button
            className="btn-resend"
            onClick={handleResend}
            disabled={checking}
          >
            {checking ? 'Sending...' : 'Resend verification email'}
          </button>
          {resendStatus === 'success' && (
            <p style={{ color: '#1e4d8c', fontSize: '0.78rem', marginTop: '0.75rem' }}>
              ✓ Verification email sent — check your inbox.
            </p>
          )}
          {resendStatus && resendStatus !== 'success' && (
            <p style={{ color: '#c0392b', fontSize: '0.78rem', marginTop: '0.75rem' }}>
              {resendStatus}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}