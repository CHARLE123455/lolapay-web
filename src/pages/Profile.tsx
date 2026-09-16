import { useRef, useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Copy, Trash2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/useAuth';
import { useAccount, useUpdateProfile, useUploadAvatar } from '../hooks/queries';
import { formatMoney } from '../lib/format';
import { errorMessage } from '../lib/types';
import { usersService } from '../services';
import { Avatar, PageTitle, useToast } from '../components/ui';

const AVATAR_MAX_MB = 5;

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const account = useAccount();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', phone: user?.phone ?? '', tag: user?.tag ?? '' });
  const [error, setError] = useState('');

  const save = useUpdateProfile();
  const upload = useUploadAvatar();
  const removeAvatar = useMutation({ mutationFn: usersService.removeAvatar });
  const deactivate = useMutation({ mutationFn: usersService.deleteAccount });

  if (!user) return null;
  const copy = (v: string) => navigator.clipboard.writeText(v).then(() => toast('Copied'));

  const submit = (e: SubmitEvent) => {
    e.preventDefault();
    setError('');
    save.mutate(
      { firstName: form.firstName, lastName: form.lastName, phone: form.phone || null, ...(form.tag !== user.tag ? { tag: form.tag } : {}) },
      { onSuccess: async () => (await refreshUser(), toast('Profile updated')), onError: (err) => setError(errorMessage(err)) },
    );
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > AVATAR_MAX_MB * 1024 * 1024) return toast(`Image must be ${AVATAR_MAX_MB} MB or smaller`, 'error');
    upload.mutate(file, { onSuccess: async () => (await refreshUser(), toast('Photo updated')), onError: (err) => toast(errorMessage(err), 'error') });
  };

  return (
    <>
      <PageTitle title="Profile" subtitle="Your personal details and account information." />
      <div className="grid-2">
        <section className="card">
          <div className="row" style={{ marginBottom: 20, alignItems: 'flex-start' }}>
            <div style={{ position: 'relative' }}>
              <Avatar user={user} size="lg" />
              <button className="icon-btn" style={{ position: 'absolute', right: -6, bottom: -6, width: 30, height: 30 }} aria-label="Change photo" disabled={upload.isPending} onClick={() => fileRef.current?.click()}>
                <Camera size={14} />
              </button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => onFile(e.target.files?.[0])} />
            </div>
            <div>
              <h2 style={{ fontSize: 18 }}>{user.fullName}</h2>
              <p className="muted">
                @{user.tag} · {user.email}
              </p>
              <p className="muted" style={{ fontSize: 12 }}>
                Member since {new Date(user.createdAt).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })} · {user.provider === 'GOOGLE' ? 'Signed up with Google' : 'Email account'}
              </p>
              {user.avatarUrl && (
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 6, color: 'var(--danger)' }} disabled={removeAvatar.isPending} onClick={() => removeAvatar.mutate(undefined, { onSuccess: () => refreshUser() })}>
                  <Trash2 size={13} /> Remove photo
                </button>
              )}
            </div>
          </div>
          {error && <div className="error">{error}</div>}
          <form onSubmit={submit}>
            <div className="form-row">
              <div className="field">
                <label>First name</label>
                <input className="input" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div className="field">
                <label>Last name</label>
                <input className="input" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label>LolaPay tag</label>
                <input className="input" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value.replace(/^@/, '') })} pattern="[a-zA-Z0-9_]{3,20}" />
              </div>
              <div className="field">
                <label>Phone</label>
                <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+2348012345678" />
              </div>
            </div>
            <div className="field">
              <label>Email</label>
              <input className="input" value={user.email} disabled />
            </div>
            <button className="btn btn-primary" disabled={save.isPending}>
              {save.isPending ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <section className="card">
            <div className="card-head">
              <h2>Wallet account</h2>
            </div>
            {account.data && (
              <>
                <div className="toggle">
                  <div>
                    <b>Account number</b>
                    <span>Share this to receive money</span>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={() => copy(account.data.accountNumber)}>
                    {account.data.accountNumber} <Copy size={13} />
                  </button>
                </div>
                <div className="toggle">
                  <div>
                    <b>LolaPay tag</b>
                    <span>Friends can send to your @tag</span>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={() => copy(`@${user.tag}`)}>
                    @{user.tag} <Copy size={13} />
                  </button>
                </div>
                <div className="toggle">
                  <div>
                    <b>Balance</b>
                    <span>{account.data.currency}</span>
                  </div>
                  <b>{formatMoney(account.data.balance, account.data.currency)}</b>
                </div>
              </>
            )}
          </section>

          <section className="card" style={{ borderLeft: '3px solid var(--danger)' }}>
            <div className="card-head">
              <h2 style={{ color: 'var(--danger)' }}>Danger zone</h2>
            </div>
            <p className="muted" style={{ marginBottom: 12 }}>
              Deactivating disables login and signs you out everywhere. Your transaction history is retained for your counterparties.
            </p>
            <button
              className="btn btn-danger btn-sm"
              disabled={deactivate.isPending}
              onClick={() =>
                confirm('Deactivate your LolaPay account?') &&
                deactivate.mutate(undefined, { onSuccess: async () => (await logout(), navigate('/login')), onError: (err) => toast(errorMessage(err), 'error') })
              }
            >
              Deactivate account
            </button>
          </section>
        </div>
      </div>
    </>
  );
}
