import { useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { useBeneficiaryMutations, useUserSearch } from "../hooks/queries";
import { errorMessage, type UserSummary } from "../lib/types";
import { Modal, useToast } from "./ui";
import { PersonRow } from "./PersonRow";

export function AddBeneficiaryModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded?: (u: UserSummary) => void;
}) {
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<UserSummary | null>(null);
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const search = useUserSearch(q);
  const { add } = useBeneficiaryMutations();
  const toast = useToast();

  const save = (u: UserSummary) =>
    add.mutate(
      { userId: u.id, ...(nickname ? { nickname } : {}) },
      {
        onSuccess: () => {
          toast(`${u.fullName} added to beneficiaries`);
          onAdded?.(u);
          onClose();
        },
        onError: (e) => setError(errorMessage(e)),
      },
    );

  return (
    <Modal title="Add beneficiary" onClose={onClose}>
      {error && <div className="error">{error}</div>}
      {!picked ? (
        <>
          <div className="search" style={{ marginBottom: 12 }}>
            <Search size={16} />
            <input
              className="input"
              autoFocus
              placeholder="Search by name, @tag, email or account number"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="people" style={{ maxHeight: 320, overflow: "auto" }}>
            {!q && <div className="empty">Type to find LolaPay users</div>}
            {q && search.isLoading && <div className="empty">Searching…</div>}
            {q && search.data?.length === 0 && (
              <div className="empty">No users match “{q}”</div>
            )}
            {search.data?.map((u) => (
              <PersonRow
                key={u.id}
                user={u}
                name={u.fullName}
                meta={`@${u.tag}`}
                onClick={() => setPicked(u)}
                right={<UserPlus size={16} className="muted" />}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <PersonRow
            user={picked}
            name={picked.fullName}
            meta={`@${picked.tag}`}
            right={
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setPicked(null)}
              >
                Change
              </button>
            }
          />
          <div className="field" style={{ marginTop: 14 }}>
            <label>Nickname (optional)</label>
            <input
              className="input"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Mum, Landlord"
              maxLength={50}
            />
          </div>
          <button
            className="btn btn-primary btn-lg"
            disabled={add.isPending}
            onClick={() => save(picked)}
          >
            {add.isPending ? "Adding…" : "Save beneficiary"}
          </button>
        </>
      )}
    </Modal>
  );
}
