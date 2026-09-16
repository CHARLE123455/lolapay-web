import { Wifi } from "lucide-react";
import type { Card } from "../lib/types";

export function BankCard({
  card,
  reveal = false,
}: {
  card: Card;
  reveal?: boolean;
}) {
  const number = card.maskedNumber.replace(/\*/g, reveal ? "4" : "•");
  return (
    <div
      className={`bank-card ${card.brand.toLowerCase()} ${card.status === "FROZEN" ? "frozen" : ""}`}
    >
      <div className="row between">
        <span style={{ fontWeight: 700 }}>
          LolaPay
          {card.status === "FROZEN" && (
            <span
              className="chip"
              style={{
                marginLeft: 8,
                background: "rgba(255,255,255,.25)",
                color: "#fff",
              }}
            >
              Frozen
            </span>
          )}
        </span>
        <Wifi size={20} style={{ transform: "rotate(90deg)" }} />
      </div>
      <div className="num">{number}</div>
      <div className="row">
        <div>
          Card holder
          <b>{card.holderName}</b>
        </div>
        <div>
          Expires
          <b>{card.expiry}</b>
        </div>
        <div
          style={{
            marginLeft: "auto",
            fontSize: 20,
            fontWeight: 800,
            fontStyle: "italic",
          }}
        >
          {card.brand.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
