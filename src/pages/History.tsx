import { useState } from "react";
import { Download, Search } from "lucide-react";
import { useAccountSummary, useTransactions } from "../hooks/queries";
import { formatMoney } from "../lib/format";
import type { TransactionType } from "../lib/types";
import { TransactionList } from "../components/TransactionList";
import { PageTitle } from "../components/ui";

type Filter = "all" | TransactionType;
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "CREDIT", label: "Received" },
  { key: "DEBIT", label: "Sent" },
];

export default function HistoryPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const summary = useAccountSummary();
  const tx = useTransactions({
    page,
    limit: 12,
    ...(filter !== "all" ? { type: filter } : {}),
    ...(q ? { q } : {}),
  });
  const cur = summary.data?.currency ?? "NGN";
  const meta = tx.data?.meta;

  const exportCsv = () => {
    const rows = tx.data?.data ?? [];
    const csv = [
      "Date,Type,Description,Counterparty,Amount,Balance after,Reference",
    ]
      .concat(
        rows.map((t) =>
          [
            t.createdAt,
            t.type,
            `"${t.description}"`,
            `"${t.counterparty?.name ?? ""}"`,
            t.signedAmount,
            t.balanceAfter,
            t.reference ?? "",
          ].join(","),
        ),
      )
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `lolapay-transactions-page${page}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <PageTitle
        title="Transaction History"
        subtitle={
          summary.data
            ? `Sent ${formatMoney(summary.data.sentThisMonth, cur)} · Received ${formatMoney(summary.data.receivedThisMonth, cur)} this month`
            : ""
        }
        action={
          <button
            className="btn btn-outline"
            onClick={exportCsv}
            disabled={!tx.data?.data.length}
          >
            <Download size={16} /> Export CSV
          </button>
        }
      />

      <section className="card">
        <div className="card-head" style={{ gap: 16 }}>
          <div className="tabs">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={filter === f.key ? "active" : ""}
                onClick={() => {
                  setFilter(f.key);
                  setPage(1);
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="search" style={{ flex: 1, maxWidth: 360 }}>
            <Search size={16} />
            <input
              className="input"
              placeholder="Search description, name or reference"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <TransactionList items={tx.data?.data} loading={tx.isLoading} />
        {meta && meta.totalPages > 1 && (
          <div className="pager">
            <span>
              Page {meta.page} of {meta.totalPages} · {meta.total} transactions
            </span>
            <div className="row">
              <button
                className="btn btn-outline btn-sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-outline btn-sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
