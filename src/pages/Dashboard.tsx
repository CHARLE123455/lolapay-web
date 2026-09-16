import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowDownLeft, ArrowUpRight, ChevronRight, CreditCard, Plus, Search, Send, Users, Wallet } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useAccountSummary, useBeneficiaries, useTransactions } from '../hooks/queries';
import { formatMoney } from '../lib/format';
import { StatCard } from '../components/StatCard';
import { TransactionList } from '../components/TransactionList';
import { PersonRow } from '../components/PersonRow';
import { AddBeneficiaryModal } from '../components/AddBeneficiaryModal';
import { PageTitle, Skeleton } from '../components/ui';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const summary = useAccountSummary();
  const tx = useTransactions({ limit: 6 });
  const [q, setQ] = useState('');
  const bens = useBeneficiaries(q);
  const [adding, setAdding] = useState(false);
  const s = summary.data;
  const cur = s?.currency ?? 'NGN';

  return (
    <>
      <PageTitle
        title={`Welcome back, ${user?.firstName ?? ''}`}
        subtitle="Here's what's happening with your money today."
        action={
          <Link to="/send" className="btn btn-primary">
            <Send size={16} /> Send money
          </Link>
        }
      />

      <div className="stats">
        <StatCard label="Total Balance" icon={Wallet} value={s ? formatMoney(s.totalBalance, cur) : null} sub={s ? `Account ${s.accountNumber}` : ''} />
        <StatCard label="Sent this month" icon={ArrowUpRight} value={s ? formatMoney(s.sentThisMonth, cur) : null} sub={s ? `${s.sentCount} transfer${s.sentCount === 1 ? '' : 's'}` : ''} />
        <StatCard label="Received" icon={ArrowDownLeft} value={s ? formatMoney(s.receivedThisMonth, cur) : null} sub={s ? `${s.receivedCount} this month` : ''} />
        <StatCard
          label="Active card"
          icon={CreditCard}
          value={s ? String(s.activeCards) : null}
          sub={s?.primaryCard ? `${s.primaryCard.brand} ***** ${s.primaryCard.last4}` : s ? 'No card yet' : ''}
        />
      </div>

      <div className="dash-grid">
        <section className="card">
          <div className="card-head">
            <h2>Transaction History</h2>
            <div className="row">
              <Link to="/history" className="btn btn-ghost btn-sm">
                View all <ChevronRight size={14} />
              </Link>
              <Link to="/send" className="btn btn-primary btn-sm">
                <Send size={14} /> Send money
              </Link>
            </div>
          </div>
          <TransactionList items={tx.data?.data} loading={tx.isLoading} />
        </section>

        <aside className="card">
          <div className="card-head">
            <h2>Beneficiary</h2>
            <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => setAdding(true)} aria-label="Add beneficiary">
              <Plus size={15} />
            </button>
          </div>
          <div className="search" style={{ marginBottom: 12 }}>
            <Search size={16} />
            <input className="input" placeholder="Search Beneficiary" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="people">
            {bens.isLoading && <Skeleton lines={5} />}
            {bens.data?.length === 0 && <div className="empty">{q ? `No match for “${q}”` : 'No beneficiaries yet'}</div>}
            {bens.data?.slice(0, 6).map((b) => (
              <PersonRow key={b.id} user={b.user} name={b.displayName} meta={`@${b.user.tag}`} onClick={() => navigate('/send', { state: { recipient: b.user } })} right={<ArrowUpRight size={16} className="muted" />} />
            ))}
          </div>
          <Link to="/beneficiaries" className="btn btn-ghost" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}>
            <Users size={15} /> View all Beneficiary
          </Link>
        </aside>
      </div>

      {adding && <AddBeneficiaryModal onClose={() => setAdding(false)} />}
    </>
  );
}
