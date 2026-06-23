"use client";

// ─────────────────────────────────────────────────────────────
// Slotrez — Homepage
// Save to: src/app/page.tsx
// ─────────────────────────────────────────────────────────────

import Link from "next/link";

const CATEGORIES = [
  { icon: "✂️", label: "Hair & beauty" },
  { icon: "🏋️", label: "Fitness"       },
  { icon: "🏠", label: "Home"          },
  { icon: "🧘", label: "Wellness"      },
  { icon: "🐾", label: "Pet care"      },
];

const FEATURES = [
  { icon: "🧩", title: "Fully customizable",  desc: "Custom fields, forms & labels per industry"   },
  { icon: "🔒", title: "Booking policies",     desc: "Deposits, cancellations, no-show fees"         },
  { icon: "📊", title: "Real analytics",       desc: "Revenue, retention & top services"             },
  { icon: "🔔", title: "Auto reminders",       desc: "SMS & push cut no-shows by 60%"                },
  { icon: "⭐", title: "Loyalty rewards",      desc: "Points, tiers & perks for regulars"            },
  { icon: "👥", title: "Client CRM",           desc: "Notes, tags & full history per client"         },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* ── Hero ── */}
      <section style={{ textAlign: "center", padding: "5rem 1.5rem 3rem", maxWidth: 680, margin: "0 auto" }}>
        <span style={{ display: "inline-block", background: "#eff6ff", color: "#1d4ed8", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, marginBottom: "1.25rem" }}>
          Universal booking platform
        </span>
        <h1 style={{ fontSize: "clamp(30px,5vw,46px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: "1.25rem", color: "#111827" }}>
          <span style={{ color: "#1a1a2e" }}>slot</span>
          <span style={{ color: "#2563eb" }}>rez</span>
          {" — one platform"}<br />{"for every service."}
        </h1>
        <p style={{ fontSize: 16, color: "#6b7280", lineHeight: 1.8, maxWidth: 480, margin: "0 auto 2.5rem" }}>
          Barbers, trainers, cleaners, therapists and more. Run your entire business and let clients reserve in seconds.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/browse" style={{ background: "#2563eb", color: "#fff", padding: "11px 26px", borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: "none", display: "inline-block" }}>
            Find a professional
          </Link>
          <Link href="/register" style={{ border: "0.5px solid #d1d5db", color: "#374151", padding: "11px 26px", borderRadius: 8, fontSize: 14, textDecoration: "none", display: "inline-block", background: "#fff" }}>
            List your business — free
          </Link>
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ padding: "0 1.5rem 3rem", maxWidth: 680, margin: "0 auto" }}>
        <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>Browse by category</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
          {CATEGORIES.map((c) => (
            <Link key={c.label} href="/browse" style={{ textAlign: "center", padding: ".75rem .5rem", border: "0.5px solid #e5e7eb", borderRadius: 12, cursor: "pointer", background: "#fff", textDecoration: "none" }}>
              <div style={{ fontSize: 24 }}>{c.icon}</div>
              <p style={{ fontSize: 11, fontWeight: 500, marginTop: 6, color: "#374151" }}>{c.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: "#fff", borderTop: "0.5px solid #e5e7eb", borderBottom: "0.5px solid #e5e7eb", padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", textAlign: "center" }}>
          {[["12,000+","Active pros"],["40+","Categories"],["99.9%","Uptime"],["Free","To start"]].map(([v,l]) => (
            <div key={l}><div style={{ fontSize: 24, fontWeight: 700, color: "#2563eb" }}>{v}</div><p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{l}</p></div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: "3rem 1.5rem", maxWidth: 680, margin: "0 auto" }}>
        <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.5rem" }}>Everything your business needs</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10, marginBottom: "2rem" }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "1.25rem" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
              <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#111827" }}>{f.title}</p>
              <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <Link href="/pricing" style={{ background: "#2563eb", color: "#fff", padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: "none", display: "inline-block" }}>
            View pricing →
          </Link>
        </div>
      </section>

    </div>
  );
}
