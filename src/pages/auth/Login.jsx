import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import '../../styles/auth.css'; // Khllina l-CSS dyalk l-asliya
import loginPhoto from '../../assets/arch-login.png';
import { useDispatch } from 'react-redux';
import { login } from '../../app/services/reduxTollkit/asyncThunks/AuthThunk';
import { clearMessages } from '../../app/services/reduxTollkit/Slices/MessageSlice';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

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

  const onSubmit = async (data) => {
    dispatch(clearMessages());
    try {
      const response = await dispatch(login(data)).unwrap();
      response?.data?.role === 'admin'
        ? navigate('/admin/dashboard')
        : navigate('/user/home');
    } catch (error) {
      if (
        typeof error === 'string' &&
        error.includes('confirm your email address first')
      ) {
        navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
      }
    }
  };

  return (
    // Zidna dark:bg-neutral-900 hna bach l-page t-wlli dark
    <div className="auth-page dark:bg-neutral-900 transition-colors duration-300">
      <Link to="/home" className="auth-home-link">
        Home
      </Link>
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div
        className="auth-photo"
        style={{ backgroundImage: `url(${loginPhoto})` }}
      />

      <div className="auth-form-panel dark:bg-neutral-900">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="form-inner"
          noValidate
        >
          <p className="brand-label dark:text-blue-400">{t('brandLabel')}</p>

          <h1 className="auth-title dark:text-white">
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
              <label className="dark:text-neutral-400" htmlFor="email">
                {t('emailAddress')}
              </label>
              <div className="input-wrap">
                <span className="input-icon dark:text-neutral-500">
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
                {/* Zidna dark classes hna */}
                <input
                  className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  {...register('email')}
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
                <label className="dark:text-neutral-400" htmlFor="password">
                  {t('password')}
                </label>
                <Link
                  to="/forgot-password"
                  className="forgot-link dark:text-blue-400"
                >
                  {t('forgot')}
                </Link>
              </div>
              <div className="input-wrap">
                <span className="input-icon dark:text-neutral-500">
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
                  className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('passwordPlaceholder')}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="eye-btn dark:text-neutral-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {/* ... SVG Toggle ... */}
                </button>
              </div>
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn-cta dark:bg-blue-600 dark:hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('signingIn') : t('signIn')}
          </button>

          <div className="switch-line">
            <Link to="/signup" className="dark:text-blue-400">
              {t('createAccount')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
