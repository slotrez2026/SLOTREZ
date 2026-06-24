"use client";

// ─────────────────────────────────────────────────────────────
// Slotrez — Register page (real Supabase signup)
// Save to: src/app/register/page.tsx
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Role = "client" | "biz";
type Step = "details" | "phone" | "verify";

// ── Eye icon ──────────────────────────────────────────────────
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

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("client");
  const [step, setStep] = useState<Step>("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailExists, setEmailExists] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneE164, setPhoneE164] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px",
    border: "0.5px solid #d1d5db", borderRadius: 8,
    fontSize: 13, fontFamily: "inherit",
    outline: "none", boxSizing: "border-box",
    background: "#fff", color: "#111827",
  };

  // ── Step 1: Create account ──
  async function handleSignup() {
    setEmailExists(false);
    if (!firstName || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (role === "biz" && !businessName) {
      setError("Please enter your business name.");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`.trim(),
          role: role === "biz" ? "owner" : "client",
          business_name: role === "biz" ? businessName : null,
        },
      },
    });

    if (signUpError) {
      // Check if email already registered
      if (
        signUpError.message.toLowerCase().includes("already") ||
        signUpError.message.toLowerCase().includes("registered") ||
        signUpError.message.toLowerCase().includes("exists")
      ) {
        setEmailExists(true);
        setLoading(false);
        return;
      }
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Supabase returns a user with identities=[] when email already exists
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setEmailExists(true);
      setLoading(false);
      return;
    }

    // Create profile in DB
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email: email.trim(),
        full_name: `${firstName} ${lastName}`.trim(),
        role: role === "biz" ? "owner" : "client",
        onboarding_complete: false,
      });

      if (role === "biz" && businessName) {
        await supabase.from("businesses").insert({
          owner_id: data.user.id,
          name: businessName,
          plan: "free",
        });
      }
    }

    setLoading(false);
    setStep("phone");
  }

  // ── Google Sign Up ──
  async function handleGoogle() {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  // ── Step 2: Send phone OTP ──
  async function handleSendOtp() {
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();

    if (data.error) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setPhoneE164(data.phone);
    setLoading(false);
    setStep("verify");
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((t) => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; });
    }, 1000);
  }

  // ── Step 3: Verify OTP ──
  function handleDigit(i: number, val: string) {
    const cleaned = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = cleaned;
    setDigits(next);
    setError("");
    const el = document.getElementById(`otp-${i + 1}`);
    if (cleaned && i < 5 && el) (el as HTMLInputElement).focus();
    const prev = document.getElementById(`otp-${i - 1}`);
    if (!cleaned && i > 0 && prev) (prev as HTMLInputElement).focus();
  }

  async function handleVerify() {
    const code = digits.join("");
    if (code.length !== 6) { setError("Enter the full 6-digit code."); return; }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneE164, token: code }),
    });
    const data = await res.json();

    if (data.error) {
      setError("Invalid code. Please try again.");
      setDigits(["", "", "", "", "", ""]);
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ phone: phoneE164 }).eq("id", user.id);
    }

    router.push("/dashboard");
  }

  // ── Progress bar ──
  const steps = ["Account", "Phone", "Verify"];
  const stepIdx = step === "details" ? 0 : step === "phone" ? 1 : 2;

  function ProgressBar() {
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: "1.5rem" }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: i < stepIdx ? "#2563eb" : i === stepIdx ? "#eff6ff" : "#f3f4f6", color: i < stepIdx ? "#fff" : i === stepIdx ? "#2563eb" : "#9ca3af", border: i === stepIdx ? "1.5px solid #2563eb" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
              {i < stepIdx ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 10, color: i === stepIdx ? "#2563eb" : "#9ca3af", fontWeight: i === stepIdx ? 600 : 400 }}>{s}</span>
            {i < 2 && <div style={{ width: 16, height: 1, background: "#e5e7eb" }} />}
          </div>
        ))}
      </div>
    );
  }

  // ── Verify screen ──
  if (step === "verify") {
    const allFilled = digits.every((d) => d !== "");
    return (
      <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "system-ui,-apple-system,sans-serif" }}>
        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "2rem", width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}><Link href="/" style={{ fontSize: 24, fontWeight: 700, textDecoration: "none", letterSpacing: "-.5px" }}><span style={{ color: "#1a1a2e" }}>slot</span><span style={{ color: "#2563eb" }}>rez</span></Link></div>
          <ProgressBar />
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 24 }}>📱</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: "#111827" }}>Verify your phone</h2>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>We sent a 6-digit code to confirm your number.</p>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: "1.25rem" }}>
            {digits.map((d, i) => (
              <input key={i} id={`otp-${i}`} value={d} maxLength={1} inputMode="numeric"
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) { const prev = document.getElementById(`otp-${i-1}`); if (prev) (prev as HTMLInputElement).focus(); } }}
                style={{ width: 44, height: 52, textAlign: "center", fontSize: 22, fontWeight: 700, border: `${error ? "1.5px solid #ef4444" : d ? "1.5px solid #2563eb" : "0.5px solid #d1d5db"}`, borderRadius: 10, background: d ? "#eff6ff" : "#fff", color: "#111827", fontFamily: "inherit", outline: "none" }} />
            ))}
          </div>
          {error && <p style={{ textAlign: "center", fontSize: 12, color: "#ef4444", marginBottom: "1rem" }}>⚠️ {error}</p>}
          <button onClick={handleVerify} disabled={!allFilled || loading}
            style={{ width: "100%", background: allFilled ? "#2563eb" : "#e5e7eb", color: allFilled ? "#fff" : "#9ca3af", border: "none", padding: "11px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: allFilled ? "pointer" : "default", fontFamily: "inherit", marginBottom: "1rem" }}>
            {loading ? "Verifying..." : "Verify & finish setup →"}
          </button>
          <p style={{ textAlign: "center", fontSize: 12, color: "#6b7280" }}>
            Didn&apos;t get a code?{" "}
            {resendTimer > 0 ? <span style={{ color: "#9ca3af" }}>Resend in {resendTimer}s</span> : <span style={{ color: "#2563eb", cursor: "pointer" }} onClick={handleSendOtp}>Resend</span>}
          </p>
        </div>
      </div>
    );
  }

  // ── Phone screen ──
  if (step === "phone") {
    return (
      <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "system-ui,-apple-system,sans-serif" }}>
        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "2rem", width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}><Link href="/" style={{ fontSize: 24, fontWeight: 700, textDecoration: "none", letterSpacing: "-.5px" }}><span style={{ color: "#1a1a2e" }}>slot</span><span style={{ color: "#2563eb" }}>rez</span></Link></div>
          <ProgressBar />
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 24 }}>📱</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: "#111827" }}>Add your phone number</h2>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>Used for 2FA and booking reminders. We&apos;ll never spam you.</p>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Phone number</label>
            <div style={{ display: "flex", gap: 8 }}>
              <select style={{ padding: "9px 10px", border: "0.5px solid #d1d5db", borderRadius: 8, fontSize: 13, fontFamily: "inherit", background: "#fff", flexShrink: 0 }}>
                <option>🇺🇸 +1</option><option>🇲🇽 +52</option><option>🇬🇧 +44</option><option>🇨🇦 +1</option>
              </select>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="(201) 555-0192" style={{ ...inputStyle, flex: 1 }}
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()} />
            </div>
          </div>
          <div style={{ background: "#f9fafb", border: "0.5px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#6b7280", marginBottom: "1.25rem", lineHeight: 1.6 }}>
            🔐 Slotrez uses SMS 2FA to protect your account and payments.
          </div>
          {error && <div style={{ background: "#fcebeb", border: "0.5px solid #fca5a5", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#a32d2d", marginBottom: "1rem" }}>⚠️ {error}</div>}
          <button onClick={handleSendOtp} disabled={loading}
            style={{ width: "100%", background: "#2563eb", color: "#fff", border: "none", padding: "11px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            {loading ? "Sending..." : "Send verification code →"}
          </button>
          {/* Skip phone for now — remove before launch once Twilio is connected */}
          <button
            onClick={() => router.push("/dashboard")}
            style={{ width: "100%", background: "none", border: "none", padding: "10px", fontSize: 12, color: "#9ca3af", cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}
          >
            Skip for now → go to dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Details screen ──
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "2rem", width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}><Link href="/" style={{ fontSize: 24, fontWeight: 700, textDecoration: "none", letterSpacing: "-.5px" }}><span style={{ color: "#1a1a2e" }}>slot</span><span style={{ color: "#2563eb" }}>rez</span></Link></div>
        <ProgressBar />
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#111827" }}>Create your account</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.25rem" }}>Join Slotrez as a client or a business</p>

        {/* Google */}
        <button onClick={handleGoogle} disabled={loading}
          style={{ width: "100%", background: "#fff", border: "0.5px solid #d1d5db", padding: "10px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: "1.25rem", fontWeight: 500, color: "#374151" }}>
          <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} /><span style={{ fontSize: 12, color: "#9ca3af" }}>or</span><div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
        </div>

        {/* Role toggle */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "1.25rem" }}>
          {(["client", "biz"] as const).map((r) => (
            <div key={r} onClick={() => setRole(r)}
              style={{ padding: 12, border: `${role === r ? "2px" : "0.5px"} solid ${role === r ? "#2563eb" : "#d1d5db"}`, borderRadius: 9, cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{r === "client" ? "👤" : "🏪"}</div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{r === "client" ? "Client" : "Business"}</p>
              <p style={{ fontSize: 11, color: "#9ca3af" }}>{r === "client" ? "Book services" : "Accept bookings"}</p>
            </div>
          ))}
        </div>

        {/* Name */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: ".85rem" }}>
          <div><label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>First name *</label><input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Alex" style={inputStyle} /></div>
          <div><label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Last name</label><input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Rivera" style={inputStyle} /></div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: ".85rem" }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Email *</label>
          <input type="email" value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); setEmailExists(false); }}
            placeholder="you@example.com" style={inputStyle} />
        </div>

        {/* Email already exists notice */}
        {emailExists && (
          <div style={{ background: "#faeeda", border: "0.5px solid #f59e0b", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#854f0b", marginBottom: "1rem", lineHeight: 1.6 }}>
            <strong>This email is already registered.</strong> Did you forget your password?{" "}
            <Link href="/forgot-password" style={{ color: "#854f0b", fontWeight: 600, textDecoration: "underline" }}>
              Reset it here
            </Link>{" "}or{" "}
            <Link href="/login" style={{ color: "#854f0b", fontWeight: 600, textDecoration: "underline" }}>
              log in instead
            </Link>.
          </div>
        )}

        {/* Password with show/hide */}
        <div style={{ marginBottom: ".85rem" }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Password *</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Min. 8 characters"
              style={{ ...inputStyle, paddingRight: 40 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex", alignItems: "center" }}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {/* Password strength hint */}
          {password.length > 0 && password.length < 8 && (
            <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>Password must be at least 8 characters</p>
          )}
          {password.length >= 8 && (
            <p style={{ fontSize: 11, color: "#3b6d11", marginTop: 4 }}>✓ Password looks good</p>
          )}
        </div>

        {role === "biz" && (
          <div style={{ marginBottom: ".85rem" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Business name *</label>
            <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your shop or studio name" style={inputStyle} />
          </div>
        )}

        {error && !emailExists && (
          <div style={{ background: "#fcebeb", border: "0.5px solid #fca5a5", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#a32d2d", marginBottom: "1rem" }}>
            ⚠️ {error}
          </div>
        )}

        <button onClick={handleSignup} disabled={loading || emailExists}
          style={{ width: "100%", background: loading || emailExists ? "#93c5fd" : "#2563eb", color: "#fff", border: "none", padding: "11px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: loading || emailExists ? "default" : "pointer", fontFamily: "inherit", marginTop: ".25rem" }}>
          {loading ? "Creating account..." : "Continue →"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: 13, color: "#6b7280" }}>
          Already have an account?{" "}<Link href="/login" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
