import type { ReactNode } from "react";
import type { UserSummary } from "../lib/types";
import { Avatar } from "./ui/Avatar";

interface Props {
  user: Pick<UserSummary, "firstName" | "lastName" | "avatarUrl">;
  name: string;
  meta?: string;
  selected?: boolean;
  onClick?: () => void;
  right?: ReactNode;
}

export function PersonRow({
  user,
  name,
  meta,
  selected,
  onClick,
  right,
}: Props) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      className="person"
      type={onClick ? "button" : undefined}
      onClick={onClick}
      style={{
        outline: selected ? "2px solid var(--primary)" : undefined,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <Avatar user={user} />
      <div style={{ minWidth: 0 }}>
        <div className="name">{name}</div>
        {meta && <div className="meta">{meta}</div>}
      </div>
      {right && (
        <span className="right" onClick={(e) => e.stopPropagation()}>
          {right}
        </span>
      )}
    </Tag>
  );
}
