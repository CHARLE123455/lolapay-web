import { useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { KeyRound, Laptop, LogOut, ShieldCheck, Smartphone } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useChangePassword, useRevokeSession, useSessions, useSettings, useUpdateSettings } from '../hooks/queries';
import { formatWhen } from '../lib/format';
import { errorMessage } from '../lib/types';
import { authService } from '../services';
import { PageTitle, Skeleton, Switch, useToast } from '../components/ui';

export default function SecurityPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const sessions = useSessions();
  const settings = useSettings();
  const updateSettings = useUpdateSettings();
  const change = useChangePassword();
  const revoke = useRevokeSession();
  const revokeAll = useMutation({ mutationFn: authService.logoutAll, onSuccess: async () => (await logout(), navigate('/login', { replace: true })) });

  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const submit = (e: SubmitEvent) => {
    e.preventDefault();
    setError('');
    setOk('');
    if (pw.newPassword !== pw.confirm) return setError('New passwords do not match');
    change.mutate(
      { currentPassword: pw.currentPassword, newPassword: pw.newPassword },
      {
        onSuccess: () => {
          setOk('Password changed. Other devices have been signed out.');
          setPw({ currentPassword: '', newPassword: '', confirm: '' });
          sessions.refetch();
        },
        onError: (err) => setError(errorMessage(err)),
      },
    );
  };

  return (
    <>
      <PageTitle title="Security" subtitle="Keep your account safe: password, 2FA and active sessions." />
      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <section className="card">
            <div className="card-head">
              <h2>
                <KeyRound size={16} style={{ verticalAlign: -2, marginRight: 6 }} />
                {user?.hasPassword ? 'Change password' : 'Set a password'}
              </h2>
            </div>
            {error && <div className="error">{error}</div>}
            {ok && <div className="success">{ok}</div>}
            <form onSubmit={submit}>
              {user?.hasPassword && (
                <div className="field">
                  <label>Current password</label>
                  <input className="input" type="password" required value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
                </div>
              )}
              <div className="field">
                <label>New password</label>
                <input className="input" type="password" required minLength={8} value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
                <span className="help">At least 8 characters with a letter and a number.</span>
              </div>
              <div className="field">
                <label>Confirm new password</label>
                <input className="input" type="password" required value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
              </div>
              <button className="btn btn-primary" disabled={change.isPending}>
                {change.isPending ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </section>

          <section className="card">
            <div className="card-head">
              <h2>
                <ShieldCheck size={16} style={{ verticalAlign: -2, marginRight: 6 }} />
                Two-factor authentication
              </h2>
            </div>
            <div className="toggle">
              <div>
                <b>Require a one-time code on new devices</b>
                <span>Adds an extra layer of protection when signing in.</span>
              </div>
              <Switch
                on={Boolean(settings.data?.twoFactorEnabled)}
                disabled={updateSettings.isPending}
                onChange={(v) => updateSettings.mutate({ twoFactorEnabled: v }, { onSuccess: (s) => toast(s.twoFactorEnabled ? 'Two-factor enabled' : 'Two-factor disabled'), onError: (e) => toast(errorMessage(e), 'error') })}
              />
            </div>
          </section>
        </div>

        <section className="card">
          <div className="card-head">
            <h2>Active sessions</h2>
            <button className="btn btn-outline btn-sm" style={{ color: 'var(--danger)' }} onClick={() => confirm('Sign out of all devices, including this one?') && revokeAll.mutate()}>
              <LogOut size={14} /> Sign out everywhere
            </button>
          </div>
          {sessions.isLoading && <Skeleton lines={4} />}
          <div className="people">
            {sessions.data?.map((s) => (
              <div className="person" key={s.id} style={{ cursor: 'default' }}>
                <div className="avatar">{/mobile|android|iphone/i.test(s.device) ? <Smartphone size={18} /> : <Laptop size={18} />}</div>
                <div>
                  <div className="name">
                    {s.device}
                    {s.isCurrent && (
                      <span className="chip green" style={{ marginLeft: 6 }}>
                        This device
                      </span>
                    )}
                  </div>
                  <div className="meta">
                    {s.ipAddress ?? 'Unknown IP'} · last active {formatWhen(s.lastUsedAt).toLowerCase()}
                  </div>
                </div>
                {!s.isCurrent && (
                  <span className="right">
                    <button className="btn btn-outline btn-sm" disabled={revoke.isPending} onClick={() => revoke.mutate(s.id, { onSuccess: () => toast(`Signed out of ${s.device}`), onError: (e) => toast(errorMessage(e), 'error') })}>
                      Revoke
                    </button>
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
