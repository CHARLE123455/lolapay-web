import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { Transaction } from '../lib/types';
import { formatSigned, formatWhen } from '../lib/format';
import { Skeleton } from './ui/Skeleton';

export function TransactionList({ items, loading }: { items: Transaction[] | undefined; loading?: boolean }) {
  if (loading && !items) return <Skeleton lines={5} />;
  if (!items?.length) return <div className="empty">No transactions yet</div>;
  return (
    <div className="tx-list">
      {items.map((t) => {
        const credit = t.type === 'CREDIT';
        const who = t.counterparty?.name;
        return (
          <div className="tx-row" key={t.id}>
            <div className="avatar" style={{ background: credit ? 'rgba(23,178,106,.12)' : 'rgba(229,72,77,.1)', color: credit ? 'var(--success)' : 'var(--danger)' }}>
              {credit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
            </div>
            <div>
              <div className="tx-title">{who ? `${credit ? 'From' : 'To'} ${who}` : t.description}</div>
              <div className="tx-sub">{who ? (credit ? 'Payment received' : 'Money sent') : t.reference ?? ''}</div>
            </div>
            <div className="tx-when">{formatWhen(t.createdAt)}</div>
            <div className={`tx-amount ${credit ? 'credit' : 'debit'}`}>{formatSigned(t.signedAmount)}</div>
          </div>
        );
      })}
    </div>
  );
}
