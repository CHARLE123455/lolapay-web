import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  ArrowUpRight,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { Brand } from "../layout/Brand";
import { Avatar } from "../ui";

const ADMIN_NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users, end: false },
  {
    to: "/admin/transfers",
    label: "Transfers",
    icon: ArrowLeftRight,
    end: false,
  },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  useTheme();

  if (!user) return null;

  const doLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="admin-side-brand">
          <Brand to="/admin" />
          <span className="admin-tag">Admin</span>
        </div>
        <nav className="admin-nav">
          {ADMIN_NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>
              <n.icon size={18} />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-side-footer">
          <NavLink to="/dashboard" className="admin-back">
            <ArrowUpRight size={16} /> Back to my wallet
          </NavLink>
          <div className="admin-me">
            <Avatar user={user} size="sm" />
            <div>
              <strong>{user.fullName}</strong>
              <small>@{user.tag}</small>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={doLogout}
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
