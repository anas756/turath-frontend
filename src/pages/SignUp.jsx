import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';
import signupPhoto from '../assets/arch-signup.png';

export default function SignUp() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: dispatch register action
  };

  return (
    <div className="auth-page">
      <div className="auth-photo" style={{ backgroundImage: `url(${signupPhoto})` }}>
        <div className="photo-overlay" />
        <div className="photo-caption">
          <p className="photo-brand">Turath Digital</p>
          <p className="photo-tagline">Preserving the legacy of the Makhzen through curated digital archives.</p>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="form-inner">
          <h1 className="auth-title signup-title">Join Turath<br />Digital</h1>
          <p className="auth-subtitle">Become a curator of heritage.</p>

          <div className="fields">
            <div className="field-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="e.g. Tariq Ibn Ziyad" required />
            </div>
            <div className="field-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
            </div>
            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
            </div>
          </div>

          <button className="btn-cta" onClick={handleSubmit}>
            Create Account →
          </button>

          <div className="switch-line">
            <Link to="/login">Already have an account? Log in</Link>
          </div>

          <p className="legal-note">
            By joining, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}