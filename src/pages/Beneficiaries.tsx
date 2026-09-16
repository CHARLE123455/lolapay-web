import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Send, Star, Trash2, Users } from "lucide-react";
import {
  useBeneficiaries,
  useBeneficiaryMutations,
  useFollowers,
} from "../hooks/queries";
import { formatMoney, formatWhen } from "../lib/format";
import { errorMessage } from "../lib/types";
import { AddBeneficiaryModal } from "../components/AddBeneficiaryModal";
import { PersonRow } from "../components/PersonRow";
import { PageTitle, Skeleton, useToast } from "../components/ui";

export default function BeneficiariesPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const bens = useBeneficiaries(q);
  const followers = useFollowers();
  const { update, remove } = useBeneficiaryMutations();
  const onError = (e: unknown) => toast(errorMessage(e), "error");

  return (
    <>
      <PageTitle
        title="Beneficiaries"
        subtitle="People you send money to, and people who saved you."
        action={
          <button className="btn btn-primary" onClick={() => setAdding(true)}>
            <Plus size={16} /> Add beneficiary
          </button>
        }
      />

      <div className="grid-2" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <section className="card">
          <div className="card-head">
            <h2>My beneficiaries</h2>
            <span className="chip">{bens.data?.length ?? 0}</span>
          </div>
          <div className="search" style={{ marginBottom: 12 }}>
            <Search size={16} />
            <input
              className="input"
              placeholder="Search by name, nickname or @tag"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="people">
            {bens.isLoading && <Skeleton lines={5} />}
            {bens.data?.length === 0 && (
              <div className="empty">
                {q ? `No match for “${q}”` : "No beneficiaries yet"}
              </div>
            )}
            {bens.data?.map((b) => (
              <PersonRow
                key={b.id}
                user={b.user}
                name={b.displayName}
                meta={`@${b.user.tag}${b.lastTransfer ? ` · last sent ${formatMoney(b.lastTransfer.amount)} ${formatWhen(b.lastTransfer.at).toLowerCase()}` : ""}`}
                right={
                  <>
                    <button
                      className="icon-btn"
                      style={{ width: 30, height: 30, border: 0 }}
                      aria-label="Favourite"
                      onClick={() =>
                        update.mutate(
                          { id: b.id, isFavourite: !b.isFavourite },
                          { onError },
                        )
                      }
                    >
                      <Star
                        size={15}
                        fill={b.isFavourite ? "var(--warning)" : "none"}
                        color={b.isFavourite ? "var(--warning)" : undefined}
                      />
                    </button>
                    <button
                      className="icon-btn"
                      style={{ width: 30, height: 30, border: 0 }}
                      aria-label="Send money"
                      onClick={() =>
                        navigate("/send", { state: { recipient: b.user } })
                      }
                    >
                      <Send size={15} />
                    </button>
                    <button
                      className="icon-btn"
                      style={{
                        width: 30,
                        height: 30,
                        border: 0,
                        color: "var(--danger)",
                      }}
                      aria-label="Remove"
                      onClick={() =>
                        confirm(`Remove ${b.displayName}?`) &&
                        remove.mutate(b.id, {
                          onSuccess: () => toast(`${b.displayName} removed`),
                          onError,
                        })
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </>
                }
              />
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>
              <Users size={16} style={{ verticalAlign: -2, marginRight: 6 }} />
              People who saved you
            </h2>
            <span className="chip">{followers.data?.length ?? 0}</span>
          </div>
          <div className="people">
            {followers.isLoading && <Skeleton lines={3} />}
            {followers.data?.length === 0 && (
              <div className="empty">
                Nobody has added you as a beneficiary yet
              </div>
            )}
            {followers.data?.map((f) => (
              <PersonRow
                key={f.id}
                user={f.user}
                name={f.user.fullName}
                meta={`@${f.user.tag} · since ${formatWhen(f.since)}`}
              />
            ))}
          </div>
        </section>
      </div>

      {adding && <AddBeneficiaryModal onClose={() => setAdding(false)} />}
    </>
  );
}
