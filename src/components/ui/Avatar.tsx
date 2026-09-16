import type { UserSummary } from "../../lib/types";
import { initials } from "../../lib/format";

type Props = {
  user: Pick<UserSummary, "firstName" | "lastName" | "avatarUrl">;
  size?: "sm" | "lg";
};

export function Avatar({ user, size }: Props) {
  return (
    <div className={`avatar ${size ?? ""}`}>
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt="" />
      ) : (
        initials(user.firstName, user.lastName)
      )}
    </div>
  );
}
