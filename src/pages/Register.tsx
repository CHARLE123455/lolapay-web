import { AtSign, Lock, Mail, Phone, User } from 'lucide-react';
import { useState, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { ApiError, errorMessage } from '../lib/types';
import { AuthLayout } from './AuthLayout';
import { GoogleButton } from './GoogleButton';

const EMPTY = { firstName: '', lastName: '', email: '', tag: '', phone: '', password: '' };
type Field = keyof typeof EMPTY;

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});
  const [busy, setBusy] = useState(false);
  const set = (k: Field) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setFieldErrors({});
    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        ...(form.tag ? { tag: form.tag.replace(/^@/, '') } : {}),
        ...(form.phone ? { phone: form.phone } : {}),
      });
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.details?.length) {
        const fe: Partial<Record<Field, string>> = {};
        for (const d of err.details) fe[d.path as Field] = d.message;
        setFieldErrors(fe);
      }
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const input = (k: Field, label: string, Icon: typeof User, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="field">
      <label>{label}</label>
      <div className="input-wrap">
        <Icon size={16} />
        <input className="input" value={form[k]} onChange={set(k)} {...props} />
      </div>
      {fieldErrors[k] && <span className="help" style={{ color: 'var(--danger)' }}>{fieldErrors[k]}</span>}
    </div>
  );

  return (
    <AuthLayout title="Create your account" subtitle="Get a free wallet and virtual card in seconds">
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit}>
        <div className="form-row">
          {input('firstName', 'First name', User, { required: true, placeholder: 'Lola' })}
          {input('lastName', 'Last name', User, { required: true, placeholder: 'Omotayo' })}
        </div>
        {input('email', 'Email', Mail, { type: 'email', required: true, placeholder: 'you@example.com' })}
        <div className="form-row">
          {input('tag', 'LolaPay tag (optional)', AtSign, { placeholder: 'lola', pattern: '@?[a-zA-Z0-9_]{3,20}', title: '3-20 letters, numbers or underscores' })}
          {input('phone', 'Phone (optional)', Phone, { placeholder: '+2348012345678' })}
        </div>
        {input('password', 'Password', Lock, { type: 'password', required: true, minLength: 8, placeholder: 'At least 8 characters, with a number' })}
        <button className="btn btn-primary btn-lg" disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <GoogleButton onError={setError} />
      <p className="muted" style={{ textAlign: 'center', marginTop: 20 }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
