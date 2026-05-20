// src/pages/DashboardPage.jsx
// ============================================================
// INTERVIEW EXPLANATION:
// "What is the difference between useMemo and useCallback?"
//
// useCallback: memoises a FUNCTION — returns same function reference
//              unless dependencies change. Used when passing callbacks
//              to children or useEffect dependency arrays.
//
// useMemo:     memoises a COMPUTED VALUE — only recalculates when
//              dependencies change. Used for expensive calculations.
//
// Example here: we use a custom hook (useJobs) which internally uses
// useCallback so fetchJobs doesn't cause an infinite useEffect loop.
//
// "What is the virtual DOM and how does React use it?"
// React keeps a lightweight copy of the real DOM in memory.
// When state changes, it computes the DIFF between old and new virtual DOM.
// Only the changed nodes are updated in the real DOM — much faster than
// replacing everything. This is called reconciliation.
// ============================================================

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { useJobs } from '../hooks/useJobs';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const STATUS_COLOR  = { Wishlist:'#38BDF8', Applied:'#A78BFA', Interview:'#FB923C', Offer:'#34D399', Rejected:'#F87171' };
const ALL_STATUSES  = ['All','Wishlist','Applied','Interview','Offer','Rejected'];

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#12121e', border:'1px solid var(--border-2)', borderRadius:'10px', padding:'10px 14px', fontSize:'13px' }}>
      <p style={{ color:'var(--text-2)', marginBottom:'2px' }}>{payload[0].payload.name}</p>
      <p style={{ fontWeight:600, color: STATUS_COLOR[payload[0].payload.name] || 'var(--text)' }}>
        {payload[0].value} application{payload[0].value !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('All');
  const [search,       setSearch]       = useState('');
  const [sort,         setSort]         = useState('newest');
  const [searchInput,  setSearchInput]  = useState(''); // local, debounce would go here

  const { jobs, stats, loading, error } = useJobs({ status: statusFilter, search, sort });

  // Derived stats from the stats array
  const statMap = useMemo(() => {
    const m = {};
    stats.forEach(s => { m[s.status] = Number(s.count); });
    return m;
  }, [stats]);

  const total      = Object.values(statMap).reduce((a, b) => a + b, 0);
  const interviews = statMap['Interview'] || 0;
  const offers     = statMap['Offer']     || 0;
  const rejected   = statMap['Rejected']  || 0;
  const responseRate = total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0;

  const chartData = ALL_STATUSES.slice(1).map(s => ({ name: s, count: statMap[s] || 0 }));

  // Debounce-like: update search on button press / Enter
  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); };

  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: '36px', paddingBottom: '60px' }}>

        {/* ── Page header ──────────────────────────────────── */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px' }}>
            Career Dashboard
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '15px' }}>
            {total === 0
              ? `Welcome, ${user?.name?.split(' ')[0]}! Add your first application to get started.`
              : `Tracking ${total} application${total !== 1 ? 's' : ''} — keep going, ${user?.name?.split(' ')[0]}!`}
          </p>
        </div>

        {/* ── Stat cards ───────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total Applied',  value: total,           sub: 'all time',          color: '#A78BFA', icon: '📋' },
            { label: 'Interviews',     value: interviews,      sub: `${responseRate}% response rate`, color: '#FB923C', icon: '🎤' },
            { label: 'Offers',         value: offers,          sub: offers > 0 ? '🎉 Nice work!' : 'Keep applying!', color: '#34D399', icon: '🏆' },
            { label: 'Rejected',       value: rejected,        sub: 'every no → closer to yes', color: '#F87171', icon: '🔄' },
          ].map(({ label, value, sub, color, icon }) => (
            <div key={label} className="card fade-up" style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
                  {label}
                </p>
                <span style={{ fontSize: '20px' }}>{icon}</span>
              </div>
              <p style={{ fontSize: '36px', fontWeight: 700, color, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '8px' }}>
                {value}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-3)' }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Chart + Filter row ────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px', marginBottom: '24px', alignItems: 'start' }}>

          {/* Filter panel */}
          <div className="card" style={{ padding: '20px 24px' }}>
            {/* Search bar */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
              <input
                className="form-input"
                placeholder="🔍  Search company or role..."
                value={searchInput}
                onChange={e => { setSearchInput(e.target.value); if (!e.target.value) setSearch(''); }}
                style={{ flex: 1 }}
              />
              <select
                className="form-input"
                value={sort} onChange={e => setSort(e.target.value)}
                style={{ width: '150px' }}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="company">Company A–Z</option>
                <option value="role">Role A–Z</option>
              </select>
            </form>

            {/* Status filter pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {ALL_STATUSES.map(s => {
                const active = statusFilter === s;
                const col    = STATUS_COLOR[s];
                const count  = statMap[s] || 0;
                return (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    style={{
                      padding: '6px 15px', borderRadius: '999px', fontSize: '13px', fontWeight: 500,
                      border: `1px solid ${active ? (col || 'var(--primary)') : 'var(--border)'}`,
                      background: active ? (col ? col + '18' : 'rgba(123,97,255,0.18)') : 'transparent',
                      color: active ? (col || 'var(--primary-2)') : 'var(--text-3)',
                      cursor: 'pointer', transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                    {s !== 'All' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'inline-block', opacity: active ? 1 : 0.5 }} />}
                    {s}
                    {s !== 'All' && count > 0 && (
                      <span style={{ fontSize: '11px', opacity: 0.7 }}>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bar chart */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px', fontWeight: 500 }}>
              Applications by status
            </p>
            {total === 0 ? (
              <p style={{ color: 'var(--text-3)', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={chartData} barSize={22} margin={{ top: 4 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)', radius: 6 }} />
                  <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                    {chartData.map(d => <Cell key={d.name} fill={STATUS_COLOR[d.name] || '#888'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Jobs list ─────────────────────────────────────── */}
        {loading ? (
          <div className="page-loading">
            <div className="spinner" />
            <p>Loading your applications...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">⚠ {error}</div>
        ) : jobs.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-state-icon">
              {search || statusFilter !== 'All' ? '🔍' : '📭'}
            </div>
            <p className="empty-state-title">
              {search || statusFilter !== 'All' ? 'No matches found' : 'No applications yet'}
            </p>
            <p className="empty-state-desc">
              {search || statusFilter !== 'All'
                ? 'Try adjusting your search or filter'
                : 'Start tracking your job search — add your first application!'}
            </p>
            {!search && statusFilter === 'All' && (
              <Link to="/jobs/new" className="btn btn-primary">+ Add Your First Job</Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '4px' }}>
              {jobs.length} result{jobs.length !== 1 ? 's' : ''}
            </p>
            {jobs.map((job, i) => (
              <JobCard key={job.id} job={job} style={{ animationDelay: `${i * 0.04}s` }} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

// ── Job Card ───────────────────────────────────────────────────
function JobCard({ job, style = {} }) {
  const dateStr = job.applied_date
    ? new Date(job.applied_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const hasInterview = job.interview_date && new Date(job.interview_date) >= new Date();
  const interviewStr = hasInterview
    ? new Date(job.interview_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : null;

  return (
    <div className="card fade-up" style={{
      display: 'flex', alignItems: 'center', gap: '16px',
      padding: '16px 20px', flexWrap: 'wrap',
      transition: 'border-color 0.2s, transform 0.15s',
      cursor: 'default', ...style,
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-2)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Company initial avatar */}
      <div style={{
        width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
        background: `linear-gradient(135deg, ${STATUS_COLOR[job.status]}22, ${STATUS_COLOR[job.status]}44)`,
        border: `1px solid ${STATUS_COLOR[job.status]}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', fontWeight: 700, color: STATUS_COLOR[job.status],
      }}>
        {job.company[0].toUpperCase()}
      </div>

      {/* Company + role */}
      <div style={{ flex: 2, minWidth: '140px' }}>
        <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '2px', letterSpacing: '-0.01em' }}>
          {job.company}
        </p>
        <p style={{ color: 'var(--text-2)', fontSize: '13px' }}>{job.role}</p>
      </div>

      {/* Location + date */}
      <div style={{ flex: 1, minWidth: '110px' }}>
        {job.location && (
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '2px' }}>📍 {job.location}</p>
        )}
        {dateStr && (
          <p style={{ fontSize: '12px', color: 'var(--text-3)' }}>Applied {dateStr}</p>
        )}
      </div>

      {/* Upcoming interview alert */}
      {interviewStr && (
        <div style={{
          padding: '5px 12px', borderRadius: '8px',
          background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.25)',
          fontSize: '12px', color: '#FB923C', fontWeight: 500, flexShrink: 0,
        }}>
          🎤 Interview {interviewStr}
        </div>
      )}

      {/* Source pill */}
      <div style={{ flexShrink: 0 }}>
        <span style={{
          fontSize: '11px', padding: '4px 10px', borderRadius: '999px',
          background: 'var(--surface-2)', color: 'var(--text-3)',
          border: '1px solid var(--border)', fontWeight: 500,
        }}>
          {job.source}
        </span>
      </div>

      {/* Status badge */}
      <span className={`badge badge-${job.status}`} style={{ flexShrink: 0 }}>
        {job.status}
      </span>

      {/* Action links */}
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        {job.job_url && (
          <a href={job.job_url} target="_blank" rel="noreferrer"
            className="btn btn-ghost btn-sm" title="View job posting">
            🔗
          </a>
        )}
        <Link to={`/jobs/edit/${job.id}`} className="btn btn-glass btn-sm">
          Edit →
        </Link>
      </div>
    </div>
  );
}
