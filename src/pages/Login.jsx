import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import '../styles/auth.css';
import loginPhoto from '../assets/arch-login.png';
import { useDispatch } from 'react-redux';
import { login } from '../app/services/reduxTollkit/asyncThunks/AuthThunk';
import { clearMessages } from '../app/services/reduxTollkit/Slices/MessageSlice';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

//  Define the Validation Schema using Yup
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onTouched',
  });

  // Handle Form Submission
  // Handle Form Submission
  const onSubmit = async (data) => {
    // Clear any previous error message state right away
    dispatch(clearMessages());

    try {
      const response = await dispatch(login(data)).unwrap();
      console.log('Login successful payload:', response);

      if (response?.data?.role === 'user') {
        navigate('/user/home');
      } else if (response?.data?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/home');
      }
    } catch (error) {
      console.error('Full Login Error Object:', error);

      // 1. Check if the unwrapped string message matches your email confirmation condition
      const isUnconfirmedEmail =
        typeof error === 'string' &&
        error.includes('confirm your email address first');

      if (isUnconfirmedEmail) {
        // 2. Since the payload is just a text string, pull the email straight from the form input fields
        const targetEmail = data.email;

        console.log(
          'Verification required. Navigating with email:',
          targetEmail
        );

        // 3. Trigger your navigation path update
        navigate(`/verify-email?email=${encodeURIComponent(targetEmail)}`);
      }
    }
  };

  return (
    <div className="auth-page">
      <LanguageSwitcher />
      <div
        className="auth-photo"
        style={{ backgroundImage: `url(${loginPhoto})` }}
      />

      <div className="auth-form-panel">
        {/* Note the use of handleSubmit(onSubmit) here */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="form-inner"
          noValidate
        >
          <p className="brand-label">{t('brandLabel')}</p>
          <h1 className="auth-title">
            {t('welcomeBack')
              .split('\n')
              .map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
          </h1>

          <div className="fields">
            {/* EMAIL FIELD */}
            <div className={`field-group ${errors.email ? 'has-error' : ''}`}>
              <label htmlFor="email">{t('emailAddress')}</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m2 7 10 7 10-7" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  {...register('email')} // Registers the input field
                />
              </div>
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            {/* PASSWORD FIELD */}
            <div
              className={`field-group ${errors.password ? 'has-error' : ''}`}
            >
              <div className="label-row">
                <label htmlFor="password">{t('password')}</label>
                <Link to="/forgot-password" className="forgot-link">
                  {t('forgot')}
                </Link>
              </div>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('passwordPlaceholder')}
                  {...register('password')} // Registers the input field
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Changed to type="submit" so it hooks into HTML form validation safely */}
          <button type="submit" className="btn-cta" disabled={isSubmitting}>
            {isSubmitting ? t('signingIn') : t('signIn')}
          </button>

          <div className="switch-line">
            <Link to="/signup">{t('createAccount')}</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
