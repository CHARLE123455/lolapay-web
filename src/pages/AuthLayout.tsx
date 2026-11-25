import type { ReactNode } from "react";
import { Wallet } from "lucide-react";
import { Brand } from "../components/layout/Brand";

function Hero() {
  return (
    <aside className="auth-hero">
      <Brand dark />
      <div>
        <h1>
          Send money to the
          <br />
          people you love.
        </h1>
        <p>
          Instant Naira transfers, virtual cards, beneficiaries and a full
          transaction history — all in one wallet.
        </p>
      </div>
      <div className="mock-card">
        <div className="row between">
          <span>LolaPay</span>
          <Wallet size={22} />
        </div>
        <div style={{ fontSize: 22, letterSpacing: 3 }}>
          •••• •••• •••• 4576
        </div>
        <div className="row between" style={{ fontSize: 12 }}>
          <span>Lola Omotayo</span>
          <span>VISA</span>
        </div>
      </div>
    </aside>
  );
}

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="auth-page">
      <Hero />
      <section className="auth-form">
        <div>
          <h2>{title}</h2>
          <p className="sub">{subtitle}</p>
          {children}
        </div>
      </section>
    </div>
  );
}
