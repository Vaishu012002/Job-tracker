// src/hooks/useJobs.js
// ============================================================
// INTERVIEW EXPLANATION:
// "What are custom hooks and why do you use them?"
//
// A custom hook is a function that starts with "use" and can call
// other hooks (useState, useEffect, etc.) inside it.
//
// Why? Separation of concerns:
//   - Components should only handle RENDERING
//   - Data fetching logic lives in the hook
//
// Benefits:
//   1. Reusable — any component can call useJobs() to get jobs + loading state
//   2. Testable — test the hook logic independently from the component
//   3. Clean components — DashboardPage becomes much smaller
//
// "What is useCallback?"
// Without useCallback, fetchJobs is recreated on every render.
// useEffect's dependency array sees a "new" function → infinite loop.
// useCallback memoises the function — same reference unless dependencies change.
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export function useJobs(filters = {}) {
  const [jobs,    setJobs]    = useState([]);
  const [stats,   setStats]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const { status, search, sort } = filters;

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (status && status !== 'All') params.append('status', status);
      if (search?.trim())             params.append('search', search.trim());
      if (sort)                       params.append('sort', sort);

      const { data } = await api.get(`/jobs?${params}`);
      setJobs(data.data   || []);
      setStats(data.stats || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, [status, search, sort]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, stats, loading, error, refetch: fetchJobs };
}
