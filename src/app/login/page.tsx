"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Step = "credentials" | "2fa";

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

// Strip spaces from any input value
function noSpaces(val: string) { return val.replace(/\s/g, ""); }

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [notRegistered, setNotRegistered] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const baseInput: React.CSSProperties = {
    width: "100%", padding: "9px 12px",
    border: "0.5px solid #d1d5db", borderRadius: 8,
    fontSize: 13, fontFamily: "inherit",
    outline: "none", boxSizing: "border-box" as const,
    background: "#fff", color: "#111827",
  };

  // Shared handlers for no-space fields
  function blockSpace(e: React.KeyboardEvent) { if (e.key === " ") e.preventDefault(); }
  function pasteNoSpaces(setter: (v: string) => void) {
    return (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = noSpaces(e.clipboardData.getData("text"));
      setter(pasted);
    };
  }

  async function handleLogin() {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true); setError(""); setNotRegistered(false);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (signInError) {
      if (signInError.message.toLowerCase().includes("invalid") || signInError.message.toLowerCase().includes("credentials")) {
        setError("Incorrect email or password. Please try again.");
      } else {
        setNotRegistered(true);
      }
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  }

  async function handleGoogle() {
    setLoading(true); setError("");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  function handleDigit(i: number, val: string) {
    const cleaned = val.replace(/\D/g, "").slice(-1);
    const next = [...digits]; next[i] = cleaned; setDigits(next); setError("");
    if (cleaned && i < 5) refs.current[i + 1]?.focus();
    if (!cleaned && i > 0) refs.current[i - 1]?.focus();
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) { setDigits(pasted.split("")); refs.current[5]?.focus(); }
  }

  async function handleVerify() {
    const code = digits.join("");
    if (code.length !== 6) { setError("Please enter the full 6-digit code."); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, token: code }),
    });
    const data = await res.json();
    if (data.error) {
      setError("Invalid or expired code. Please try again.");
      setDigits(["", "", "", "", "", ""]); refs.current[0]?.focus(); setLoading(false); return;
    }
    router.push("/dashboard");
  }

  async function handleResend() {
    await fetch("/api/auth/send-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) });
    setResendTimer(30);
    const interval = setInterval(() => { setResendTimer((t) => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; }); }, 1000);
  }

  if (step === "2fa") {
    const allFilled = digits.every((d) => d !== "");
    return (
      <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "system-ui,-apple-system,sans-serif" }}>
        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "2rem", width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <Link href="/" style={{ fontSize: 24, fontWeight: 700, textDecoration: "none", letterSpacing: "-.5px" }}>
              <span style={{ color: "#1a1a2e" }}>slot</span><span style={{ color: "#2563eb" }}>rez</span>
            </Link>
          </div>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 24 }}>📱</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: "#111827" }}>Check your phone</h2>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>We sent a 6-digit code to verify your identity.</p>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: "1.25rem" }}>
            {digits.map((d, i) => (
              <input key={i} ref={(el) => { refs.current[i] = el; }} value={d} maxLength={1} inputMode="numeric"
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus(); }}
                onPaste={handleOtpPaste}
                style={{ width: 44, height: 52, textAlign: "center", fontSize: 22, fontWeight: 700, border: `${error ? "1.5px solid #ef4444" : d ? "1.5px solid #2563eb" : "0.5px solid #d1d5db"}`, borderRadius: 10, background: d ? "#eff6ff" : "#fff", color: "#111827", fontFamily: "inherit", outline: "none" }} />
            ))}
          </div>
          {error && <p style={{ textAlign: "center", fontSize: 12, color: "#ef4444", marginBottom: "1rem" }}>⚠️ {error}</p>}
          <button onClick={handleVerify} disabled={!allFilled || loading}
            style={{ width: "100%", background: allFilled ? "#2563eb" : "#e5e7eb", color: allFilled ? "#fff" : "#9ca3af", border: "none", padding: "11px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: allFilled ? "pointer" : "default", fontFamily: "inherit", marginBottom: "1rem" }}>
            {loading ? "Verifying..." : "Verify & sign in"}
          </button>
          <p style={{ textAlign: "center", fontSize: 12, color: "#6b7280" }}>
            Didn&apos;t get a code?{" "}
            {resendTimer > 0 ? <span style={{ color: "#9ca3af" }}>Resend in {resendTimer}s</span> : <span style={{ color: "#2563eb", cursor: "pointer" }} onClick={handleResend}>Resend code</span>}
          </p>
          <p style={{ textAlign: "center", marginTop: ".5rem", fontSize: 12, color: "#2563eb", cursor: "pointer" }} onClick={() => setStep("credentials")}>← Use a different account</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "2rem", width: "100%", maxWidth: 400 }}>

        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <Link href="/" style={{ fontSize: 24, fontWeight: 700, textDecoration: "none", letterSpacing: "-.5px" }}>
            <span style={{ color: "#1a1a2e" }}>slot</span><span style={{ color: "#2563eb" }}>rez</span>
          </Link>
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#111827" }}>Welcome back</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.5rem" }}>Sign in to your Slotrez account</p>

        <button onClick={handleGoogle} disabled={loading}
          style={{ width: "100%", background: "#fff", border: "0.5px solid #d1d5db", padding: "10px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: "1.25rem", fontWeight: 500, color: "#374151" }}>
          <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          <span style={{ fontSize: 12, color: "#9ca3af" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
        </div>

        {/* Email — no spaces */}
        <div style={{ marginBottom: ".85rem" }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Email</label>
          <input
            type="email" inputMode="email" autoComplete="email"
            autoCapitalize="none" autoCorrect="off" spellCheck={false}
            value={email}
            onChange={(e) => { setEmail(noSpaces(e.target.value)); setError(""); setNotRegistered(false); }}
            onKeyDown={(e) => { blockSpace(e); if (e.key === "Enter") handleLogin(); }}
            onPaste={pasteNoSpaces(setEmail)}
            placeholder="you@example.com"
            style={baseInput}
          />
        </div>

        {/* Password — no spaces */}
        <div style={{ marginBottom: ".75rem" }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password" autoCapitalize="none" autoCorrect="off" spellCheck={false}
              value={password}
              onChange={(e) => { setPassword(noSpaces(e.target.value)); setError(""); }}
              onKeyDown={(e) => { blockSpace(e); if (e.key === "Enter") handleLogin(); }}
              onPaste={pasteNoSpaces(setPassword)}
              placeholder="Enter your password"
              style={{ ...baseInput, paddingRight: 40 }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex", alignItems: "center" }}>
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        <div style={{ textAlign: "right", marginBottom: "1.25rem" }}>
          <Link href="/forgot-password" style={{ fontSize: 12, color: "#2563eb", textDecoration: "none" }}>Forgot password?</Link>
        </div>

        {notRegistered && (
          <div style={{ background: "#faeeda", border: "0.5px solid #f59e0b", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#854f0b", marginBottom: "1rem", lineHeight: 1.6 }}>
            <strong>No account found for this email.</strong>{" "}
            <Link href="/register" style={{ color: "#854f0b", fontWeight: 600, textDecoration: "underline" }}>Create an account</Link>{" "}
            or try a different email.
          </div>
        )}

        {error && !notRegistered && (
          <div style={{ background: "#fcebeb", border: "0.5px solid #fca5a5", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#a32d2d", marginBottom: "1rem" }}>
            ⚠️ {error}
          </div>
        )}

        <button onClick={handleLogin} disabled={loading}
          style={{ width: "100%", background: loading ? "#93c5fd" : "#2563eb", color: "#fff", border: "none", padding: "11px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: loading ? "default" : "pointer", fontFamily: "inherit" }}>
          {loading ? "Signing in..." : "Sign in →"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: 13, color: "#6b7280" }}>
          No account?{" "}
          <Link href="/register" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>Sign up free</Link>
        </p>
      </div>
    </div>
  );
}
