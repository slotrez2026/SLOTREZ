"use client";

// ─────────────────────────────────────────────────────────────
// Slotrez — About Us page
// Save this file to: src/app/about/page.tsx
// ─────────────────────────────────────────────────────────────

const VALUES = [
  {
    icon: "🔒",
    title: "Transparency",
    desc: "No hidden fees. No surprise charges. You always know exactly what Slotrez takes on every transaction.",
  },
  {
    icon: "⚡",
    title: "Speed",
    desc: "Clients book in under 60 seconds. Businesses get paid the same week. Everything about Slotrez is built fast.",
  },
  {
    icon: "🌱",
    title: "Growth",
    desc: "We succeed when you succeed. Every feature we build is designed to help you grow, not just manage bookings.",
  },
];

const FEATURES = [
  {
    icon: "✂️",
    bg: "#eff6ff",
    title: "Built for every industry",
    desc: "Fitness, wellness, home, beauty, pets, finance — one platform built for every service industry. No one-size-fits-all nonsense.",
  },
  {
    icon: "💳",
    bg: "#eaf3de",
    title: "Payments that work for you",
    desc: "Deposits, no-show fees, instant payouts. Your money, your rules — no waiting weeks to get paid.",
  },
  {
    icon: "🤝",
    bg: "#faeeda",
    title: "Real human support",
    desc: "When you need help, a real person responds — not a bot, not a ticket queue that takes 5 days.",
  },
];

const TEAM = [
  {
    initials: "SR",
    bg: "#1a1a2e",
    color: "#60a5fa",
    role: "Founder & CEO",
    location: "Passaic, NJ",
    tag: "Vision & Strategy",
    tagColor: "#5f5e5a",
    tagBg: "#f1efe8",
    hiring: false,
  },
  {
    initials: "—",
    bg: "#eff6ff",
    color: "#2563eb",
    role: "Head of Engineering",
    location: "Hiring now",
    tag: "Apply →",
    tagColor: "#1d4ed8",
    tagBg: "#eff6ff",
    hiring: true,
  },
  {
    initials: "—",
    bg: "#eff6ff",
    color: "#2563eb",
    role: "Head of Support",
    location: "Hiring now",
    tag: "Apply →",
    tagColor: "#1d4ed8",
    tagBg: "#eff6ff",
    hiring: true,
  },
  {
    initials: "—",
    bg: "#eff6ff",
    color: "#2563eb",
    role: "Sales Lead",
    location: "Hiring now",
    tag: "Apply →",
    tagColor: "#1d4ed8",
    tagBg: "#eff6ff",
    hiring: true,
  },
];

