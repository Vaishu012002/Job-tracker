// src/context/AuthContext.jsx
// ============================================================
// INTERVIEW EXPLANATION:
// "What is React Context and when do you use it?"
//
// Context solves "prop drilling" — passing data through many layers of
// components just to reach a deeply nested child.
//
// Without Context:
//   App → Layout → Navbar → UserMenu → Avatar (user passed at every step)
//
// With Context:
//   Any component calls useAuth() and gets the user directly.
//
// "When NOT to use Context?"
// Context re-renders every consumer when the value changes.
// Don't put rapidly-changing state (mouse position, scroll) in Context.
// Use it for slow-changing global state: auth, theme, language.
//
// "What is the difference between Context and Redux?"
// Context is built-in, simple, good for small-medium apps.
// Redux has a single store, time-travel debugging, middleware (redux-thunk/saga).
// Use Redux when: complex state logic, many unrelated components share state.
// ============================================================

import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Lazy initialiser — only runs once on mount
    // Restores the logged-in user from localStorage on page refresh
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null; // malformed JSON — treat as logged out
    }
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const navigate = useNavigate();

  const persist = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user',  JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      persist(data.data);
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, [persist, navigate]);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      persist(data.data);
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, [persist, navigate]);

  const logout = useCallback(() => {
    setUser(null);
    setError('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  const clearError = useCallback(() => setError(''), []);

  const value = { user, loading, error, login, register, logout, clearError };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — nicer DX than useContext(AuthContext) everywhere
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
