import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  useTheme();

  if (!user) return null;

  const doLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <Header user={user} onLogout={doLogout} />
      <div className="app-body">
        <Sidebar onLogout={doLogout} />
        <main className="main">{children}</main>
      </div>
    </>
  );
}
