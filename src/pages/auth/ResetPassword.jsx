import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

// 1. Validation Schema ensuring passwords are safe and match perfectly
const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // 2. Safely capture the validated tracking keys from history routing memory
  const { email, token } = location.state || {};

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onTouched',
  });

  // 3. Form Submission Handler
  const onSubmit = async (data) => {
    dispatch(clearMessages());
    try {
      // Package the parameters together to matching your backend target signatures
      const payload = {
        email: decodeURIComponent(email),
        token: decodeURIComponent(token),
        password: data.password,
        password_confirmation: data.confirmPassword, // Matches native Laravel conventions
      };

      // Assuming an endpoint handling final password storage updates
      const response = await api.updatePassword(payload);

      if (response?.data?.success) {
        dispatch(
          setSuccessMessage(
            response.data.message || 'Password updated successfully!'
          )
        );
        navigate('/login');
      } else {
        dispatch(
          setErrorMessage(
            response?.data?.message || 'Failed to update password.'
          )
        );
      }
    } catch (error) {
      console.error('Password reset update request failed:', error);
      const backendError =
        error?.response?.data?.message || 'Could not save credentials.';
      dispatch(setErrorMessage(backendError));
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

          <h1 className="auth-title">
            {(t('createNewPasswordTitle') || 'Create New\nPassword')
              .split('\n')
              .map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
          </h1>

          <p
            className="verify-desc"
            style={{
              marginBottom: '2rem',
              textAlign: 'left',
              fontSize: '0.9rem',
              color: '#7f8c8d',
            }}
          >
            Updating credentials for:{' '}
            <strong style={{ color: '#2c3e50' }}>{email}</strong>
          </p>

          <div className="fields">
            {/* NEW PASSWORD FIELD */}
            <div
              className={`field-group ${errors.password ? 'has-error' : ''}`}
            >
              <label htmlFor="password">{t('password')}</label>
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
                  {...register('password')}
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

            {/* CONFIRM PASSWORD FIELD */}
            <div
              className={`field-group ${errors.confirmPassword ? 'has-error' : ''}`}
            >
              <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
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
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('passwordPlaceholder')}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && (
                <p className="error-message">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <button type="submit" className="btn-cta" disabled={isSubmitting}>
            {isSubmitting
              ? t('savingAccount') || 'Saving...'
              : t('updatePassword') || 'Update Password →'}
          </button>
        </form>
      </div>
    </div>
  );
}
