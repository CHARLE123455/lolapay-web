import { useState } from 'react';
import { Search, ShieldCheck, ShieldOff, UserCheck, UserX } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useAdminUsers, useSetUserRole, useSetUserStatus } from '../../hooks/adminQueries';
import { errorMessage } from '../../lib/types';
import type { AdminUser } from '../../lib/types';
import { formatMoney, formatWhen } from '../../lib/format';
import { Avatar, PageTitle, useToast } from '../../components/ui';
import { DataTable, Pager, type Column } from '../../components/admin/DataTable';

type Status = 'all' | 'active' | 'inactive';
const TABS: { key: Status; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'inactive', label: 'Deactivated' },
];

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const toast = useToast();
  const [status, setStatus] = useState<Status>('all');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const users = useAdminUsers({ page, limit: 15, ...(status !== 'all' ? { status } : {}), ...(q ? { q } : {}) });
  const setUserStatus = useSetUserStatus();
  const setUserRole = useSetUserRole();

  const toggleStatus = (u: AdminUser) => {
    if (!window.confirm(`${u.isActive ? 'Deactivate' : 'Reactivate'} ${u.fullName}?${u.isActive ? ' They will be logged out everywhere.' : ''}`)) return;
    setUserStatus.mutate(
      { id: u.id, isActive: !u.isActive },
      { onSuccess: () => toast(`${u.fullName} ${u.isActive ? 'deactivated' : 'reactivated'}`), onError: (e) => toast(errorMessage(e), 'error') },
    );
  };

  const toggleRole = (u: AdminUser) => {
    const role = u.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!window.confirm(`${role === 'ADMIN' ? 'Grant' : 'Remove'} admin access for ${u.fullName}?`)) return;
    setUserRole.mutate({ id: u.id, role }, { onSuccess: () => toast('Role updated'), onError: (e) => toast(errorMessage(e), 'error') });
  };

  const columns: Column<AdminUser>[] = [
    {
      key: 'user',
      header: 'User',
      render: (u) => (
        <div className="cell-user">
          <Avatar user={u} size="sm" />
          <div>
            <strong>{u.fullName}</strong>
            <small>@{u.tag} · {u.email}</small>
          </div>
        </div>
      ),
    },
    { key: 'acct', header: 'Account', render: (u) => <span className="mono">{u.accountNumber ?? '—'}</span> },
    { key: 'bal', header: 'Balance', align: 'right', render: (u) => formatMoney(u.balance) },
    { key: 'tx', header: 'Sent / Recv', align: 'right', render: (u) => `${u.transfersSent} / ${u.transfersReceived}` },
    {
      key: 'role',
      header: 'Role',
      render: (u) => <span className={`pill ${u.role === 'ADMIN' ? 'pill-primary' : ''}`}>{u.role}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (u) => <span className={`pill ${u.isActive ? 'pill-success' : 'pill-danger'}`}>{u.isActive ? 'Active' : 'Deactivated'}</span>,
    },
    { key: 'joined', header: 'Joined', render: (u) => formatWhen(u.createdAt) },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (u) =>
        u.id === me?.id ? (
          <small className="muted">You</small>
        ) : (
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm" title={u.role === 'ADMIN' ? 'Remove admin' : 'Make admin'} onClick={() => toggleRole(u)} disabled={setUserRole.isPending}>
              {u.role === 'ADMIN' ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
            </button>
            <button
              className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-outline'}`}
              title={u.isActive ? 'Deactivate' : 'Reactivate'}
              onClick={() => toggleStatus(u)}
              disabled={setUserStatus.isPending}
            >
              {u.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
            </button>
          </div>
        ),
    },
  ];

  const meta = users.data?.meta;

  return (
    <>
      <PageTitle title="Users" subtitle={meta ? `${meta.total} accounts` : ''} />
      <section className="card">
        <div className="card-head" style={{ gap: 16 }}>
          <div className="tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={status === t.key ? 'active' : ''}
                onClick={() => {
                  setStatus(t.key);
                  setPage(1);
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="search" style={{ flex: 1, maxWidth: 380 }}>
            <Search size={16} />
            <input
              className="input"
              placeholder="Search name, @tag, email or account number"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <DataTable columns={columns} rows={users.data?.data} loading={users.isLoading} rowKey={(u) => u.id} empty="No users match" />
        {meta && <Pager page={meta.page} totalPages={meta.totalPages} total={meta.total} label="users" onPage={setPage} />}
      </section>
    </>
  );
}
