"use client";

// ─────────────────────────────────────────────────────────────
// Slotrez — Login page
// Save to: src/app/login/page.tsx
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 12px", border: "0.5px solid #d1d5db",
    borderRadius: 8, fontSize: 13, fontFamily: "inherit",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,-apple-system,sans-serif", padding: "1.5rem" }}>
      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "2rem", width: "100%", maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <Link href="/" style={{ fontSize: 24, fontWeight: 700, textDecoration: "none", letterSpacing: "-.5px" }}>
            <span style={{ color: "#1a1a2e" }}>slot</span>
            <span style={{ color: "#2563eb" }}>rez</span>
          </Link>
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#111827" }}>Welcome back</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.5rem" }}>Sign in to your Slotrez account</p>

        <div style={{ marginBottom: ".85rem" }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
        </div>

        <div style={{ marginBottom: ".75rem" }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
        </div>

        <div style={{ textAlign: "right", marginBottom: "1.25rem" }}>
          <span style={{ fontSize: 12, color: "#2563eb", cursor: "pointer" }}>Forgot password?</span>
        </div>

        {/* 2FA notice */}
        <div style={{ background: "#eff6ff", border: "0.5px solid #93c5fd", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#1d4ed8", marginBottom: "1.25rem", lineHeight: 1.6 }}>
          🔐 After signing in, we&apos;ll send a code to your phone for security.
        </div>

        <button
          style={{ width: "100%", background: "#2563eb", color: "#fff", border: "none", padding: "11px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}
          onClick={() => alert("Backend coming in Phase 1 — auth system!")}
        >
          Continue →
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: 13, color: "#6b7280" }}>
          No account?{" "}
          <Link href="/register" style={{ color: "#2563eb" }}>Sign up free</Link>
        </p>

      </div>
    </div>
  );
}
