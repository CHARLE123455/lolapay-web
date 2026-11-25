import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useId, useState, type SyntheticEvent } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { errorMessage } from '../lib/types';
import { AuthLayout } from './AuthLayout';
import { GoogleButton } from './GoogleButton';

const DEFAULT_REDIRECT = '/dashboard';

const safeRedirect = (value: unknown): string => {
  if (typeof value !== 'string') return DEFAULT_REDIRECT;
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return DEFAULT_REDIRECT;
  return value;
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(
    params.get('error') === 'google_failed' ? 'Google sign-in failed. Please try again.' : ''
  );
  const [busy, setBusy] = useState(false);

  const from = safeRedirect((location.state as { from?: unknown } | null)?.from);

  const submit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await login({ email: email.trim().toLowerCase(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setPassword('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your LolaPay account">
      {error && (
        <div className="error" id={errorId} role="alert">
          {error}
        </div>
      )}
      <form onSubmit={submit} noValidate={false} aria-busy={busy}>
        <div className="field">
          <label htmlFor={emailId}>Email</label>
          <div className="input-wrap">
            <Mail size={16} aria-hidden="true" />
            <input
              id={emailId}
              className="input"
              type="email"
              name="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              disabled={busy}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor={passwordId}>Password</label>
          <div className="input-wrap">
            <Lock size={16} aria-hidden="true" />
            <input
              id={passwordId}
              className="input"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              disabled={busy}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              tabIndex={0}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                marginLeft: 'auto',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: 'inherit',
              }}
            >
              {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
          {busy ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <GoogleButton onError={setError} />
      <p className="muted" style={{ textAlign: 'center', marginTop: 20 }}>
        New to LolaPay?{' '}
        <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}