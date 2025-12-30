import { useState } from "react";
import BuyerDashboard from "./BuyerDashboard";
import SellerDashboard from "./SellerDashboard";

export default function Marketplace({ user }) {
  const [mode, setMode] = useState("buyer");

  return (
    <main
      style={{
        maxWidth: "860px",
        margin: "0 auto",
        padding: "5rem 2rem 6rem",
      }}
    >
      {/* HEADER */}
      <section className="reveal">
        <h1 style={{ fontSize: "2.6rem" }}>Quad</h1>

        <div
          style={{
            marginTop: "0.4rem",
            color: "var(--text-muted)",
            fontSize: "0.9rem",
          }}
        >
          Logged in as {user.displayName}
        </div>

        {/* MODE SWITCH */}
        <div style={{ marginTop: "1.8rem", display: "flex", gap: "1.6rem" }}>
          <button
            className="linkish"
            style={{
              color: mode === "buyer" ? "var(--accent)" : "var(--text-muted)",
              fontSize: "0.95rem",
            }}
            onClick={() => setMode("buyer")}
          >
            Buyer
          </button>

          <button
            className="linkish"
            style={{
              color: mode === "seller" ? "var(--accent)" : "var(--text-muted)",
              fontSize: "0.95rem",
            }}
            onClick={() => setMode("seller")}
          >
            Seller
          </button>
        </div>
      </section>

      {/* DIVIDER */}
      <div
        className="reveal delay-1"
        style={{
          margin: "3.5rem 0",
          height: "1px",
          background: "var(--border-soft)",
        }}
      />

      {/* CONTENT */}
      <section className="reveal delay-2">
        {mode === "buyer" ? (
          <BuyerDashboard user={user} />
        ) : (
          <SellerDashboard user={user} />
        )}
      </section>
    </main>
  );
}
