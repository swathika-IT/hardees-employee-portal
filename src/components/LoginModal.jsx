import React, { useState } from 'react';
import HardeesLogo from './HardeesLogo';
import { Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, X, Shield } from 'lucide-react';
import { api } from '../api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!employeeId.trim()) {
      setError('Please enter your Employee ID.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const data = await api.login(employeeId.trim().toUpperCase(), password);
      onLoginSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid Employee ID or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (id, pwd) => {
    setEmployeeId(id);
    setPassword(pwd);
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Shield size={20} color="#C8202B" />
            <span>Hardee's Employee Portal Login</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <HardeesLogo height={48} />
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Rockingham, NC Store Operations & Attendance Portal
            </p>
          </div>

          {/* Quick Demo Credential Buttons for Testing */}
          <div className="quick-fill-box">
            <span className="quick-fill-label">Quick Fill Authorized Credentials:</span>
            <div className="quick-fill-btns">
              <button
                type="button"
                className="btn-chip"
                onClick={() => handleQuickFill('DEMO1001', 'Demo@123')}
              >
                Crew Member (DEMO1001)
              </button>
              <button
                type="button"
                className="btn-chip"
                onClick={() => handleQuickFill('MGR001', 'Admin@123')}
              >
                Store Manager (MGR001)
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'var(--status-red-bg)',
              border: '1px solid #F5C6CB',
              color: 'var(--hardees-red)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="loginEmployeeId">
                Employee Identifier (Code)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="loginEmployeeId"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '38px', textTransform: 'uppercase' }}
                  placeholder="e.g. DEMO1001 or MGR001"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  autoComplete="username"
                  autoFocus
                />
                <User size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#8E929B' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="loginPassword">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="loginPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '38px', paddingRight: '40px' }}
                  placeholder="Enter your portal password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#8E929B' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#8E929B'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          </form>

          <p style={{
            fontSize: '0.74rem',
            color: 'var(--text-light)',
            textAlign: 'center',
            marginTop: '16px',
            lineHeight: 1.4
          }}>
            Protected restaurant operational portal. Unauthorized access is prohibited. Records and check-ins are logged persistently in MySQL.
          </p>
        </div>
      </div>
    </div>
  );
}
