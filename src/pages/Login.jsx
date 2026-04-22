import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../app/services/reduxTollkit/asyncThunks/AuthThunk';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(login({ email, password }));
    navigate('/home')
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>API Test Login</h2>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? 'Testing...' : 'Login'}
        </button>
      </form>

      <hr />
      <div>
        <h4>Debug Info:</h4>
        <p>Status: {loading ? 'Loading...' : 'Idle'}</p>
      </div>
    </div>
  );
}
