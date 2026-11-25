import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { useAdminTransfers } from "../../hooks/adminQueries";
import type { AdminTransfer, TransferStatus } from "../../lib/types";
import { formatMoney, formatWhen } from "../../lib/format";
import { Avatar, PageTitle } from "../../components/ui";
import {
  DataTable,
  Pager,
  type Column,
} from "../../components/admin/DataTable";

type Status = "all" | TransferStatus;
const TABS: { key: Status; label: string }[] = [
  { key: "all", label: "All" },
  { key: "COMPLETED", label: "Completed" },
  { key: "PENDING", label: "Pending" },
  { key: "FAILED", label: "Failed" },
];

const STATUS_PILL: Record<TransferStatus, string> = {
  COMPLETED: "pill-success",
  PENDING: "pill-warning",
  FAILED: "pill-danger",
};

function Party({ u }: { u: AdminTransfer["sender"] }) {
  return (
    <div className="cell-user">
      <Avatar user={u} size="sm" />
      <div>
        <strong>{u.fullName}</strong>
        <small>@{u.tag}</small>
      </div>
    </div>
  );
}

export default function AdminTransfersPage() {
  const [status, setStatus] = useState<Status>("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const transfers = useAdminTransfers({
    page,
    limit: 15,
    ...(status !== "all" ? { status } : {}),
    ...(q ? { q } : {}),
  });
  const meta = transfers.data?.meta;

  const columns: Column<AdminTransfer>[] = [
    {
      key: "ref",
      header: "Reference",
      render: (t) => <span className="mono">{t.reference}</span>,
    },
    { key: "from", header: "From", render: (t) => <Party u={t.sender} /> },
    {
      key: "arrow",
      header: "",
      render: () => <ArrowRight size={14} className="muted" />,
    },
    { key: "to", header: "To", render: (t) => <Party u={t.recipient} /> },
    {
      key: "amt",
      header: "Amount",
      align: "right",
      render: (t) => <strong>{formatMoney(t.amount, t.currency)}</strong>,
    },
    {
      key: "note",
      header: "Note",
      render: (t) => <span className="muted">{t.note ?? "—"}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (t) => (
        <span
          className={`pill ${STATUS_PILL[t.status]}`}
          title={t.failReason ?? undefined}
        >
          {t.status}
        </span>
      ),
    },
    { key: "when", header: "When", render: (t) => formatWhen(t.createdAt) },
  ];

  return (
    <>
      <PageTitle
        title="Transfers"
        subtitle={meta ? `${meta.total} transfers` : ""}
      />
      <section className="card">
        <div className="card-head" style={{ gap: 16 }}>
          <div className="tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={status === t.key ? "active" : ""}
                onClick={() => {
                  setStatus(t.key);
                  setPage(1);
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="search" style={{ flex: 1, maxWidth: 380 }}>
            <Search size={16} />
            <input
              className="input"
              placeholder="Search reference, note, @tag or email"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={transfers.data?.data}
          loading={transfers.isLoading}
          rowKey={(t) => t.id}
          empty="No transfers match"
        />
        {meta && (
          <Pager
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            label="transfers"
            onPage={setPage}
          />
        )}
      </section>
    </>
  );
}
