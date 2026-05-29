import React from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { clearMessages } from '../../../app/services/reduxTollkit/Slices/MessageSlice';
import { registerUser } from '../../../app/services/reduxTollkit/asyncThunks/UserThunk';
import PageHeader from '../../../components/admin/PageHeader';

const Schema = yup.object().shape({
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
    .oneOf([yup.ref('password')], 'Passwords must match'),
  role: yup
    .string()
    .required('Please select a system role')
    .oneOf(['admin', 'user'], 'Invalid role selected'),
});

export default function StoreUser({ setShowStore }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(Schema),
    mode: 'onTouched',
    defaultValues: {
      role: 'user',
    },
  });

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    dispatch(clearMessages());
    try {
      console.log('Submitting data:', data);
      await dispatch(registerUser(data)).unwrap();
      // Close modal and refresh parent
      setShowStore(true); // Pass true to indicate success and refresh
    } catch (error) {
      console.error('Registration action rejected:', error);
      alert(error.message || 'Failed to create user. Please try again.');
    }
  };

  return (
    <div>
      <PageHeader
        title="Store User"
        subtitle="Storing new user"
        action={
          <button
            onClick={() => setShowStore(false)}
            className="btn-add-doc"
            style={{ cursor: 'pointer' }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ marginRight: '5px', verticalAlign: 'middle' }}
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            {...register('name')}
            disabled={isSubmitting}
          />
          {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="userName">Username</label>
          <input
            type="text"
            id="userName"
            {...register('userName')}
            disabled={isSubmitting}
          />
          {errors.userName && (
            <p style={{ color: 'red' }}>{errors.userName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            {...register('email')}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p style={{ color: 'red' }}>{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register('password')}
            disabled={isSubmitting}
          />
          {errors.password && (
            <p style={{ color: 'red' }}>{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password_confirmation">Confirm Password</label>
          <input
            type="password"
            id="password_confirmation"
            {...register('password_confirmation')}
            disabled={isSubmitting}
          />
          {errors.password_confirmation && (
            <p style={{ color: 'red' }}>
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        <div>
          <label
            style={{ fontWeight: 'bold', display: 'block', marginTop: '10px' }}
          >
            Account Role
          </label>
          <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
            <label>
              <input
                type="radio"
                value="user"
                {...register('role')}
                disabled={isSubmitting}
              />
              User
            </label>
            <label>
              <input
                type="radio"
                value="admin"
                {...register('role')}
                disabled={isSubmitting}
              />
              Admin
            </label>
          </div>
          {errors.role && <p style={{ color: 'red' }}>{errors.role.message}</p>}
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setShowStore(false)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating User...' : 'Save User'}
          </button>
        </div>
      </form>
    </div>
  );
}
