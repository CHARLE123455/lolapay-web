import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "right";
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[] | undefined;
  loading: boolean;
  rowKey: (row: T) => string;
  empty?: string;
}

export function DataTable<T>({
  columns,
  rows,
  loading,
  rowKey,
  empty = "Nothing to show",
}: Props<T>) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={c.align === "right" ? { textAlign: "right" } : undefined}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && !rows ? (
            Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={c.key}>
                    <div className="skeleton" style={{ height: 14 }} />
                  </td>
                ))}
              </tr>
            ))
          ) : rows?.length ? (
            rows.map((r) => (
              <tr key={rowKey(r)}>
                {columns.map((c) => (
                  <td
                    key={c.key}
                    style={
                      c.align === "right" ? { textAlign: "right" } : undefined
                    }
                  >
                    {c.render(r)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="empty">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Pager({
  page,
  totalPages,
  total,
  label,
  onPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  label: string;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="pager">
      <span>
        Page {page} of {totalPages} · {total} {label}
      </span>
      <div className="row">
        <button
          className="btn btn-outline btn-sm"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          Previous
        </button>
        <button
          className="btn btn-outline btn-sm"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
