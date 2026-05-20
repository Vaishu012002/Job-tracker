// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form,     setForm]     = useState({ name: '', email: '', password: '', confirm: '' });
  const [localErr, setLocalErr] = useState('');
  const { register, loading, error } = useAuth();

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalErr('');
    if (form.password !== form.confirm) return setLocalErr('Passwords do not match.');
    if (form.password.length < 6)       return setLocalErr('Password must be at least 6 characters.');
    register(form.name.trim(), form.email.trim(), form.password);
  };

  const displayError = localErr || error;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }} className="fade-up">

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '60px', height: '60px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-2))',
            borderRadius: '18px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '28px',
            boxShadow: '0 8px 24px var(--primary-glow)',
          }}>🎯</div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '8px' }}>
            Start tracking for free
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '15px' }}>
            Organise your entire job search in one place
          </p>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          {displayError && <div className="alert alert-error">⚠ {displayError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" placeholder="Your full name"
                autoComplete="name" value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-input" type="email" placeholder="you@example.com"
                autoComplete="email" value={form.email} onChange={set('email')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min. 6 characters"
                autoComplete="new-password" value={form.password} onChange={set('password')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-input" type="password" placeholder="Repeat your password"
                autoComplete="new-password" value={form.confirm} onChange={set('confirm')} required />
            </div>

            {/* Password strength indicator */}
            {form.password.length > 0 && (
              <div style={{ marginTop: '-10px', marginBottom: '18px' }}>
                <div style={{ height: '3px', background: 'var(--surface-3)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '99px',
                    width: form.password.length >= 10 ? '100%' : form.password.length >= 6 ? '60%' : '25%',
                    background: form.password.length >= 10 ? 'var(--offer)' : form.password.length >= 6 ? 'var(--interview)' : 'var(--rejected)',
                    transition: 'all 0.3s',
                  }} />
                </div>
                <p style={{ fontSize: '11px', marginTop: '5px', color: 'var(--text-3)' }}>
                  {form.password.length >= 10 ? '✅ Strong password' : form.password.length >= 6 ? '⚠️ Acceptable — longer is safer' : '❌ Too short'}
                </p>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block btn-lg"
              disabled={loading} style={{ marginTop: '8px' }}>
              {loading ? <><span className="spinner spinner-sm" /> Creating account...</> : 'Create Account →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '20px', color: 'var(--text-2)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 500 }}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
