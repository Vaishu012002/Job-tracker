// src/components/JobForm.jsx
// ============================================================
// INTERVIEW EXPLANATION:
// "What is a controlled component in React?"
//
// A controlled component's value is driven by React state.
// The input element has NO internal state — React owns it.
//
// Uncontrolled: <input ref={inputRef} />  — DOM owns the value
// Controlled:   <input value={form.company} onChange={e => setForm(...)} />  — React owns it
//
// Why controlled is better:
//   - Real-time validation while the user types
//   - Programmatically set values (pre-fill form for edit)
//   - Derive UI from state (disable submit if fields are empty)
//
// "Why use a single handleChange for all fields?"
// Using [e.target.name] as a computed key means one function
// handles all 10+ inputs. Scales cleanly as you add more fields.
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';

const STATUSES = ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected'];
const SOURCES  = ['LinkedIn', 'Naukri', 'Company Website', 'Referral', 'Indeed', 'Other'];

const DEFAULTS = {
  company: '', role: '', status: 'Applied', source: 'LinkedIn',
  salary: '', location: '', job_url: '', notes: '',
  applied_date: new Date().toISOString().split('T')[0],
  interview_date: '',
};

// Status dot colours for the dropdown indicator
const STATUS_COLOR = {
  Wishlist: '#38BDF8', Applied: '#A78BFA', Interview: '#FB923C',
  Offer: '#34D399', Rejected: '#F87171',
};

export default function JobForm({ initialData = {}, onSubmit, loading, error, submitLabel = 'Save' }) {
  const [form, setForm] = useState({ ...DEFAULTS, ...initialData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const isEdit = Boolean(initialData?.company);

  return (
    <form onSubmit={handleSubmit} className="fade-up">
      {error && <div className="alert alert-error">⚠ {error}</div>}

      {/* Company + Role */}
      <div className="form-grid-2">
        <div className="form-group">
          <label className="form-label">Company *</label>
          <input className="form-input" name="company" placeholder="e.g. Infosys, TCS, Google"
            value={form.company} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Job Role *</label>
          <input className="form-input" name="role" placeholder="e.g. Software Engineer"
            value={form.role} onChange={handleChange} required />
        </div>
      </div>

      {/* Status + Source */}
      <div className="form-grid-2">
        <div className="form-group">
          <label className="form-label">Application Status</label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)',
              width: '8px', height: '8px', borderRadius: '50%',
              background: STATUS_COLOR[form.status] || 'var(--text-3)', flexShrink: 0,
              pointerEvents: 'none', zIndex: 1,
            }} />
            <select className="form-input" name="status" value={form.status} onChange={handleChange}
              style={{ paddingLeft: '30px' }}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">How did you find it?</label>
          <select className="form-input" name="source" value={form.source} onChange={handleChange}>
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Salary + Location */}
      <div className="form-grid-2">
        <div className="form-group">
          <label className="form-label">Salary / CTC</label>
          <input className="form-input" name="salary" placeholder="e.g. 8 LPA, ₹80,000/mo"
            value={form.salary || ''} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="form-input" name="location" placeholder="e.g. Bangalore, Remote"
            value={form.location || ''} onChange={handleChange} />
        </div>
      </div>

      {/* Dates */}
      <div className="form-grid-2">
        <div className="form-group">
          <label className="form-label">Date Applied</label>
          <input className="form-input" type="date" name="applied_date"
            value={form.applied_date || ''} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Interview Date <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(if scheduled)</span></label>
          <input className="form-input" type="date" name="interview_date"
            value={form.interview_date || ''} onChange={handleChange} />
        </div>
      </div>

      {/* Job URL */}
      <div className="form-group">
        <label className="form-label">Job Posting URL</label>
        <input className="form-input" type="url" name="job_url"
          placeholder="https://linkedin.com/jobs/view/..."
          value={form.job_url || ''} onChange={handleChange} />
      </div>

      {/* Notes */}
      <div className="form-group">
        <label className="form-label">Notes & Prep</label>
        <textarea className="form-input" name="notes" rows={4}
          placeholder="Recruiter name, contact info, key requirements, interview prep, follow-up reminders..."
          value={form.notes || ''} onChange={handleChange} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '140px' }}>
          {loading ? <><span className="spinner spinner-sm" /> Saving...</> : `💾 ${submitLabel}`}
        </button>
        <Link to="/dashboard" className="btn btn-ghost">Cancel</Link>
      </div>
    </form>
  );
}
