"use client";

// ─────────────────────────────────────────────────────────────
// Slotrez — Business onboarding checklist
// Save to: src/app/onboarding/page.tsx
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const STEPS = [
  { id: "service",  icon: "✂️", title: "Add your first service",    desc: "e.g. Haircut — 45 min — $45",           action: "Add service"    },
  { id: "hours",    icon: "🕐", title: "Set your business hours",   desc: "When are you available to accept rezzes?", action: "Set hours"      },
  { id: "bank",     icon: "🏦", title: "Connect your bank account", desc: "Get paid via Stripe. Takes 2 minutes.",   action: "Connect bank"   },
  { id: "profile",  icon: "📸", title: "Complete your profile",     desc: "Add a photo, bio, and your location.",    action: "Edit profile"   },
  { id: "share",    icon: "🔗", title: "Share your booking link",   desc: "Put it in your Instagram bio or website.", action: "Get my link"    },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [completed, setCompleted] = useState<string[]>([]);
  const [businessName, setBusinessName] = useState("your business");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: biz } = await supabase
        .from("businesses")
        .select("name, onboarding_steps")
        .eq("owner_id", user.id)
        .single();

      if (biz) {
        setBusinessName(biz.name || "your business");
        setCompleted(biz.onboarding_steps || []);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  async function markComplete(stepId: string) {
    const newCompleted = completed.includes(stepId)
      ? completed
      : [...completed, stepId];

    setCompleted(newCompleted);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("businesses")
      .update({ onboarding_steps: newCompleted })
      .eq("owner_id", user.id);

    // If all steps done mark onboarding complete
    if (newCompleted.length === STEPS.length) {
      await supabase
        .from("profiles")
        .update({ onboarding_complete: true })
        .eq("id", user.id);
    }
  }

  async function finish() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ onboarding_complete: true })
        .eq("id", user.id);
    }
    router.push("/portal/business");
  }

  const progress = Math.round((completed.length / STEPS.length) * 100);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <p style={{ color: "#6b7280", fontSize: 14 }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui,-apple-system,sans-serif", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ fontSize: 24, fontWeight: 700, textDecoration: "none", letterSpacing: "-.5px", display: "inline-block", marginBottom: "1rem" }}>
            <span style={{ color: "#1a1a2e" }}>slot</span><span style={{ color: "#2563eb" }}>rez</span>
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, color: "#111827" }}>
            Let&apos;s get {businessName} live 🚀
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.25rem" }}>
            Complete these 5 steps to start accepting bookings.
          </p>

          {/* Progress bar */}
          <div style={{ background: "#e5e7eb", borderRadius: 4, height: 8, marginBottom: 6 }}>
            <div style={{ background: "#2563eb", borderRadius: 4, height: 8, width: `${progress}%`, transition: "width .4s" }} />
          </div>
          <p style={{ fontSize: 12, color: "#6b7280" }}>{completed.length} of {STEPS.length} steps complete</p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.5rem" }}>
          {STEPS.map((s, i) => {
            const done = completed.includes(s.id);
            return (
              <div key={s.id}
                style={{ background: "#fff", border: `${done ? "0.5px solid #b2d98a" : "0.5px solid #e5e7eb"}`, borderRadius: 12, padding: "1rem", display: "flex", alignItems: "center", gap: 12 }}>
                {/* Icon / check */}
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: done ? "#eaf3de" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                  {done ? "✓" : s.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 13, color: done ? "#3b6d11" : "#111827", marginBottom: 2 }}>{s.title}</p>
                  <p style={{ fontSize: 12, color: "#6b7280" }}>{s.desc}</p>
                </div>

                <button
                  onClick={() => markComplete(s.id)}
                  style={{ background: done ? "#eaf3de" : "#2563eb", color: done ? "#3b6d11" : "#fff", border: "none", padding: "7px 14px", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {done ? "✓ Done" : s.action}
                </button>
              </div>
            );
          })}
        </div>

        {/* Finish button */}
        <button onClick={finish}
          style={{ width: "100%", background: completed.length === STEPS.length ? "#2563eb" : "#1a1a2e", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", marginBottom: "1rem" }}>
          {completed.length === STEPS.length ? "Go to my dashboard 🎉" : "Skip for now — go to dashboard →"}
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af" }}>
          You can complete these steps any time from your dashboard settings.
        </p>
      </div>
    </div>
  );
}
