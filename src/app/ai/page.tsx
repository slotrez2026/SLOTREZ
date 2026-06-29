"use client";

// ─────────────────────────────────────────────────────────────
// Slotrez — AI Solutions page
// Save this file to: src/app/ai/page.tsx
// ─────────────────────────────────────────────────────────────

const AI_FEATURES = [
  {
    icon: "🤖",
    iconBg: "#eff6ff",
    title: "AI Booking Assistant",
    badge: "All plans",
    badgeBg: "#eff6ff",
    badgeColor: "#1d4ed8",
    accentColor: "#2563eb",
    desc: "A 24/7 chat assistant on your booking page. Clients ask questions and it answers instantly — even at 2am when you're asleep.",
    demo: {
      from: "Client",
      fromBg: "#eff6ff",
      fromColor: "#2563eb",
      msg: "\"Do you have anything Saturday morning?\"",
      reply: "Elite Cuts has 3 open slots Saturday — 9am, 10am, and 11am. Want me to reserve one?",
      replyColor: "#2563eb",
    },
  },
  {
    icon: "📊",
    iconBg: "#f5f3ff",
    title: "Smart Revenue Forecasting",
    badge: "Pro & Elite",
    badgeBg: "#f5f3ff",
    badgeColor: "#7c3aed",
    accentColor: "#7c3aed",
    desc: "AI analyzes your booking patterns and seasonal trends to predict your revenue for the next 30, 60, and 90 days.",
    demo: null,
    forecast: { label: "Next 30 days", value: "$7,240", bar: 78, note: "↑ 12% vs last month — summer trending up", color: "#7c3aed" },
  },
  {
    icon: "🎯",
    iconBg: "#ecfdf5",
    title: "Smart Re-engagement",
    badge: "Pro & Elite",
    badgeBg: "#ecfdf5",
    badgeColor: "#059669",
    accentColor: "#059669",
    desc: "AI spots clients who are about to churn and automatically sends a personalized message before they go to a competitor.",
    demo: {
      from: "Auto-sent",
      fromBg: "#ecfdf5",
      fromColor: "#059669",
      msg: null,
      reply: "\"Hey Jordan! It's been a while — your usual Friday slot is still open. Want us to hold it? 👋\"",
      replyColor: "#374151",
    },
  },
  {
    icon: "⚡",
    iconBg: "#fffbeb",
    title: "Dynamic Pricing",
    badge: "Elite only",
    badgeBg: "#fffbeb",
    badgeColor: "#d97706",
    accentColor: "#d97706",
    desc: "Slow Tuesday morning? AI drops the price to fill your calendar. Fully booked Friday? AI raises it. Maximize revenue automatically.",
    demo: null,
    pricing: [
      { slot: "Tue 10am (slow)", from: "$35", to: "$28", color: "#059669" },
      { slot: "Fri 5pm (peak)", from: "$35", to: "$45", color: "#d97706" },
    ],
  },
  {
    icon: "🧠",
    iconBg: "#eff6ff",
    title: "AI Client Insights",
    badge: "Pro & Elite",
    badgeBg: "#eff6ff",
    badgeColor: "#1d4ed8",
    accentColor: "#2563eb",
    desc: "Every client gets an AI-generated profile — booking patterns, churn risk, best contact time, and predicted lifetime value.",
    demo: {
      from: "AI insight",
      fromBg: "#eff6ff",
      fromColor: "#2563eb",
      msg: null,
      reply: "Alex Rivera books every 2.4 weeks, always Fridays, prefers Marcus. High churn risk if rescheduled 2+ times. Est. LTV: $2,100.",
      replyColor: "#374151",
    },
  },
  {
    icon: "📝",
    iconBg: "#f5f3ff",
    title: "AI Review Replies",
    badge: "All plans",
    badgeBg: "#f5f3ff",
    badgeColor: "#7c3aed",
    accentColor: "#7c3aed",
    desc: "AI reads every review and drafts a personalized reply in your voice. You approve in one click or edit before posting.",
    demo: {
      from: "Review",
      fromBg: "#faeeda",
      fromColor: "#854f0b",
      msg: "\"Best session I've had, James is incredible 🔥\"",
      reply: "Appreciate you Alex! Marcus takes real pride in every cut — can't wait to see you next time 💈",
      replyColor: "#7c3aed",
    },
  },
];

