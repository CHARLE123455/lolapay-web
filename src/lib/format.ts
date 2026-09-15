const ngn = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 });

export const formatMoney = (value: string | number, currency = 'NGN') =>
  currency === 'NGN' ? ngn.format(Number(value)) : `${currency} ${Number(value).toFixed(2)}`;

export const formatSigned = (signedAmount: string) => {
  const n = Number(signedAmount);
  return `${n >= 0 ? '+' : '-'}${ngn.format(Math.abs(n))}`;
};

export const formatWhen = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const time = d.toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' });
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (sameDay(d, now)) return `Today, ${time}`;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDay(d, yesterday)) return `Yesterday, ${time}`;
  return `${d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}, ${time}`;
};

export const initials = (first: string, last: string) => `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();

export const maskAccount = (n: string) => `${n.slice(0, 3)} *** ${n.slice(-4)}`;
