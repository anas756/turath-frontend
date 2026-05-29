import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { clearMessages } from '../../../app/services/reduxTollkit/Slices/MessageSlice';
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
    .transform((value) => (value === '' ? undefined : value))
    .notRequired()
    .min(8, 'Password must be at least 8 characters'),
  password_confirmation: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .notRequired()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match'),
  role: yup
    .string()
    .required('Please select a system role')
    .oneOf(['user', 'admin'], 'Invalid role selected'),
});

export default function UpdateUser({ setShowUpdate, user, onUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
    mode: 'onTouched',
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        userName: user.userName || '',
        email: user.email || '',
        role: user.role?.toLowerCase() || 'user',
        password: '',
        password_confirmation: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    if (!onUpdate) {
      console.error('onUpdate function is not provided');
      return;
    }

    setIsUpdating(true);

    try {
      // Clean up data - remove password fields if empty
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
        delete updateData.password_confirmation;
      }

      // Call parent's update function (asynchronous in background)
      await onUpdate(user.id, updateData);

      // Close modal after successful update
      setShowUpdate(false);
    } catch (error) {
      console.error('Update failed:', error);
      alert(error.message || 'Failed to update user. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Edit User Profile"
        subtitle={`Updating settings and system permissions for @${user?.userName || 'user'}`}
        action={
          <button
            onClick={() => setShowUpdate(false)}
            className="btn-add-doc"
            style={{ cursor: 'pointer' }}
            disabled={isUpdating}
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
            disabled={isUpdating}
          />
          {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="userName">Username</label>
          <input
            type="text"
            id="userName"
            {...register('userName')}
            disabled={isUpdating}
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
            disabled={isUpdating}
          />
          {errors.email && (
            <p style={{ color: 'red' }}>{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password">
            New Password (Leave blank to keep current)
          </label>
          <input
            type="password"
            id="password"
            {...register('password')}
            disabled={isUpdating}
          />
          {errors.password && (
            <p style={{ color: 'red' }}>{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password_confirmation">Confirm New Password</label>
          <input
            type="password"
            id="password_confirmation"
            {...register('password_confirmation')}
            disabled={isUpdating}
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
                disabled={isUpdating}
              />
              User
            </label>
            <label>
              <input
                type="radio"
                value="admin"
                {...register('role')}
                disabled={isUpdating}
              />
              Admin
            </label>
          </div>
          {errors.role && <p style={{ color: 'red' }}>{errors.role.message}</p>}
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setShowUpdate(false)}
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
