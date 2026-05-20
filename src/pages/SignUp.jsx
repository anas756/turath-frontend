import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { registerUser } from './../app/services/reduxTollkit/asyncThunks/UserThunk';
import { clearMessages } from '../app/services/reduxTollkit/Slices/MessageSlice';
import AlertBanner from '../components/AlertBanner';
import '../styles/auth.css';
import signupPhoto from '../assets/arch-signup.png';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

// 1. Define the Registration Validation Schema
const signupSchema = yup.object().shape({
  name: yup
    .string()
    .required('Full name is required')
    .min(3, 'Name must be at least 3 characters'),
  userName: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .matches(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores (no spaces)'
    ),
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  password_confirmation: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signupSchema),
    mode: 'onTouched',
  });

  // Handle Form Submission
  const onSubmit = async (data) => {
    dispatch(clearMessages());
    try {
      data.role = 'user';
      console.log(data);
      const res = await dispatch(registerUser(data)).unwrap();
      console.log(res);
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      console.error('Registration action rejected:', error);
    }
  };
  const { t } = useTranslation();

  return (
    <div className="auth-page">
      <LanguageSwitcher />
      <div
        className="auth-photo"
        style={{ backgroundImage: `url(${signupPhoto})` }}
      >
        <div className="photo-overlay" />
        <div className="photo-caption">
          <p className="photo-brand">{t('brandLabel')}</p>
          <p className="photo-tagline">
            {t('photoCaption')}
          </p>
        </div>
      </div>

      <div className="auth-form-panel">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="form-inner"
          noValidate
        >
          <h1 className="auth-title signup-title">
            {t('joinTitle').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
          </h1>
          <p className="auth-subtitle">{t('joinSubtitle')}</p>

          <AlertBanner />

          <div className="fields">
            {/* FULL NAME FIELD */}
            <div className={`field-group ${errors.name ? 'has-error' : ''}`}>
              <label htmlFor="name">{t('fullName')}</label>
              <input
                id="name"
                type="text"
                placeholder={t('fullNamePlaceholder')}
                {...register('name')}
              />
              {errors.name && (
                <p className="error-message">{errors.name.message}</p>
              )}
            </div>

            {/* USERNAME FIELD */}
            <div
              className={`field-group ${errors.userName ? 'has-error' : ''}`}
            >
              <label htmlFor="userName">{t('username')}</label>
              <input
                id="userName"
                type="text"
                placeholder={t('usernamePlaceholder')}
                autoCapitalize="none"
                autoCorrect="off"
                {...register('userName')}
              />
              {errors.userName && (
                <p className="error-message">{errors.userName.message}</p>
              )}
            </div>

            {/* EMAIL FIELD */}
            <div className={`field-group ${errors.email ? 'has-error' : ''}`}>
              <label htmlFor="email">{t('emailAddress')}</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            {/* PASSWORD FIELD */}
            <div
              className={`field-group ${errors.password ? 'has-error' : ''}`}
            >
              <label htmlFor="password">{t('password')}</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register('password')}
              />
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </div>

            {/* PASSWORD CONFIRMATION FIELD */}
            <div
              className={`field-group ${errors.password_confirmation ? 'has-error' : ''}`}
            >
              <label htmlFor="password_confirmation">{t('confirmPassword')}</label>
              <input
                id="password_confirmation"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register('password_confirmation')}
              />
              {errors.password_confirmation && (
                <p className="error-message">
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>
          </div>

          <button type="submit" className="btn-cta" disabled={isSubmitting}>
            {isSubmitting ? t('creatingAccount') : t('createAccountBtn')}
          </button>

          <div className="switch-line">
            <Link to="/login">{t('alreadyHave')}</Link>
          </div>

          <p className="legal-note">
            {t('termsNote')} <a href="#">{t('terms')}</a> {t('and')}{' '}
            <a href="#">{t('privacy')}</a>
          </p>
        </form>
      </div>
    </div>
  );
}
