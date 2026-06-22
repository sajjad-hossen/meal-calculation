import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Server, Coffee, Zap, Hourglass } from 'lucide-react';
import authService from '../services/authService';
import { useAuth } from '../components/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [longLoading, setLongLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, user } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      // If loading takes more than 3 seconds, assume Render cold start
      timer = setTimeout(() => {
        setLongLoading(true);
      }, 3000);
    } else {
      setLongLoading(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      if (response.user.role === 'Admin' && from === '/') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      {/* Animated blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      <div className="auth-card animate-slide-up">
        {/* Branding */}
        <div className="auth-brand">
          <div className="auth-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="10" fill="url(#logoGrad)" />
              <circle cx="16" cy="16" r="9" fill="white" />
              <circle cx="23" cy="9" r="4.5" fill="url(#logoGrad)" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7C3AED" />
                  <stop offset="1" stopColor="#6B21A8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="auth-brand-title">BiteBoard</h1>
          <p className="auth-brand-subtitle">Meal Management System</p>
        </div>

        <h2 className="auth-heading">Welcome Back</h2>
        <p className="auth-subheading">Sign in to your account to continue</p>

        {error && (
          <div className="auth-alert auth-alert-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-email">Email Address</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                id="login-email"
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="login-password">Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="login-password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="auth-btn-primary"
            disabled={loading}
          >
            {loading ? (
              <Hourglass className="auth-hourglass" size={20} />
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Sign In
              </>
            )}
          </button>
        </form>

        {longLoading && (
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-slate-700 animate-fade-in">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex items-center justify-center space-x-2 text-indigo-500">
                <Coffee className="animate-bounce" size={24} />
                <Server className="animate-pulse" size={24} />
                <Zap className="animate-bounce" style={{ animationDelay: '0.2s' }} size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">Waking up the server...</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Since we use a free host, the server goes to sleep. It might take ~30 seconds to brew some coffee and wake up. Thanks for your patience!</p>
              </div>
              {/* Fake progress bar that fills up over 30 seconds */}
              <div className="w-full h-1.5 bg-indigo-100 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%', animation: 'fillProgress 30s ease-out forwards' }}></div>
              </div>
            </div>
            <style>{`
              @keyframes fillProgress {
                0% { width: 0%; }
                100% { width: 95%; }
              }
              .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
            `}</style>
          </div>
        )}

        {!user && (
          <p className="auth-footer-text">
            Don't have an account?{' '}
            <Link to="/register" className="auth-footer-link" id="goto-register-link">
              Create a Mess
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
