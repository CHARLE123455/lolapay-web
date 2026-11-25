import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useClickOutside } from "../../hooks/useClickOutside";
import type { User } from "../../lib/types";
import { Avatar } from "../ui";
import { Brand } from "./Brand";
import { NotificationsMenu } from "./NotificationsMenu";
import { TOP_NAV } from "./nav";

export function Header({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  const [menu, setMenu] = useState(false);
  const menuRef = useClickOutside<HTMLDivElement>(() => setMenu(false));

  return (
    <header className="app-header">
      <Brand to="/dashboard" />
      <nav className="top-nav">
        {TOP_NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === "/"}>
            {n.label}
          </NavLink>
        ))}
      </nav>
      <NotificationsMenu />
      <div className="header-user" ref={menuRef}>
        <button
          onClick={() => setMenu((m) => !m)}
          aria-haspopup="menu"
          aria-expanded={menu}
        >
          <Avatar user={user} />
          <span style={{ color: "var(--text)", fontWeight: 600 }}>
            {user.firstName}
          </span>
          <ChevronDown size={16} />
        </button>
        {menu && (
          <div className="dropdown" style={{ minWidth: 220 }} role="menu">
            <div
              style={{
                padding: "8px 12px 12px",
                borderBottom: "1px solid var(--line)",
                marginBottom: 6,
              }}
            >
              <b>{user.fullName}</b>
              <p className="muted" style={{ fontSize: 12 }}>
                @{user.tag}
              </p>
            </div>
            <NavLink
              to="/profile"
              className="item"
              onClick={() => setMenu(false)}
            >
              <UserIcon size={16} /> Profile
            </NavLink>
            <NavLink
              to="/security"
              className="item"
              onClick={() => setMenu(false)}
            >
              <Shield size={16} /> Security
            </NavLink>
            {user.role === "ADMIN" && (
              <NavLink
                to="/admin"
                className="item"
                onClick={() => setMenu(false)}
              >
                <LayoutDashboard size={16} /> Admin console
              </NavLink>
            )}
            <button
              className="item"
              style={{
                width: "100%",
                border: 0,
                background: "none",
                color: "var(--danger)",
                cursor: "pointer",
              }}
              onClick={onLogout}
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
