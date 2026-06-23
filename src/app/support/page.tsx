"use client";

import { useState } from "react";

// ─────────────────────────────────────────────────────────────
// Slotrez — Support page
// Save this file to: src/app/support/page.tsx
// ─────────────────────────────────────────────────────────────

const CONTACT_CHANNELS = [
  {
    icon: "💬",
    title: "Live chat",
    desc: "Chat with a real person. Average response time: 3 minutes.",
    badge: "● Online now",
    badgeBg: "#eaf3de",
    badgeColor: "#3b6d11",
  },
  {
    icon: "📧",
    title: "Email support",
    desc: "support@slotrez.com — we respond within 4 hours on business days.",
    badge: "Mon–Fri 9am–8pm EST",
    badgeBg: "#eff6ff",
    badgeColor: "#1d4ed8",
  },
  {
    icon: "📞",
    title: "Phone support",
    desc: "Pro & Elite plans only. Call us directly for urgent issues.",
    badge: "Pro & Elite only",
    badgeBg: "#faeeda",
    badgeColor: "#854f0b",
  },
];

const HELP_CATS = [
  { icon: "🚀", title: "Getting started", desc: "Setup, onboarding, first booking" },
  { icon: "💳", title: "Payments & payouts", desc: "Stripe, deposits, refunds, fees" },
  { icon: "📅", title: "Bookings", desc: "Reschedule, cancel, no-shows" },
  { icon: "👥", title: "Clients & CRM", desc: "Notes, tags, loyalty, history" },
  { icon: "⚙️", title: "Account & settings", desc: "Profile, hours, intake forms" },
  { icon: "📦", title: "Plans & billing", desc: "Upgrade, downgrade, invoices" },
];

const FAQS = [
  {
    q: "How do I get paid as a business?",
    a: "Connect your bank account via Stripe Connect during onboarding. Slotrez automatically splits every payment — we take our platform fee (1–3.5% depending on your plan) and the rest is deposited to your bank every Friday. You can also request an instant payout any time for a small Stripe fee.",
  },
  {
    q: "What happens if a client doesn't show up?",
    a: "If you've enabled no-show fees in your booking policy, the client's saved card is automatically charged when you mark them as a no-show. The amount you choose (typically $15–$50) is deposited on your next payout cycle.",
  },
  {
    q: "Can I use Slotrez on my phone?",
    a: "Yes — Slotrez is fully mobile-responsive and works great on any phone browser. You can also add it to your home screen and it works like an app. A dedicated iOS and Android app is on our roadmap for 2025.",
  },
  {
    q: "How do I cancel or reschedule a booking?",
    a: "Clients can cancel or reschedule from their Slotrez account — subject to the business's cancellation policy. Within the free window it's instant and free. Outside the window, the cancellation fee is automatically applied. Businesses can also cancel on behalf of clients from their dashboard.",
  },
  {
    q: "Is my payment information secure?",
    a: "Yes — all payments are processed by Stripe, which is PCI DSS Level 1 certified (the highest level of payment security). Slotrez never stores your card number — it's handled entirely by Stripe's secure infrastructure.",
  },
  {
    q: "Can I switch plans at any time?",
    a: "Yes — upgrade or downgrade any time from your Plan & Billing page. Upgrades take effect immediately. Downgrades take effect at your next billing cycle. No penalties, no lock-in.",
  },
  {
    q: "Do my clients need a Slotrez account to book?",
    a: "Clients can browse without an account. To complete a booking they'll create a quick account (about 30 seconds with Google Sign In). This lets them track bookings, loyalty points, and payment history.",
  },
  {
    q: "What is the Slotrez platform fee?",
    a: "The Slotrez fee is a small percentage of each transaction: 3.5% on Free, 2.0% on Pro ($29/mo), and 1.0% on Elite ($79/mo). This is separate from Stripe's payment processing fee (2.9% + 30¢). Upgrading your plan significantly reduces your per-transaction cost.",
  },
];

const OPEN_ROLES = [
  { title: "Full Stack Developer", meta: "Remote · Full time · Next.js, Supabase, Stripe", status: "Hiring", statusBg: "#eaf3de", statusColor: "#3b6d11" },
  { title: "Customer Support Rep", meta: "Remote · Part time · $15–18/hr", status: "Hiring", statusBg: "#eaf3de", statusColor: "#3b6d11" },
  { title: "Sales Rep — SMB", meta: "Remote · Commission · $200–500 per tenant", status: "Hiring", statusBg: "#eaf3de", statusColor: "#3b6d11" },
  { title: "Marketing Manager", meta: "Remote · Full time · SEO, paid ads, content", status: "Coming soon", statusBg: "#faeeda", statusColor: "#854f0b" },
];