const STATS = [
  { value: "2024", label: "Founded" },
  { value: "Passaic", label: "NJ headquarters" },
  { value: "40+", label: "Service categories" },
  { value: "$0", label: "To get started" },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* ── Hero ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #1e3a8a 100%)",
          padding: "6rem 1.5rem 5rem",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <span
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,.1)",
            border: "0.5px solid rgba(255,255,255,.2)",
            padding: "4px 14px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 500,
            marginBottom: "1.25rem",
          }}
        >
          Our story
        </span>

        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 46px)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            marginBottom: "1.25rem",
            maxWidth: 640,
            margin: "0 auto 1.25rem",
          }}
        >
          Built for the people who show up every day
        </h1>

        <p
          style={{
            fontSize: 16,
            opacity: 0.8,
            lineHeight: 1.8,
            maxWidth: 540,
            margin: "0 auto 2.5rem",
          }}
        >
          Slotrez was built right here in Passaic, NJ — because we watched great
          trainers, therapists, and service pros lose time, lose money, and lose
          clients to bad booking software. We decided to fix that.
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
            Join Slotrez free
          </a>
          <a
            href="#team"
            style={{
              background: "rgba(255,255,255,.1)",
              border: "0.5px solid rgba(255,255,255,.3)",
              color: "#fff",
              padding: "11px 26px",
              borderRadius: 8,
              fontSize: 14,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Meet the team ↓
          </a>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section
        style={{
          background: "#fff",
          borderBottom: "0.5px solid #e5e7eb",
          padding: "2rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "1.5rem",
            textAlign: "center",
          }}
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#2563eb" }}>{s.value}</div>
              <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section style={{ padding: "5rem 1.5rem", maxWidth: 760, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "center",
            marginBottom: "4rem",
          }}
        >
          <div>
            <span
              style={{
                display: "inline-block",
                background: "#eff6ff",
                color: "#1d4ed8",
                padding: "3px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 500,
                marginBottom: "1rem",
              }}
            >
              Our mission
            </span>
            <h2
              style={{
                fontSize: "clamp(20px, 3vw, 28px)",
                fontWeight: 700,
                lineHeight: 1.25,
                marginBottom: "1rem",
                letterSpacing: "-.5px",
                color: "#111827",
              }}
            >
              Every service business deserves enterprise-grade tools
            </h2>
            <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.8 }}>
              The big booking platforms were built for hotels and airlines.
              Slotrez is built for the trainer who works 6 days a week, the
              trainer who juggles 12 clients, the cleaner who runs a
              one-person operation. We give them the same power — without the
              complexity or the price.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{
                  background: "#fff",
                  border: "0.5px solid #e5e7eb",
                  borderRadius: 12,
                  padding: "1rem",
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: f.bg,
                    borderRadius: 9,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#111827" }}>{f.title}</p>
                  <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Values ── */}
        <div style={{ marginBottom: "4rem" }}>
          <p
            style={{
              fontSize: 11,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "1px",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            What we stand for
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
            }}
          >
            {VALUES.map((v) => (
              <div
                key={v.title}
                style={{
                  background: "#fff",
                  border: "0.5px solid #e5e7eb",
                  borderRadius: 12,
                  padding: "1.5rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{v.icon}</div>
                <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: "#111827" }}>{v.title}</p>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Team ── */}
        <div id="team">
          <p
            style={{
              fontSize: 11,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "1px",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            The team
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 12,
              marginBottom: "1.5rem",
            }}
          >
            {TEAM.map((m) => (
              <div
                key={m.role}
                style={{
                  background: "#fff",
                  border: "0.5px solid #e5e7eb",
                  borderRadius: 12,
                  padding: "1.25rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: m.bg,
                    color: m.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 18,
                    margin: "0 auto 10px",
                  }}
                >
                  {m.initials}
                </div>
                <p style={{ fontWeight: 600, fontSize: 13, color: "#111827", marginBottom: 3 }}>{m.role}</p>
                <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>{m.location}</p>
                <a
                  href={m.hiring ? "/support#careers" : undefined}
                  style={{
                    display: "inline-block",
                    background: m.tagBg,
                    color: m.tagColor,
                    padding: "2px 9px",
                    borderRadius: 20,
                    fontSize: 10,
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  {m.tag}
                </a>
              </div>
            ))}
          </div>

          {/* Hiring banner */}
          <div
            style={{
              background: "#eff6ff",
              border: "0.5px solid #93c5fd",
              borderRadius: 12,
              padding: "1.5rem",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 15, fontWeight: 600, color: "#1d4ed8", marginBottom: 6 }}>
              We&apos;re building the team 🚀
            </p>
            <p style={{ fontSize: 13, color: "#1d4ed8", opacity: 0.8, marginBottom: "1rem", lineHeight: 1.6 }}>
              Looking for engineers, support reps, and sales people who care
              about helping small businesses grow.
            </p>
            <a
              href="/support#careers"
              style={{
                background: "#2563eb",
                color: "#fff",
                padding: "9px 20px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              View open roles
            </a>
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section
        style={{
          background: "#fff",
          borderTop: "0.5px solid #e5e7eb",
          padding: "3rem 1.5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 11,
            color: "#9ca3af",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "1.5rem",
          }}
        >
          Backed by great infrastructure
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2.5rem",
            flexWrap: "wrap",
            opacity: 0.4,
            fontSize: 14,
            fontWeight: 700,
            color: "#374151",
          }}
        >
          {["Stripe", "Supabase", "Vercel", "Twilio", "Cloudflare"].map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "5rem 1.5rem", textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-.5px", marginBottom: ".75rem", color: "#111827" }}>
          Ready to grow your business?
        </h2>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: "2rem", lineHeight: 1.8 }}>
          Join thousands of service professionals who use Slotrez to run their
          business, delight their clients, and get paid on time.
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
              color: "#374151",
              padding: "11px 26px",
              borderRadius: 8,
              fontSize: 14,
              textDecoration: "none",
              display: "inline-block",
              background: "#fff",
            }}
          >
            Talk to us
          </a>
        </div>
      </section>
    </div>
  );
}
