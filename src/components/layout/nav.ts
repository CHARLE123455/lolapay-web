import { Clock, CreditCard, LayoutDashboard, Send, Settings, Shield, User, Users, type LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const NAV: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/send', label: 'Send', icon: Send },
  { to: '/history', label: 'History', icon: Clock },
  { to: '/beneficiaries', label: 'Beneficiaries', icon: Users },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/card', label: 'Card', icon: CreditCard },
  { to: '/security', label: 'Security', icon: Shield },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export const TOP_NAV = NAV.slice(0, 3).concat(NAV[4]!);
