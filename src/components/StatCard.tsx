import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  icon: LucideIcon;
  value: string | null;
  sub?: string;
}

export function StatCard({ label, icon: Icon, value, sub }: Props) {
  return (
    <div className="stat">
      <div className="stat-top">
        {label}
        <span className="stat-icon">
          <Icon size={18} />
        </span>
      </div>
      {value === null ? (
        <div className="skeleton" style={{ height: 30, width: "70%" }} />
      ) : (
        <div className="stat-value">{value}</div>
      )}
      <div className="stat-sub">{sub || "\u00a0"}</div>
    </div>
  );
}
