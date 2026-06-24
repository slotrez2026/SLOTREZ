"use client";

// ─────────────────────────────────────────────────────────────
// Slotrez — Reset password page
// User lands here after clicking the email link
// Save to: src/app/reset-password/page.tsx
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [validSession, setValidSession] = useState(false);
  const [checking, setChecking] = useState(true);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px",
    border: "0.5px solid #d1d5db", borderRadius: 8,
    fontSize: 13, fontFamily: "inherit",
    outline: "none", boxSizing: "border-box",
    background: "#fff", color: "#111827",
  };

  // Check we have a valid reset session from the email link
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setValidSession(!!session);
      setChecking(false);
    }
    checkSession();
  }, []);

  // Password strength
  const strength = password.length === 0 ? null
    : password.length < 8 ? "weak"
    : password.length < 12 ? "good"
    : "strong";

  const strengthColor = strength === "weak" ? "#ef4444"
    : strength === "good" ? "#f59e0b"
    : "#3b6d11";

  const strengthLabel = strength === "weak" ? "Too short — min 8 characters"
    : strength === "good" ? "Good password"
    : "Strong password ✓";

  async function handleReset() {
    if (!password) { setError("Please enter a new password."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }

    setLoading(true);
    setError("");

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("Failed to update password. Please try again or request a new reset link.");
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);

    // Auto redirect after 3 seconds
    setTimeout(() => router.push("/dashboard"), 3000);
  }

  // Loading check
  if (checking) {
    return (
      <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,-apple-system,sans-serif" }}>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Verifying reset link...</p>
      </div>
    );
  }

  // Invalid / expired link
  if (!validSession) {
    return (
      <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "system-ui,-apple-system,sans-serif" }}>
        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "2rem", width: "100%", maxWidth: 400, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: "1rem" }}>⚠️</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#111827" }}>Reset link expired</h2>
          <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            This password reset link has expired or already been used. Reset links are valid for 1 hour.
          </p>
          <Link href="/forgot-password"
            style={{ display: "block", background: "#2563eb", color: "#fff", padding: "11px", borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: "none", marginBottom: 10 }}>
            Request a new reset link
          </Link>
          <Link href="/login" style={{ display: "block", fontSize: 13, color: "#6b7280", textDecoration: "none" }}>
            ← Back to login
          </Link>
        </div>
      </div>
    );
  }

  // Success screen
  if (done) {
    return (
      <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "system-ui,-apple-system,sans-serif" }}>
        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "2rem", width: "100%", maxWidth: 400, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#eaf3de", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: 26 }}>✓</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#111827" }}>Password updated!</h2>
          <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            Your password has been reset successfully. Redirecting you to your dashboard...
          </p>
          <Link href="/dashboard"
            style={{ display: "block", background: "#2563eb", color: "#fff", padding: "11px", borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
            Go to dashboard →
          </Link>
        </div>
      </div>
    );
  }

  // Reset form
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "2rem", width: "100%", maxWidth: 400 }}>

        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <Link href="/" style={{ fontSize: 24, fontWeight: 700, textDecoration: "none", letterSpacing: "-.5px" }}>
            <span style={{ color: "#1a1a2e" }}>slot</span><span style={{ color: "#2563eb" }}>rez</span>
          </Link>
        </div>

        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 24 }}>🔐</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: "#111827" }}>Set a new password</h1>
          <p style={{ fontSize: 13, color: "#6b7280" }}>Must be at least 8 characters.</p>
        </div>

        {/* New password */}
        <div style={{ marginBottom: ".85rem" }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>New password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Min. 8 characters"
              style={{ ...inputStyle, paddingRight: 40 }}
              autoFocus
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex", alignItems: "center" }}>
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {strength && (
            <p style={{ fontSize: 11, color: strengthColor, marginTop: 4 }}>{strengthLabel}</p>
          )}
        </div>

        {/* Confirm password */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Confirm new password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
              placeholder="Re-enter your password"
              style={{ ...inputStyle, paddingRight: 40, borderColor: confirmPassword && confirmPassword !== password ? "#ef4444" : "#d1d5db" }}
              onKeyDown={(e) => e.key === "Enter" && handleReset()}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex", alignItems: "center" }}>
              <EyeIcon open={showConfirm} />
            </button>
          </div>
          {confirmPassword && confirmPassword !== password && (
            <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>Passwords don&apos;t match</p>
          )}
          {confirmPassword && confirmPassword === password && password.length >= 8 && (
            <p style={{ fontSize: 11, color: "#3b6d11", marginTop: 4 }}>✓ Passwords match</p>
          )}
        </div>

        {error && (
          <div style={{ background: "#fcebeb", border: "0.5px solid #fca5a5", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#a32d2d", marginBottom: "1rem" }}>
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleReset}
          disabled={loading || password.length < 8 || password !== confirmPassword}
          style={{ width: "100%", background: loading || password.length < 8 || password !== confirmPassword ? "#93c5fd" : "#2563eb", color: "#fff", border: "none", padding: "11px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: loading || password.length < 8 || password !== confirmPassword ? "default" : "pointer", fontFamily: "inherit" }}
        >
          {loading ? "Updating password..." : "Update password →"}
        </button>
      </div>
    </div>
  );
}
