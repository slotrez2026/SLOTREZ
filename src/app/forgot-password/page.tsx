"use client";

// ─────────────────────────────────────────────────────────────
// Slotrez — Forgot password page
// Save to: src/app/forgot-password/page.tsx
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px",
    border: "0.5px solid #d1d5db", borderRadius: 8,
    fontSize: 13, fontFamily: "inherit",
    outline: "none", boxSizing: "border-box",
    background: "#fff", color: "#111827",
  };

  async function handleReset() {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    if (resetError) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    // Always show success even if email doesn't exist
    // This prevents email enumeration attacks
    setSent(true);
    setLoading(false);
  }

  // ── Success screen ──
  if (sent) {
    return (
      <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "system-ui,-apple-system,sans-serif" }}>
        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "2rem", width: "100%", maxWidth: 400, textAlign: "center" }}>
          <Link href="/" style={{ fontSize: 24, fontWeight: 700, textDecoration: "none", letterSpacing: "-.5px", display: "inline-block", marginBottom: "1.5rem" }}>
            <span style={{ color: "#1a1a2e" }}>slot</span><span style={{ color: "#2563eb" }}>rez</span>
          </Link>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#eaf3de", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: 26 }}>📧</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#111827" }}>Check your email</h2>
          <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            If <strong>{email}</strong> is registered with Slotrez, you&apos;ll receive a password reset link within a few minutes.
          </p>
          <div style={{ background: "#eff6ff", border: "0.5px solid #93c5fd", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#1d4ed8", marginBottom: "1.5rem", lineHeight: 1.6, textAlign: "left" }}>
            💡 Check your spam folder if you don&apos;t see it. The link expires in 1 hour.
          </div>
          <button
            onClick={() => { setSent(false); setEmail(""); }}
            style={{ width: "100%", background: "none", border: "0.5px solid #d1d5db", padding: "10px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: "#374151", marginBottom: 10 }}
          >
            Try a different email
          </button>
          <Link href="/login" style={{ display: "block", textAlign: "center", fontSize: 13, color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>
            ← Back to login
          </Link>
        </div>
      </div>
    );
  }

  // ── Request screen ──
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "2rem", width: "100%", maxWidth: 400 }}>

        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <Link href="/" style={{ fontSize: 24, fontWeight: 700, textDecoration: "none", letterSpacing: "-.5px" }}>
            <span style={{ color: "#1a1a2e" }}>slot</span><span style={{ color: "#2563eb" }}>rez</span>
          </Link>
        </div>

        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 24 }}>🔑</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: "#111827" }}>Forgot your password?</h1>
          <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>No worries. Enter your email and we&apos;ll send you a reset link.</p>
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="you@example.com"
            style={inputStyle}
            onKeyDown={(e) => e.key === "Enter" && handleReset()}
            autoFocus
          />
        </div>

        {error && (
          <div style={{ background: "#fcebeb", border: "0.5px solid #fca5a5", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#a32d2d", marginBottom: "1rem" }}>
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleReset}
          disabled={loading || !email}
          style={{ width: "100%", background: loading || !email ? "#93c5fd" : "#2563eb", color: "#fff", border: "none", padding: "11px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: loading || !email ? "default" : "pointer", fontFamily: "inherit", marginBottom: "1rem" }}
        >
          {loading ? "Sending reset link..." : "Send reset link →"}
        </button>

        <Link href="/login" style={{ display: "block", textAlign: "center", fontSize: 13, color: "#6b7280", textDecoration: "none" }}>
          ← Back to login
        </Link>
      </div>
    </div>
  );
}
