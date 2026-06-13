import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { updateUser } from '../../app/services/reduxTollkit/asyncThunks/UserThunk';

const profileSchema = yup.object({
  name: yup.string().required('Full name is required').min(3, 'Use at least 3 characters'),
  userName: yup
    .string()
    .required('Username is required')
    .min(3, 'Use at least 3 characters')
    .max(20, 'Use 20 characters or fewer')
    .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .notRequired()
    .min(8, 'Use at least 8 characters'),
  password_confirmation: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .when('password', {
      is: (password) => Boolean(password),
      then: (schema) =>
        schema
          .required('Confirm the new password')
          .oneOf([yup.ref('password')], 'Passwords must match'),
      otherwise: (schema) => schema.notRequired(),
    }),
});

const getUserId = (user) => user?.id || user?._id;

const getUsername = (user) => user?.userName || user?.username || '';

const getInitials = (name) => {
  if (!name) return 'U';

  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const formatDate = (value) => {
  if (!value) return 'Not available';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function ProfileSettings() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [status, setStatus] = useState({ type: '', message: '' });

  const defaultValues = useMemo(
    () => ({
      name: user?.name || '',
      userName: getUsername(user),
      email: user?.email || '',
      password: '',
      password_confirmation: '',
    }),
    [user]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues,
    mode: 'onTouched',
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const userId = getUserId(user);
  const displayName = user?.name || 'Heritage Reader';
  const username = getUsername(user) || 'reader';
  const initials = getInitials(displayName);

  const onSubmit = async (data) => {
    setStatus({ type: '', message: '' });

    if (!userId) {
      setStatus({
        type: 'error',
        message: 'Your profile could not be identified. Please sign in again.',
      });
      return;
    }

    const payload = {
      name: data.name,
      userName: data.userName,
      email: data.email,
    };

    if (data.password) {
      payload.password = data.password;
      payload.password_confirmation = data.password_confirmation;
    }

    try {
      await dispatch(updateUser({ id: userId, data: payload })).unwrap();
      reset({
        ...data,
        password: '',
        password_confirmation: '',
      });
      setStatus({ type: 'success', message: 'Profile updated successfully.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error || 'Could not update your profile. Please try again.',
      });
    }
  };

  return (
    <section className="profile-settings-page">
      <div className="profile-settings-shell">
        <div className="profile-settings-header">
          <div>
            <p className="user-section-eyebrow">Profile Settings</p>
            <h1>Manage your account</h1>
            <p>
              Keep your Turath profile details up to date for saved resources,
              reading progress, and recommendations.
            </p>
          </div>

          <div className="profile-identity-card">
            <span>{initials}</span>
            <div>
              <strong>{displayName}</strong>
              <small>@{username}</small>
            </div>
          </div>
        </div>

        <div className="profile-settings-grid">
          <form className="profile-settings-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="profile-form-section">
              <div>
                <h2>Personal Information</h2>
                <p>This information is pulled from your account and saved through the API.</p>
              </div>

              {status.message && (
                <div className={`profile-status is-${status.type}`}>
                  {status.message}
                </div>
              )}

              <div className="profile-field-grid">
                <label className="profile-field">
                  <span>Full name</span>
                  <input type="text" {...register('name')} />
                  {errors.name && <small>{errors.name.message}</small>}
                </label>

                <label className="profile-field">
                  <span>Username</span>
                  <input type="text" autoCapitalize="none" {...register('userName')} />
                  {errors.userName && <small>{errors.userName.message}</small>}
                </label>

                <label className="profile-field is-wide">
                  <span>Email address</span>
                  <input type="email" {...register('email')} />
                  {errors.email && <small>{errors.email.message}</small>}
                </label>
              </div>
            </div>

            <div className="profile-form-section">
              <div>
                <h2>Password</h2>
                <p>Leave these fields empty if you do not want to change your password.</p>
              </div>

              <div className="profile-field-grid">
                <label className="profile-field">
                  <span>New password</span>
                  <input type="password" autoComplete="new-password" {...register('password')} />
                  {errors.password && <small>{errors.password.message}</small>}
                </label>

                <label className="profile-field">
                  <span>Confirm password</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    {...register('password_confirmation')}
                  />
                  {errors.password_confirmation && (
                    <small>{errors.password_confirmation.message}</small>
                  )}
                </label>
              </div>
            </div>

            <div className="profile-form-actions">
              <button type="button" onClick={() => reset(defaultValues)} disabled={!isDirty}>
                Reset
              </button>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          <aside className="profile-account-card">
            <h2>Account Details</h2>

            <dl>
              <div>
                <dt>Role</dt>
                <dd>{user?.role || 'User'}</dd>
              </div>
              <div>
                <dt>Member Since</dt>
                <dd>{formatDate(user?.created_at || user?.joined_at)}</dd>
              </div>
              <div>
                <dt>Last Login</dt>
                <dd>{formatDate(user?.last_login_at)}</dd>
              </div>
              <div>
                <dt>User ID</dt>
                <dd>{userId || 'Not available'}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}
