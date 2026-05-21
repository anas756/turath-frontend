import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import '../../styles/auth.css';
import loginPhoto from '../../assets/arch-login.png';
import { useDispatch } from 'react-redux';
import {
  clearMessages,
  setErrorMessage,
  setSuccessMessage,
} from '../../app/services/reduxTollkit/Slices/MessageSlice';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { api } from '../../app/services/lib/Api';

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
});

export default function ForgotPassword() {
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
  const onSubmit = async (data) => {
    dispatch(clearMessages());
    try {
      // Sends payload object
      const response = await api.sendResetLink(data);

      //  Rely directly on the explicit boolean flag returned by the API response
      if (response?.data?.success) {
        dispatch(setSuccessMessage(response.data.message));
        navigate('/login');
      } else {
        dispatch(setErrorMessage(response?.data?.message || 'Error occurred.'));
      }
    } catch (error) {
      console.error('Reset password request failed:', error);

      //  Safely read 404/500 error messages returned by your Axios interceptors
      const backendErrorMessage =
        error?.response?.data?.message || 'Could not reach the server.';
      dispatch(setErrorMessage(backendErrorMessage));
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="form-inner"
          noValidate
        >
          <p className="brand-label">{t('brandLabel')}</p>

          {/* FIX 1: Replaced login text with dedicated forgot password title text key */}
          <h1 className="auth-title">
            {(t('forgotPasswordTitle') || 'Reset your\nPassword')
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
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* FIX 2: Corrected matching translation keys for CTA action states */}
          <button type="submit" className="btn-cta" disabled={isSubmitting}>
            {isSubmitting ? t('checkingInformation') : t('checkInformation')}
          </button>

          {/* FIX 3: Replaced raw 'signIn' placeholder link string with 'backToLogin' style tag */}
          <div className="switch-line">
            <Link to="/login">{t('backToLogin')}</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