const ADMIN_AI = [
  { icon: "🔍", title: "Fraud detection", desc: "AI flags suspicious accounts — fake reviews, payment fraud, chargeback abuse — before it costs you." },
  { icon: "📈", title: "Churn prediction", desc: "AI identifies which tenants are likely to cancel in the next 30 days so you can reach out and save them." },
  { icon: "💬", title: "Support AI", desc: "Handles 80% of support tickets automatically — password resets, billing questions — before a human touches it." },
  { icon: "📊", title: "Growth insights", desc: "Weekly AI report — fastest growing categories, highest-value tenants, best acquisition channels." },
];

const ROADMAP = [
  { title: "Voice booking", desc: "\"Hey Slotrez, book me with Marcus on Friday at 11\"", date: "Q1 2026" },
  { title: "AI schedule optimizer", desc: "Automatically rearranges your calendar to minimize gaps and maximize daily revenue", date: "Q2 2026" },
  { title: "AI marketing writer", desc: "Generates Instagram captions, promo texts, and email campaigns for your business", date: "Q2 2026" },
  { title: "Predictive staffing", desc: "Predicts your busiest days 4 weeks out and suggests optimal staff scheduling", date: "Q3 2026" },
];

export default function AIPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* ── Hero ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #4c1d95 50%, #1e3a8a 100%)",
          padding: "6rem 1.5rem 5rem",
          textAlign: "center",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative orbs */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(124,58,237,.15)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(37,99,235,.15)", pointerEvents: "none" }} />

        <span
          style={{
            display: "inline-block",
            background: "rgba(167,139,250,.15)",
            border: "0.5px solid rgba(167,139,250,.35)",
            padding: "4px 14px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 500,
            marginBottom: "1.25rem",
            color: "#c4b5fd",
          }}
        >
          Powered by AI
        </span>

        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 46px)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            marginBottom: "1.25rem",
            maxWidth: 600,
            margin: "0 auto 1.25rem",
          }}
        >
          Your booking platform,<br />now with a brain
        </h1>

        <p
          style={{
            fontSize: 16,
            opacity: 0.8,
            lineHeight: 1.8,
            maxWidth: 520,
            margin: "0 auto 2.5rem",
          }}
        >
          Slotrez AI works in the background — filling your calendar, reducing
          no-shows, keeping clients coming back, and running your business
          smarter every single day.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="/register"
            style={{
              background: "rgba(124,58,237,.8)",
              border: "0.5px solid rgba(167,139,250,.4)",
              color: "#fff",
              padding: "11px 26px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Try AI features free
          </a>
          <a
            href="#features"
            style={{
              background: "rgba(255,255,255,.08)",
              border: "0.5px solid rgba(255,255,255,.2)",
              color: "#fff",
              padding: "11px 26px",
              borderRadius: 8,
              fontSize: 14,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            See how it works ↓
          </a>
        </div>
      </section>

      {/* ── AI Features grid ── */}
      <section id="features" style={{ maxWidth: 800, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <p
          style={{
            fontSize: 11,
            color: "#9ca3af",
            textTransform: "uppercase",
            letterSpacing: "1px",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          AI features built into Slotrez
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 12,
            marginBottom: "3rem",
          }}
        >
          {AI_FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                background: "#fff",
                border: "0.5px solid #e5e7eb",
                borderRadius: 12,
                padding: "1.25rem",
                borderTop: `3px solid ${f.accentColor}`,
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    background: f.iconBg,
                    borderRadius: 9,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 3 }}>{f.title}</p>
                  <span
                    style={{
                      background: f.badgeBg,
                      color: f.badgeColor,
                      padding: "2px 8px",
                      borderRadius: 20,
                      fontSize: 10,
                      fontWeight: 500,
                    }}
                  >
                    {f.badge}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.7, marginBottom: 10 }}>{f.desc}</p>

              {/* Demo box */}
              <div style={{ background: "#f9fafb", borderRadius: 8, padding: 10, fontSize: 12 }}>
                {f.demo && (
                  <>
                    {f.demo.msg && (
                      <div style={{ display: "flex", gap: 7, marginBottom: 7 }}>
                        <span
                          style={{
                            background: f.demo.fromBg,
                            color: f.demo.fromColor,
                            padding: "2px 8px",
                            borderRadius: 6,
                            fontSize: 10,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {f.demo.from}
                        </span>
                        <span style={{ color: "#6b7280" }}>{f.demo.msg}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 7 }}>
                      <span
                        style={{
                          background: "#eaf3de",
                          color: "#3b6d11",
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontSize: 10,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {f.demo.msg ? "AI" : f.demo.from}
                      </span>
                      <span style={{ color: f.demo.replyColor, lineHeight: 1.5 }}>{f.demo.reply}</span>
                    </div>
                  </>
                )}

                {f.forecast && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: "#6b7280" }}>{f.forecast.label}</span>
                      <span style={{ fontWeight: 700, color: f.forecast.color }}>{f.forecast.value}</span>
                    </div>
                    <div style={{ height: 5, background: "#e5e7eb", borderRadius: 3, marginBottom: 6 }}>
                      <div style={{ height: 5, background: f.forecast.color, borderRadius: 3, width: `${f.forecast.bar}%` }} />
                    </div>
                    <p style={{ fontSize: 11, color: "#9ca3af" }}>{f.forecast.note}</p>
                  </>
                )}

                {f.pricing && (
                  <div>
                    {f.pricing.map((p) => (
                      <div
                        key={p.slot}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "4px 0",
                          borderBottom: "0.5px solid #e5e7eb",
                          fontSize: 12,
                        }}
                      >
                        <span style={{ color: "#6b7280" }}>{p.slot}</span>
                        <span style={{ fontWeight: 600, color: p.color }}>
                          {p.from} → {p.to} ✓
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Admin AI ── */}
        <div
          style={{
            background: "linear-gradient(135deg, #1a1a2e, #1e3a8a)",
            borderRadius: 12,
            padding: "1.75rem",
            color: "#fff",
            marginBottom: "3rem",
          }}
        >
          <p style={{ fontSize: 11, opacity: 0.5, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>For Slotrez admins</p>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: "1.25rem", letterSpacing: "-.5px" }}>
            AI-powered platform operations
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
            {ADMIN_AI.map((a) => (
              <div
                key={a.title}
                style={{
                  background: "rgba(255,255,255,.07)",
                  borderRadius: 9,
                  padding: "1rem",
                }}
              >
                <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 5 }}>{a.icon} {a.title}</p>
                <p style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.6 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Roadmap ── */}
        <div
          style={{
            background: "#fff",
            border: "0.5px solid #e5e7eb",
            borderRadius: 12,
            padding: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: "1rem", color: "#111827" }}>AI roadmap — coming soon</h3>
          <div>
            {ROADMAP.map((item, i) => (
              <div
                key={item.title}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: i < ROADMAP.length - 1 ? "0.5px solid #f3f4f6" : "none",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 13, color: "#111827", marginBottom: 3 }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.5 }}>{item.desc}</p>
                </div>
                <span
                  style={{
                    background: "#f5f3ff",
                    color: "#7c3aed",
                    padding: "3px 10px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-.5px", marginBottom: ".75rem", color: "#111827" }}>
            Start with AI today — it&apos;s free
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "#6b7280",
              lineHeight: 1.8,
              maxWidth: 440,
              margin: "0 auto 2rem",
            }}
          >
            Every Slotrez plan includes the AI Booking Assistant and AI Review
            Replies. Pro and Elite unlock the full AI suite.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="/register"
              style={{
                background: "#2563eb",
                color: "#fff",
                padding: "11px 26px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Start for free
            </a>
            <a
              href="/support"
              style={{
                border: "0.5px solid #d1d5db",
                background: "#fff",
                color: "#374151",
                padding: "11px 26px",
                borderRadius: 8,
                fontSize: 14,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Talk to us about AI
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
