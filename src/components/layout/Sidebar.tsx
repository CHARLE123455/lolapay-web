import { NavLink } from 'react-router-dom';
import { ChevronRight, LogOut } from 'lucide-react';
import { NAV } from './nav';

export function Sidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="sidebar">
      <nav className="side-nav">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'}>
            <n.icon size={18} />
            {n.label}
            <ChevronRight size={16} className="chev" style={{ marginLeft: 'auto', opacity: 0.6 }} />
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button onClick={onLogout}>
          <LogOut size={18} /> Log out
        </button>
      </div>
    </aside>
  );
}
