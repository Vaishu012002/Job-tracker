// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  // Get initials for avatar
  const initials = user.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: 'rgba(8,8,16,0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: '64px', gap: '16px',
      }}>

        {/* Logo */}
        <Link to="/dashboard" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          color: 'var(--text)', fontWeight: 700, fontSize: '17px',
          letterSpacing: '-0.02em', flexShrink: 0,
        }}>
          <span style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-2))',
            borderRadius: '9px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '16px', boxShadow: '0 4px 12px var(--primary-glow)',
          }}>🎯</span>
          JobTracker
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          <Link to="/jobs/new" className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
            <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span> Add Job
          </Link>

          {/* User avatar + name */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '6px 14px 6px 8px',
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: '999px', cursor: 'default',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0,
            }}>
              {initials}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-2)' }}>
              {user.name?.split(' ')[0]}
            </span>
          </div>

          <button onClick={logout} className="btn btn-ghost btn-sm">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
