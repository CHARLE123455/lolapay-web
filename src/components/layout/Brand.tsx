import { Link } from 'react-router-dom';

export function Brand({ dark = false, to = '/' }: { dark?: boolean; to?: string }) {
  return (
    <Link to={to} className="brand">
      <img src={dark ? '/logo-mark-dark.svg' : '/logo-mark.svg'} alt="LolaPay" className="brand-logo" />
      Lola<span className="brand-accent">Pay</span>
    </Link>
  );
}
