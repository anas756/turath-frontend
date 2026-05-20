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
      navigate('/');
    } catch (error) {
      console.error('Registration action rejected:', error);
    }
  };

  return (
    <div className="auth-page">
      <div
        className="auth-photo"
        style={{ backgroundImage: `url(${signupPhoto})` }}
      >
        <div className="photo-overlay" />
        <div className="photo-caption">
          <p className="photo-brand">Turath Digital</p>
          <p className="photo-tagline">
            Preserving the legacy of the Makhzen through curated digital
            archives.
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
            Join Turath
            <br />
            Digital
          </h1>
          <p className="auth-subtitle">Become a curator of heritage.</p>

          <AlertBanner />

          <div className="fields">
            {/* FULL NAME FIELD */}
            <div className={`field-group ${errors.name ? 'has-error' : ''}`}>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Tariq Ibn Ziyad"
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
              <label htmlFor="userName">Username</label>
              <input
                id="userName"
                type="text"
                placeholder="e.g. tariq_92"
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
              <label htmlFor="email">Email Address</label>
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
              <label htmlFor="password">Password</label>
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
              <label htmlFor="password_confirmation">Confirm Password</label>
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
            {isSubmitting ? 'Creating Account...' : 'Create Account →'}
          </button>

          <div className="switch-line">
            <Link to="/login">Already have an account? Log in</Link>
          </div>

          <p className="legal-note">
            By joining, you agree to our <a href="#">Terms of Service</a> and{' '}
            <a href="#">Privacy Policy</a>
          </p>
        </form>
      </div>
    </div>
  );
}
