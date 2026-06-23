"use client";

// ─────────────────────────────────────────────────────────────
// Slotrez — Register page
// Save to: src/app/register/page.tsx
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [role, setRole] = useState<"client" | "biz">("client");

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 12px", border: "0.5px solid #d1d5db",
    borderRadius: 8, fontSize: 13, fontFamily: "inherit",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,-apple-system,sans-serif", padding: "1.5rem" }}>
      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "2rem", width: "100%", maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <Link href="/" style={{ fontSize: 24, fontWeight: 700, textDecoration: "none", letterSpacing: "-.5px" }}>
            <span style={{ color: "#1a1a2e" }}>slot</span>
            <span style={{ color: "#2563eb" }}>rez</span>
          </Link>
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#111827" }}>Create your account</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.25rem" }}>Join Slotrez as a client or a business</p>

        {/* Role toggle */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "1.25rem" }}>
          {(["client","biz"] as const).map((r) => (
            <div key={r} onClick={() => setRole(r)}
              style={{ padding: 12, border: `${role === r ? "2px" : "0.5px"} solid ${role === r ? "#2563eb" : "#d1d5db"}`, borderRadius: 9, cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{r === "client" ? "👤" : "🏪"}</div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{r === "client" ? "Client" : "Business"}</p>
              <p style={{ fontSize: 11, color: "#9ca3af" }}>{r === "client" ? "Book services" : "Accept bookings"}</p>
            </div>
          ))}
        </div>

        {/* Name fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: ".85rem" }}>
          <div>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>First name</label>
            <input placeholder="Alex" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Last name</label>
            <input placeholder="Rivera" style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom: ".85rem" }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Email</label>
          <input type="email" placeholder="you@example.com" style={inputStyle} />
        </div>

        <div style={{ marginBottom: ".85rem" }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Password</label>
          <input type="password" placeholder="Min. 8 characters" style={inputStyle} />
        </div>

        {role === "biz" && (
          <div style={{ marginBottom: ".85rem" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Business name</label>
            <input placeholder="Your shop or studio name" style={inputStyle} />
          </div>
        )}

        <button
          style={{ width: "100%", background: "#2563eb", color: "#fff", border: "none", padding: "11px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", marginTop: ".5rem" }}
          onClick={() => alert("Backend coming in Phase 1 — auth system!")}
        >
          Create account →
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: 13, color: "#6b7280" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#2563eb" }}>Log in</Link>
        </p>

      </div>
    </div>
  );
}
