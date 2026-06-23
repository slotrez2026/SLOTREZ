// ─────────────────────────────────────────────────────────────
// Slotrez — Pricing page
// Save to: src/app/pricing/page.tsx
// ─────────────────────────────────────────────────────────────

import Link from "next/link";

const PLANS = [
  {
    name: "Free", price: "$0", period: "", badge: "Always free",
    highlight: false, buttonLabel: "Get started free", buttonHref: "/register",
    fee: "3.5%",
    buttonStyle: { background: "none", border: "0.5px solid #d1d5db", color: "#374151" } as React.CSSProperties,
    badgeStyle: { background: "#f1efe8", color: "#5f5e5a" } as React.CSSProperties,
    features: [
      { label: "Public Slotrez listing",  locked: false },
      { label: "Online booking page",     locked: false },
      { label: "Up to 3 staff",           locked: false },
      { label: "In-app payments",         locked: false },
      { label: "Custom intake forms",     locked: true  },
      { label: "SMS reminders",           locked: true  },
      { label: "Loyalty program",         locked: true  },
      { label: "Analytics",               locked: true  },
    ],
  },
  {
    name: "Pro", price: "$29", period: " / mo", badge: "Most popular",
    highlight: true, buttonLabel: "Start free trial", buttonHref: "/register",
    fee: "2.0%",
    buttonStyle: { background: "#2563eb", border: "none", color: "#fff" } as React.CSSProperties,
    badgeStyle: { background: "#eff6ff", color: "#1d4ed8" } as React.CSSProperties,
    features: [
      { label: "Everything in Free",           locked: false },
      { label: "Up to 10 staff",               locked: false },
      { label: "Custom intake forms",          locked: false },
      { label: "Cancellation & no-show fees",  locked: false },
      { label: "SMS reminders",                locked: false },
      { label: "Loyalty program",              locked: false },
      { label: "Waitlist management",          locked: false },
      { label: "Analytics & reporting",        locked: false },
    ],
  },
  {
    name: "Elite", price: "$79", period: " / mo", badge: "For chains",
    highlight: false, buttonLabel: "Start Elite", buttonHref: "/register",
    fee: "1.0%",
    buttonStyle: { background: "#1a1a2e", border: "none", color: "#fff" } as React.CSSProperties,
    badgeStyle: { background: "#faeeda", color: "#854f0b" } as React.CSSProperties,
    features: [
      { label: "Everything in Pro",    locked: false },
      { label: "Unlimited staff",      locked: false },
      { label: "Multi-location",       locked: false },
      { label: "Branded mobile app",   locked: false },
      { label: "API access",           locked: false },
      { label: "Payroll integration",  locked: false },
      { label: "Priority support",     locked: false },
      { label: "White-label option",   locked: false },
    ],
  },
];

export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ padding: "3rem 1.5rem", maxWidth: 760, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-.5px", marginBottom: 8, color: "#111827" }}>
            Start free. Grow on your terms.
          </h1>
          <p style={{ fontSize: 14, color: "#6b7280" }}>No lock-in. Cancel any time.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
          {PLANS.map((plan) => (
            <div key={plan.name} style={{ background: "#fff", border: plan.highlight ? "2px solid #2563eb" : "0.5px solid #e5e7eb", borderRadius: 12, padding: "1.25rem" }}>
              <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", fontWeight: plan.highlight ? 600 : 400, color: plan.highlight ? "#2563eb" : "#9ca3af" }}>
                {plan.name}
              </p>
              <p style={{ fontSize: 28, fontWeight: 700, margin: "6px 0 4px", color: "#111827" }}>
                {plan.price}<span style={{ fontSize: 13, fontWeight: 400, color: "#6b7280" }}>{plan.period}</span>
              </p>
              <div style={{ marginBottom: 12 }}>
                <span style={{ ...plan.badgeStyle, display: "inline-block", padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                  {plan.badge}
                </span>
              </div>
              <Link href={plan.buttonHref}
                style={{ ...plan.buttonStyle, display: "block", width: "100%", padding: "9px", fontSize: 13, borderRadius: 8, cursor: "pointer", fontFamily: "inherit", marginBottom: "1rem", fontWeight: 500, textAlign: "center", textDecoration: "none", boxSizing: "border-box" as const }}>
                {plan.buttonLabel}
              </Link>
              <div style={{ fontSize: 12, display: "flex", flexDirection: "column" }}>
                {plan.features.map((f) => (
                  <div key={f.label} style={{ display: "flex", gap: 7, padding: "5px 0", borderBottom: "0.5px solid #f3f4f6", opacity: f.locked ? 0.4 : 1 }}>
                    <span>{f.locked ? "🔒" : "✓"}</span>
                    <span style={{ color: f.locked ? "#9ca3af" : "#374151" }}>{f.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "1rem", paddingTop: ".75rem", borderTop: "0.5px solid #f3f4f6", fontSize: 11, color: "#9ca3af" }}>
                Slotrez fee: <strong style={{ color: "#111827" }}>{plan.fee}</strong>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
