import { useMemo, useState, type SubmitEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Plus, Search, Star, UserPlus } from 'lucide-react';
import { useAccountSummary, useBeneficiaries, useSendMoney, useUserSearch } from '../hooks/queries';
import { formatMoney, formatWhen } from '../lib/format';
import { errorMessage, type Transfer, type UserSummary } from '../lib/types';
import { AddBeneficiaryModal } from '../components/AddBeneficiaryModal';
import { PersonRow } from '../components/PersonRow';
import { Modal, PageTitle, Skeleton } from '../components/ui';

const QUICK = [1000, 5000, 10000, 50000];
const MIN_TRANSFER = 50;

export default function SendPage() {
  const location = useLocation();
  const preset = (location.state as { recipient?: UserSummary } | null)?.recipient ?? null;
  const [recipient, setRecipient] = useState<UserSummary | null>(preset);
  const [q, setQ] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<Transfer | null>(null);
  const [adding, setAdding] = useState(false);

  const summary = useAccountSummary();
  const bens = useBeneficiaries();
  const search = useUserSearch(q);
  const send = useSendMoney();

  const cur = summary.data?.currency ?? 'NGN';
  const balance = Number(summary.data?.totalBalance ?? 0);
  const amt = Number(amount);
  const isBeneficiary = recipient ? bens.data?.some((b) => b.user.id === recipient.id) : false;
  const valid = Boolean(recipient) && amt >= MIN_TRANSFER && amt <= balance;

  const list = useMemo(() => (q.trim() ? null : [...(bens.data ?? [])].sort((a, b) => Number(b.isFavourite) - Number(a.isFavourite))), [bens.data, q]);

  const submit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!recipient) return;
    setError('');
    send.mutate(
      { recipientId: recipient.id, amount: amt, ...(note ? { note } : {}) },
      {
        onSuccess: (t) => {
          setReceipt(t);
          setAmount('');
          setNote('');
        },
        onError: (err) => setError(errorMessage(err)),
      },
    );
  };

  return (
    <>
      <PageTitle title="Send Money" subtitle="Transfer instantly to any LolaPay user." action={<div className="chip">Available: {summary.data ? formatMoney(summary.data.totalBalance, cur) : '…'}</div>} />

      <div className="grid-2" style={{ gridTemplateColumns: '1.1fr 1fr' }}>
        <section className="card">
          <div className="card-head">
            <h2>{q ? 'Search results' : 'Beneficiaries'}</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => setAdding(true)}>
              <Plus size={14} /> Add
            </button>
          </div>
          <div className="search" style={{ marginBottom: 12 }}>
            <Search size={16} />
            <input className="input" placeholder="Search anyone by name, @tag, email or account no." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="people" style={{ maxHeight: 480, overflow: 'auto' }}>
            {bens.isLoading && <Skeleton lines={5} />}
            {list?.length === 0 && <div className="empty">No beneficiaries yet. Search for someone above to send money.</div>}
            {list?.map((b) => (
              <PersonRow
                key={b.id}
                user={b.user}
                name={b.displayName}
                meta={`@${b.user.tag}${b.lastTransfer ? ` · last sent ${formatMoney(b.lastTransfer.amount, cur)} ${formatWhen(b.lastTransfer.at).toLowerCase()}` : ''}`}
                selected={recipient?.id === b.user.id}
                onClick={() => setRecipient(b.user)}
                right={b.isFavourite ? <Star size={15} fill="var(--warning)" color="var(--warning)" /> : undefined}
              />
            ))}
            {q && search.isLoading && <div className="empty">Searching…</div>}
            {q && search.data?.length === 0 && <div className="empty">No users match “{q}”</div>}
            {q && search.data?.map((u) => <PersonRow key={u.id} user={u} name={u.fullName} meta={`@${u.tag}`} selected={recipient?.id === u.id} onClick={() => setRecipient(u)} />)}
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Transfer details</h2>
          </div>
          {!recipient ? (
            <div className="empty">Choose a recipient to get started</div>
          ) : (
            <form onSubmit={submit}>
              <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', marginBottom: 16 }}>
                <PersonRow
                  user={recipient}
                  name={recipient.fullName}
                  meta={`@${recipient.tag}`}
                  right={
                    <>
                      {!isBeneficiary && (
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAdding(true)}>
                          <UserPlus size={14} /> Save
                        </button>
                      )}
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => setRecipient(null)}>
                        Change
                      </button>
                    </>
                  }
                />
              </div>
              {error && <div className="error">{error}</div>}
              <div className="field">
                <label>Amount ({cur})</label>
                <input className="input amount-input" type="number" min={MIN_TRANSFER} step="0.01" required placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <div className="quick-amounts">
                  {QUICK.map((v) => (
                    <button key={v} type="button" className="btn btn-outline btn-sm" onClick={() => setAmount(String(v))}>
                      {formatMoney(v, cur).replace('.00', '')}
                    </button>
                  ))}
                </div>
                {amt > balance && <p className="help" style={{ color: 'var(--danger)' }}>Insufficient balance</p>}
                {amt > 0 && amt < MIN_TRANSFER && <p className="help" style={{ color: 'var(--danger)' }}>Minimum transfer is {formatMoney(MIN_TRANSFER, cur)}</p>}
              </div>
              <div className="field">
                <label>Note (optional)</label>
                <input className="input" value={note} onChange={(e) => setNote(e.target.value)} maxLength={140} placeholder="What's it for?" />
              </div>
              <button className="btn btn-primary btn-lg" disabled={!valid || send.isPending}>
                {send.isPending ? 'Sending…' : `Send ${amt > 0 ? formatMoney(amt, cur) : ''}`}
              </button>
            </form>
          )}
        </section>
      </div>

      {adding && <AddBeneficiaryModal onClose={() => setAdding(false)} onAdded={(u) => setRecipient(u)} />}

      {receipt && (
        <Modal title="Transfer successful" onClose={() => setReceipt(null)}>
          <div className="receipt">
            <CheckCircle2 size={56} color="var(--success)" />
            <div className="big">{formatMoney(receipt.amount, receipt.currency)}</div>
            <p className="muted">sent to {receipt.recipient.fullName}</p>
            <dl>
              <dt>Reference</dt>
              <dd>{receipt.reference}</dd>
              <dt>Recipient</dt>
              <dd>@{receipt.recipient.tag}</dd>
              {receipt.note && (
                <>
                  <dt>Note</dt>
                  <dd>{receipt.note}</dd>
                </>
              )}
              <dt>New balance</dt>
              <dd>{receipt.newBalance ? formatMoney(receipt.newBalance, receipt.currency) : '—'}</dd>
              <dt>Date</dt>
              <dd>{formatWhen(receipt.createdAt)}</dd>
            </dl>
            <div className="row" style={{ justifyContent: 'center' }}>
              <Link to="/history" className="btn btn-outline">
                View history
              </Link>
              <button className="btn btn-primary" onClick={() => setReceipt(null)}>
                Send another
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
