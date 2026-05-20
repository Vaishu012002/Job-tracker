// src/pages/AddJobPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import JobForm from '../components/JobForm';

export default function AddJobPage() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true); setError('');
    try {
      await api.post('/jobs', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: '40px', paddingBottom: '60px', maxWidth: '700px' }}>
        <div style={{ marginBottom: '28px' }}>
          <Link to="/dashboard" style={{ color: 'var(--text-3)', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
            ← Back to dashboard
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px' }}>
            Add Application
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '14px' }}>
            Track a new job you've applied to or are planning to apply for
          </p>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          <JobForm onSubmit={handleSubmit} loading={loading} error={error} submitLabel="Save Application" />
        </div>
      </main>
    </>
  );
}
