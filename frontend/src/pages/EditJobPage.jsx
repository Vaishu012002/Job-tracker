// src/pages/EditJobPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import JobForm from '../components/JobForm';

export default function EditJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job,     setJob]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [fetching,setFetching]= useState(true);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(({ data }) => {
        const j = data.data;
        setJob({
          ...j,
          applied_date:   j.applied_date   ? String(j.applied_date).split('T')[0]   : '',
          interview_date: j.interview_date ? String(j.interview_date).split('T')[0] : '',
        });
      })
      .catch(() => setError('Could not load job. It may have been deleted.'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true); setError('');
    try {
      await api.put(`/jobs/${id}`, formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Permanently delete this application? This cannot be undone.')) return;
    try {
      await api.delete(`/jobs/${id}`);
      navigate('/dashboard');
    } catch {
      setError('Failed to delete.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: '40px', paddingBottom: '60px', maxWidth: '700px' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <Link to="/dashboard" style={{ color: 'var(--text-3)', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
              ← Back to dashboard
            </Link>
            <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px' }}>
              Edit Application
            </h1>
            {job && (
              <p style={{ color: 'var(--text-2)', fontSize: '14px' }}>
                {job.role} at <strong style={{ color: 'var(--text)' }}>{job.company}</strong>
              </p>
            )}
          </div>
          {job && (
            <button onClick={handleDelete} className="btn btn-danger btn-sm">
              🗑 Delete
            </button>
          )}
        </div>

        <div className="card" style={{ padding: '32px' }}>
          {fetching ? (
            <div className="page-loading"><div className="spinner" /></div>
          ) : error && !job ? (
            <div className="alert alert-error">⚠ {error}</div>
          ) : (
            <JobForm initialData={job} onSubmit={handleSubmit} loading={loading} error={error} submitLabel="Save Changes" />
          )}
        </div>
      </main>
    </>
  );
}
