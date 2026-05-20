// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const { login, loading, error } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }} className="fade-up">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '60px', height: '60px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-2))',
            borderRadius: '18px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '28px',
            boxShadow: '0 8px 24px var(--primary-glow)',
          }}>🎯</div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '8px' }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '15px' }}>
            Sign in to your career dashboard
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '32px' }}>
          {error && <div className="alert alert-error">⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                className="form-input" type="email"
                placeholder="you@example.com" autoComplete="email"
                value={email} onChange={e => setEmail(e.target.value)} required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input" type={showPwd ? 'text' : 'password'}
                  placeholder="Your password" autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)} required
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-3)',
                    cursor: 'pointer', fontSize: '16px', padding: '2px',
                  }}>
                  {showPwd ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg"
              disabled={loading} style={{ marginTop: '8px' }}>
              {loading ? <><span className="spinner spinner-sm" /> Signing in...</> : 'Sign In →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '20px', color: 'var(--text-2)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 500 }}>Create one free →</Link>
        </p>
      </div>
    </div>
  );
}
