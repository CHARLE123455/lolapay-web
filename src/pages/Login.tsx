import { useState, type SubmitEvent } from 'react';import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { errorMessage } from '../lib/types';
import { AuthLayout } from './AuthLayout';
import { GoogleButton } from './GoogleButton';

const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD as string | undefined;
const DEMO_EMAILS = (import.meta.env.VITE_DEMO_EMAILS as string | undefined)?.split(',').map((e) => e.trim()) ?? [];
const DEMO: [string, string][] = DEMO_PASSWORD ? DEMO_EMAILS.map((email) => [email, email.split('@')[0]]) : [];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(params.get('error') === 'google_failed' ? 'Google sign-in failed. Please try again.' : '');
  const [busy, setBusy] = useState(false);
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your LolaPay account">
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit}>
        <div className="field">
          <label>Email</label>
          <div className="input-wrap">
            <Mail size={16} />
            <input className="input" type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
        </div>
        <div className="field">
          <label>Password</label>
          <div className="input-wrap">
            <Lock size={16} />
            <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
        </div>
        <button className="btn btn-primary btn-lg" disabled={busy}>
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
      {import.meta.env.DEV && DEMO.length > 0 && (
        <div className="demo-box">
          Demo accounts:{' '}
          {DEMO.map(([em, name], i) => (
            <span key={em}>
              <button
                type="button"
                onClick={() => {
                  setEmail(em);
                  setPassword(DEMO_PASSWORD as string);
                }}
              >
                {name}
              </button>
              {i < DEMO.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </div>
      )}
    </AuthLayout>
  );
}