const TOPICS = [
  "Payments & payouts",
  "Booking issue",
  "Account & settings",
  "Plans & billing",
  "Technical issue",
  "Partnership inquiry",
  "Press inquiry",
  "Careers",
  "Other",
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production: POST to /api/support/contact
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", topic: TOPICS[0], message: "" });
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    border: "0.5px solid #d1d5db",
    borderRadius: 8,
    fontSize: 13,
    fontFamily: "inherit",
    background: "#fff",
    color: "#111827",
    boxSizing: "border-box",
    outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* ── Hero ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #1e3a8a 100%)",
          padding: "5rem 1.5rem 4rem",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, marginBottom: ".75rem", letterSpacing: "-.5px" }}>
          How can we help?
        </h1>
        <p style={{ fontSize: 15, opacity: 0.8, marginBottom: "1.5rem" }}>
          Search our help center or reach out to our team directly.
        </p>
        <div style={{ maxWidth: 500, margin: "0 auto", position: "relative" }}>
          <input
            placeholder="Search — e.g. 'how do I get paid'"
            style={{
              ...inputStyle,
              padding: "13px 16px 13px 44px",
              fontSize: 14,
              borderRadius: 10,
              border: "none",
              boxShadow: "0 4px 24px rgba(0,0,0,.25)",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 16,
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
        </div>
      </section>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 1.5rem" }}>

        {/* ── Contact channels ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 10,
            marginBottom: "3rem",
          }}
        >
          {CONTACT_CHANNELS.map((c) => (
            <div
              key={c.title}
              style={{
                background: "#fff",
                border: "0.5px solid #e5e7eb",
                borderRadius: 12,
                padding: "1.25rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 30, marginBottom: 10 }}>{c.icon}</div>
              <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#111827" }}>{c.title}</p>
              <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 10, lineHeight: 1.6 }}>{c.desc}</p>
              <span
                style={{
                  background: c.badgeBg,
                  color: c.badgeColor,
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                {c.badge}
              </span>
            </div>
          ))}
        </div>

        {/* ── Help categories ── */}
        <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Browse by topic
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 8,
            marginBottom: "3rem",
          }}
        >
          {HELP_CATS.map((cat) => (
            <div
              key={cat.title}
              style={{
                background: "#fff",
                border: "0.5px solid #e5e7eb",
                borderRadius: 12,
                padding: "1.25rem",
                cursor: "pointer",
                transition: "border-color .15s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2563eb")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb")}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{cat.icon}</div>
              <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 3, color: "#111827" }}>{cat.title}</p>
              <p style={{ fontSize: 11, color: "#9ca3af" }}>{cat.desc}</p>
            </div>
          ))}
        </div>

        {/* ── FAQ ── */}
        <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Frequently asked questions
        </p>
        <div style={{ marginBottom: "3rem" }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{
                border: "0.5px solid #e5e7eb",
                borderRadius: 10,
                marginBottom: 8,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%",
                  padding: "1rem",
                  fontSize: 13,
                  fontWeight: 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontFamily: "inherit",
                  color: "#111827",
                  textAlign: "left",
                  gap: 12,
                }}
              >
                <span>{faq.q}</span>
                <span style={{ fontSize: 12, color: "#9ca3af", flexShrink: 0, transition: "transform .2s", transform: openFaq === i ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
              </button>
              {openFaq === i && (
                <div
                  style={{
                    padding: "0 1rem 1rem",
                    fontSize: 13,
                    color: "#6b7280",
                    lineHeight: 1.8,
                    borderTop: "0.5px solid #f3f4f6",
                  }}
                >
                  <div style={{ paddingTop: ".75rem" }}>{faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Contact form ── */}
        <div
          id="contact-form"
          style={{
            background: "#fff",
            border: "0.5px solid #e5e7eb",
            borderRadius: 12,
            padding: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4, color: "#111827" }}>Send us a message</h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.5rem" }}>
            We&apos;ll get back to you within 4 hours on business days.
          </p>

          {sent ? (
            <div
              style={{
                background: "#eaf3de",
                border: "0.5px solid #b2d98a",
                borderRadius: 10,
                padding: "1.25rem",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 16, marginBottom: 4 }}>✅</p>
              <p style={{ fontWeight: 600, fontSize: 14, color: "#3b6d11", marginBottom: 4 }}>Message sent!</p>
              <p style={{ fontSize: 13, color: "#3b6d11" }}>We&apos;ll reply to your email within 4 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Name</label>
                  <input
                    required
                    placeholder="Alex Rivera"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Email</label>
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Topic</label>
                <select
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  style={inputStyle}
                >
                  {TOPICS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Message</label>
                <textarea
                  required
                  placeholder="Tell us what's going on..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  padding: "11px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Send message
              </button>
            </form>
          )}
        </div>

        {/* ── Open roles ── */}
        <div id="careers">
          <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
            Open roles
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {OPEN_ROLES.map((role) => (
              <div
                key={role.title}
                style={{
                  background: "#fff",
                  border: "0.5px solid #e5e7eb",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                  transition: "border-color .15s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2563eb")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb")}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 13, color: "#111827", marginBottom: 2 }}>{role.title}</p>
                  <p style={{ fontSize: 12, color: "#9ca3af" }}>{role.meta}</p>
                </div>
                <span
                  style={{
                    background: role.statusBg,
                    color: role.statusColor,
                    padding: "3px 10px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {role.status}
                </span>
                <span style={{ fontSize: 13, color: "#2563eb", whiteSpace: "nowrap" }}>Apply →</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
