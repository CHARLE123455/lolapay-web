import { useState } from "react";
import { Eye, EyeOff, Plus, Snowflake, Star, Sun, Trash2 } from "lucide-react";
import { useCardMutations, useCards } from "../hooks/queries";
import { errorMessage } from "../lib/types";
import { BankCard } from "../components/BankCard";
import { Modal, PageTitle, Skeleton, useToast } from "../components/ui";

const BRANDS = ["Visa", "Mastercard", "Verve"] as const;
type Brand = (typeof BRANDS)[number];

export default function CardPage() {
  const cards = useCards();
  const toast = useToast();
  const { create, setStatus, setDefault, remove } = useCardMutations();
  const [reveal, setReveal] = useState<Record<string, boolean>>({});
  const [creating, setCreating] = useState(false);
  const [brand, setBrand] = useState<Brand>("Visa");
  const onError = (e: unknown) => toast(errorMessage(e), "error");

  const active = cards.data?.filter((c) => c.status !== "CANCELLED") ?? [];

  return (
    <>
      <PageTitle
        title="My Cards"
        subtitle="Virtual cards linked to your LolaPay wallet."
        action={
          <button className="btn btn-primary" onClick={() => setCreating(true)}>
            <Plus size={16} /> New card
          </button>
        }
      />

      {cards.isLoading && (
        <div className="card">
          <Skeleton lines={4} />
        </div>
      )}
      {!cards.isLoading && active.length === 0 && (
        <div className="card empty">
          No cards yet — issue your first virtual card.
        </div>
      )}

      <div className="cards-grid">
        {active.map((c) => (
          <section className="card" key={c.id}>
            <BankCard card={c} reveal={!!reveal[c.id]} />
            <div
              className="row between"
              style={{ marginTop: 16, flexWrap: "wrap" }}
            >
              <div className="row">
                {c.isDefault ? (
                  <span className="chip">Default</span>
                ) : (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setDefault.mutate(c.id, { onError })}
                  >
                    <Star size={14} /> Make default
                  </button>
                )}
                <span
                  className={`chip ${c.status === "ACTIVE" ? "green" : "amber"}`}
                >
                  {c.status}
                </span>
              </div>
              <div className="row" style={{ gap: 6 }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setReveal((r) => ({ ...r, [c.id]: !r[c.id] }))}
                >
                  {reveal[c.id] ? <EyeOff size={14} /> : <Eye size={14} />}{" "}
                  {reveal[c.id] ? "Hide" : "Show"}
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() =>
                    setStatus.mutate(
                      {
                        id: c.id,
                        status: c.status === "ACTIVE" ? "FROZEN" : "ACTIVE",
                      },
                      {
                        onSuccess: () =>
                          toast(
                            c.status === "ACTIVE"
                              ? "Card frozen"
                              : "Card unfrozen",
                          ),
                        onError,
                      },
                    )
                  }
                >
                  {c.status === "ACTIVE" ? (
                    <Snowflake size={14} />
                  ) : (
                    <Sun size={14} />
                  )}{" "}
                  {c.status === "ACTIVE" ? "Freeze" : "Unfreeze"}
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ color: "var(--danger)" }}
                  aria-label="Cancel card"
                  onClick={() =>
                    confirm("Cancel this card permanently?") &&
                    remove.mutate(c.id, {
                      onSuccess: () => toast("Card cancelled"),
                      onError,
                    })
                  }
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>

      {creating && (
        <Modal
          title="Issue a new virtual card"
          onClose={() => setCreating(false)}
        >
          <div className="field">
            <label>Card network</label>
            <div className="tabs">
              {BRANDS.map((b) => (
                <button
                  key={b}
                  type="button"
                  className={brand === b ? "active" : ""}
                  onClick={() => setBrand(b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <p className="help" style={{ marginBottom: 16 }}>
            Your card will be linked to your main wallet balance and can be
            frozen at any time.
          </p>
          <button
            className="btn btn-primary btn-lg"
            disabled={create.isPending}
            onClick={() =>
              create.mutate(
                { brand },
                {
                  onSuccess: () => {
                    setCreating(false);
                    toast("New virtual card issued");
                  },
                  onError,
                },
              )
            }
          >
            {create.isPending ? "Issuing…" : `Issue ${brand} card`}
          </button>
        </Modal>
      )}
    </>
  );
}
