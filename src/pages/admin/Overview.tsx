import {
  Activity,
  ArrowLeftRight,
  CreditCard,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { useAdminOverview } from "../../hooks/adminQueries";
import { formatMoney } from "../../lib/format";
import { StatCard } from "../../components/StatCard";
import { PageTitle } from "../../components/ui";

export default function AdminOverviewPage() {
  const { data } = useAdminOverview();
  const daily = data?.daily ?? [];
  const max = Math.max(1, ...daily.map((d) => Number(d.volume)));

  return (
    <>
      <PageTitle
        title="Overview"
        subtitle="Live platform health — refreshes every 30s"
      />

      <div className="stats">
        <StatCard
          label="Users"
          icon={Users}
          value={data ? String(data.users.total) : null}
          sub={
            data
              ? `${data.users.active} active · +${data.users.newToday} today`
              : ""
          }
        />
        <StatCard
          label="Transfers"
          icon={ArrowLeftRight}
          value={data ? String(data.transfers.total) : null}
          sub={data ? `${data.transfers.today} today` : ""}
        />
        <StatCard
          label="Volume moved"
          icon={Activity}
          value={data ? formatMoney(data.volume.total) : null}
          sub={data ? `${formatMoney(data.volume.today)} today` : ""}
        />
        <StatCard
          label="Money in wallets"
          icon={Wallet}
          value={data ? formatMoney(data.balances.total) : null}
          sub="Sum of all balances"
        />
        <StatCard
          label="Active cards"
          icon={CreditCard}
          value={data ? String(data.cards.active) : null}
        />
        <StatCard
          label="Failed transfers"
          icon={XCircle}
          value={data ? String(data.transfers.failed) : null}
          sub="All time"
        />
      </div>

      <section className="card">
        <div className="card-head">
          <h2>Daily volume — last 14 days</h2>
        </div>
        {daily.length ? (
          <div className="bars">
            {daily.map((d) => (
              <div
                key={d.date}
                className="bar"
                title={`${d.date}: ${d.count} transfers · ${formatMoney(d.volume)}`}
              >
                <div
                  className="bar-fill"
                  style={{
                    height: `${Math.max(3, (Number(d.volume) / max) * 100)}%`,
                  }}
                />
                <small>{d.date.slice(5)}</small>
              </div>
            ))}
          </div>
        ) : (
          <div className="skeleton" style={{ height: 180 }} />
        )}
      </section>
    </>
  );
}
