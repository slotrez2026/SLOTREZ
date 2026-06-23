"use client";

import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Portal = "home" | "browse" | "book" | "login" | "register" | "pricing";

// ─── Constants ───────────────────────────────────────────────────────────────

const PROS = [
  {
    initials: "MC",
    name: "Marcus Carr",
    role: "Barber",
    location: "Passaic, NJ",
    price: "$45/hr",
    rating: "4.9",
    reviews: 520,
    tags: ["Fades", "Lineups", "Shaves"],
    bg: "#faeeda",
    color: "#854f0b",
  },
  {
    initials: "SR",
    name: "Sofia Reyes",
    role: "Hair stylist",
    location: "Jersey City, NJ",
    price: "$90/hr",
    rating: "4.8",
    reviews: 340,
    tags: ["Color", "Cuts", "Keratin"],
    bg: "#e1f5ee",
    color: "#0f6e56",
  },
  {
    initials: "JM",
    name: "James Mitchell",
    role: "Personal trainer",
    location: "Hoboken, NJ",
    price: "$75/hr",
    rating: "4.9",
    reviews: 182,
    tags: ["Strength", "HIIT", "Nutrition"],
    bg: "#eff6ff",
    color: "#2563eb",
  },
  {
    initials: "PN",
    name: "Priya Nair",
    role: "Massage therapist",
    location: "Newark, NJ",
    price: "$85/hr",
    rating: "5.0",
    reviews: 210,
    tags: ["Swedish", "Deep tissue"],
    bg: "#fbeaf0",
    color: "#993556",
  },
];

const CATEGORIES = [
  { icon: "✂️", label: "Hair & beauty" },
  { icon: "🏋️", label: "Fitness" },
  { icon: "🏠", label: "Home" },
  { icon: "🧘", label: "Wellness" },
  { icon: "🐾", label: "Pet care" },
];

const FEATURES = [
  { icon: "🧩", title: "Fully customizable", desc: "Custom fields, forms & labels per industry" },
  { icon: "🔒", title: "Booking policies", desc: "Deposits, cancellations, no-show fees" },
  { icon: "📊", title: "Real analytics", desc: "Revenue, retention & top services" },
  { icon: "🔔", title: "Auto reminders", desc: "SMS & push cut no-shows by 60%" },
  { icon: "⭐", title: "Loyalty rewards", desc: "Points, tiers & perks for regulars" },
  { icon: "👥", title: "Client CRM", desc: "Notes, tags & history per client" },
];

const TIME_SLOTS = [
  "9:00 am", "10:00 am", "11:00 am", "1:00 pm",
  "2:00 pm", "3:00 pm", "4:00 pm", "5:00 pm",
];

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Logo({ size = 18, onClick }: { size?: number; onClick?: () => void }) {
  return (
    <span
      onClick={onClick}
      style={{
        fontSize: size,
        fontWeight: 700,
        cursor: onClick ? "pointer" : "default",
        letterSpacing: "-0.5px",
        userSelect: "none",
      }}
    >
      <span style={{ color: "#1a1a2e" }}>slot</span>
      <span style={{ color: "#2563eb" }}>rez</span>
    </span>
  );
}

function Tag({
  children,
  variant = "blue",
}: {
  children: React.ReactNode;
  variant?: "blue" | "green" | "amber" | "red" | "gray";
}) {
  const styles: Record<string, React.CSSProperties> = {
    blue: { background: "#eff6ff", color: "#1d4ed8" },
    green: { background: "#eaf3de", color: "#3b6d11" },
    amber: { background: "#faeeda", color: "#854f0b" },
    red: { background: "#fcebeb", color: "#a32d2d" },
    gray: { background: "#f1efe8", color: "#5f5e5a" },
  };
  return (
    <span
      style={{
        ...styles[variant],
        display: "inline-block",
        padding: "2px 9px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

function Button({
  children,
  variant = "outline",
  onClick,
  fullWidth,
  size = "md",
}: {
  children: React.ReactNode;
  variant?: "outline" | "primary" | "dark";
  onClick?: () => void;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const pad = size === "lg" ? "11px 26px" : size === "sm" ? "5px 12px" : "8px 16px";
  const fs = size === "lg" ? 14 : size === "sm" ? 12 : 13;

  const styles: Record<string, React.CSSProperties> = {
    outline: {
      background: "none",
      border: "0.5px solid #d1d5db",
      color: "#111827",
    },
    primary: {
      background: "#2563eb",
      border: "none",
      color: "#fff",
      fontWeight: 500,
    },
    dark: {
      background: "#1a1a2e",
      border: "none",
      color: "#fff",
    },
  };

  return (
    <button
      onClick={onClick}
      style={{
        ...styles[variant],
        padding: pad,
        borderRadius: 8,
        fontSize: fs,
        cursor: "pointer",
        fontFamily: "inherit",
        width: fullWidth ? "100%" : undefined,
        transition: "opacity 0.15s",
      }}
      onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "0.85")}
      onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "1")}
    >
      {children}
    </button>
  );
}

function Card({
  children,
  style,
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        border: "0.5px solid #e5e7eb",
        borderRadius: 12,
        padding: "1.25rem",
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav({
  page,
  setPage,
  loggedIn,
  setLoggedIn,
}: {
  page: Portal;
  setPage: (p: Portal) => void;
  loggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
}) {
  return (
    <nav
      style={{
        height: 52,
        background: "#fff",
        borderBottom: "0.5px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        padding: "0 1.5rem",
        gap: 6,
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <Logo onClick={() => setPage("home")} />

      {(["home", "browse", "pricing"] as Portal[]).map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          style={{
            background: page === p ? "#eff6ff" : "none",
            color: page === p ? "#2563eb" : "#6b7280",
            border: "none",
            fontSize: 13,
            padding: "6px 10px",
            borderRadius: 7,
            cursor: "pointer",
            fontFamily: "inherit",
            textTransform: "capitalize",
          }}
        >
          {p === "home" ? "Home" : p === "browse" ? "Discover" : "Pricing"}
        </button>
      ))}

      <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
        {loggedIn ? (
          <>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#eff6ff",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              AR
            </div>
            <Button variant="outline" size="sm" onClick={() => setLoggedIn(false)}>
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setPage("login")}>Log in</Button>
            <Button variant="dark" onClick={() => setPage("register")}>Get started free</Button>
          </>
        )}
      </div>
    </nav>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage({ setPage }: { setPage: (p: Portal) => void }) {
  return (
    <div>
      {/* Hero */}
      <div
        style={{
          textAlign: "center",
          padding: "4rem 1.5rem 3rem",
          maxWidth: 680,
          margin: "0 auto",
        }}
      >
        <span
          style={{
            display: "inline-block",
            background: "#eff6ff",
            color: "#1d4ed8",
            padding: "3px 14px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 500,
            marginBottom: "1.25rem",
          }}
        >
          Universal booking platform
        </span>

        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 46px)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            marginBottom: "1rem",
            color: "#111827",
          }}
        >
          <span style={{ color: "#1a1a2e" }}>slot</span>
          <span style={{ color: "#2563eb" }}>rez</span>
          {" — one platform"}
          <br />
          for every service.
        </h1>

        <p
          style={{
            fontSize: 16,
            color: "#6b7280",
            lineHeight: 1.7,
            marginBottom: "2rem",
            maxWidth: 480,
            margin: "0 auto 2rem",
          }}
        >
          Barbers, trainers, cleaners, therapists and more. Run your entire
          business and let clients reserve in seconds.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="primary" size="lg" onClick={() => setPage("browse")}>
            Find a professional
          </Button>
          <Button variant="outline" size="lg" onClick={() => setPage("register")}>
            List your business — free
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: "0 1.5rem 3rem", maxWidth: 680, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 11,
            color: "#9ca3af",
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "1rem",
          }}
        >
          Browse by category
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              onClick={() => setPage("browse")}
              style={{
                textAlign: "center",
                padding: ".75rem .5rem",
                border: "0.5px solid #e5e7eb",
                borderRadius: 12,
                cursor: "pointer",
                background: "#fff",
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "#2563eb")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb")
              }
            >
              <div style={{ fontSize: 24 }}>{cat.icon}</div>
              <p style={{ fontSize: 11, fontWeight: 500, marginTop: 6, color: "#374151" }}>
                {cat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div
        style={{
          background: "#fff",
          borderTop: "0.5px solid #e5e7eb",
          borderBottom: "0.5px solid #e5e7eb",
          padding: "2rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            textAlign: "center",
          }}
        >
          {[
            ["12,000+", "Active pros"],
            ["40+", "Categories"],
            ["99.9%", "Uptime"],
            ["Free", "To start"],
          ].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#2563eb" }}>{val}</div>
              <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "3rem 1.5rem", maxWidth: 680, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 11,
            textAlign: "center",
            color: "#9ca3af",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "1.5rem",
          }}
        >
          Everything your business needs
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 10,
            marginBottom: "2rem",
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                background: "#fff",
                border: "0.5px solid #e5e7eb",
                borderRadius: 10,
                padding: "1rem",
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 8 }}>{f.icon}</div>
              <p style={{ fontWeight: 500, fontSize: 13, marginBottom: 4 }}>{f.title}</p>
              <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Button variant="primary" onClick={() => setPage("pricing")}>
            View pricing →
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Browse Page ──────────────────────────────────────────────────────────────

function BrowsePage({ setPage }: { setPage: (p: Portal) => void }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Hair", "Fitness", "Home", "Wellness", "Pets"];

  return (
    <div style={{ padding: "1.5rem", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: "1.25rem", color: "#111827" }}>
        Find a professional
      </h1>

      {/* Search */}
      <div style={{ display: "flex", gap: 8, marginBottom: ".75rem" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services or professionals..."
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "0.5px solid #d1d5db",
            borderRadius: 8,
            fontSize: 13,
            fontFamily: "inherit",
            color: "#111827",
            outline: "none",
          }}
        />
        <select
          style={{
            padding: "8px 10px",
            border: "0.5px solid #d1d5db",
            borderRadius: 8,
            fontSize: 13,
            fontFamily: "inherit",
            color: "#111827",
            background: "#fff",
          }}
        >
          <option>All categories</option>
          <option>Hair & beauty</option>
          <option>Fitness</option>
          <option>Home services</option>
          <option>Wellness</option>
          <option>Pet care</option>
        </select>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: "5px 13px",
              borderRadius: 20,
              fontSize: 12,
              border: "0.5px solid",
              borderColor: activeFilter === f ? "#2563eb" : "#d1d5db",
              background: activeFilter === f ? "#2563eb" : "none",
              color: activeFilter === f ? "#fff" : "#6b7280",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Pro cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {PROS.map((pro) => (
          <div
            key={pro.name}
            onClick={() => setPage("book")}
            style={{
              background: "#fff",
              border: "0.5px solid #e5e7eb",
              borderRadius: 10,
              padding: "1rem",
              display: "flex",
              gap: 12,
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor = "#2563eb")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb")
            }
          >
            {/* Avatar */}
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: pro.bg,
                color: pro.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: 15,
                flexShrink: 0,
              }}
            >
              {pro.initials}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{pro.name}</p>
                  <p style={{ fontSize: 12, color: "#6b7280" }}>
                    {pro.role} · {pro.location}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#2563eb" }}>{pro.price}</p>
                  <p style={{ fontSize: 11, color: "#9ca3af" }}>
                    ★ {pro.rating} ({pro.reviews})
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" }}>
                {pro.tags.map((tag) => (
                  <Tag key={tag} variant="blue">
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Book Page ────────────────────────────────────────────────────────────────

function BookPage({
  setPage,
  setLoggedIn,
}: {
  setPage: (p: Portal) => void;
  setLoggedIn: (v: boolean) => void;
}) {
  const [selectedSlot, setSelectedSlot] = useState("11:00 am");
  const [confirmed, setConfirmed] = useState(false);

  function handleConfirm() {
    setConfirmed(true);
    setLoggedIn(true);
    setTimeout(() => setPage("home"), 2500);
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: 520, margin: "0 auto" }}>
      {/* Back */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
        <Button variant="outline" size="sm" onClick={() => setPage("browse")}>
          ← Back
        </Button>
        <p style={{ fontSize: 14, fontWeight: 500 }}>Book with Marcus Carr</p>
      </div>

      {/* Steps */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1.5rem" }}
      >
        {["Service", "Intake", "Time", "Confirm"].map((step, i) => (
          <div key={step} style={{ display: "flex", alignItems: "center", gap: 6, flex: i < 3 ? "1" : undefined }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: i < 2 ? "#2563eb" : i === 2 ? "#eff6ff" : "#f3f4f6",
                color: i < 2 ? "#fff" : i === 2 ? "#2563eb" : "#9ca3af",
                border: i === 2 ? "1.5px solid #2563eb" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {i < 2 ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 10, color: i === 2 ? "#2563eb" : "#9ca3af", fontWeight: i === 2 ? 600 : 400 }}>
              {step}
            </span>
            {i < 3 && (
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            )}
          </div>
        ))}
      </div>

      {confirmed ? (
        <Card style={{ textAlign: "center", padding: "2.5rem" }}>
          <div style={{ fontSize: 48, marginBottom: "1rem" }}>🎉</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: ".5rem" }}>Rez confirmed!</h2>
          <p style={{ color: "#6b7280", fontSize: 13 }}>
            Marcus Carr · Fade + taper · Jun 24 at {selectedSlot}
          </p>
          <p style={{ color: "#3b6d11", fontSize: 12, marginTop: ".5rem", fontWeight: 500 }}>
            +35 loyalty pts earned ⭐
          </p>
        </Card>
      ) : (
        <>
          {/* Intake summary */}
          <Card style={{ marginBottom: "1rem", background: "#eff6ff", borderColor: "#93c5fd" }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: "#1d4ed8", marginBottom: ".5rem" }}>
              📋 Intake form — answered
            </p>
            <div style={{ fontSize: 12, color: "#1d4ed8", display: "flex", flexDirection: "column", gap: 3 }}>
              <p>Style: <strong>Fade with taper</strong></p>
              <p>Hair type: <strong>Coarse, thick</strong></p>
              <p>Notes: <strong>Leave length on top</strong></p>
            </div>
          </Card>

          {/* Time picker */}
          <Card style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: ".75rem" }}>
              Pick a time — Tue Jun 24
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 7 }}>
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  style={{
                    padding: 7,
                    border: "0.5px solid",
                    borderColor: selectedSlot === slot ? "#2563eb" : "#d1d5db",
                    borderRadius: 7,
                    fontSize: 12,
                    cursor: "pointer",
                    background: selectedSlot === slot ? "#2563eb" : "none",
                    color: selectedSlot === slot ? "#fff" : "#374151",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </Card>

          {/* Price breakdown */}
          <Card style={{ marginBottom: "1rem", fontSize: 13 }}>
            {[
              ["Fade + taper", "$35.00", false],
              ["Deposit (due now)", "$10.00", true],
              ["Loyalty points earned", "+35 pts", true, "#3b6d11"],
              ["Slotrez fee", "$1.00", true],
            ].map(([label, val, muted, customColor]) => (
              <div
                key={label as string}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 7,
                  color: muted ? (customColor as string || "#6b7280") : "#111827",
                }}
              >
                <span>{label}</span>
                <span>{val}</span>
              </div>
            ))}
            <div
              style={{
                borderTop: "0.5px solid #e5e7eb",
                paddingTop: 8,
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              <span>Due now</span>
              <span>$11.00</span>
            </div>
          </Card>

          {/* Policy */}
          <Card style={{ marginBottom: "1rem", fontSize: 12, color: "#6b7280", lineHeight: 1.7 }}>
            <p style={{ fontWeight: 500, color: "#111827", marginBottom: 6, fontSize: 13 }}>
              Booking policy
            </p>
            <p>📅 Free cancellation up to <strong>24 hrs</strong>. $15 fee after.</p>
            <p>🚫 No-show fee: <strong>$30</strong>.</p>
          </Card>

          <Button variant="primary" fullWidth onClick={handleConfirm}>
            Confirm & pay $11.00
          </Button>
        </>
      )}
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

// ─── 2FA Code Input ───────────────────────────────────────────────────────────

function TwoFAInput({
  title,
  subtitle,
  maskedContact,
  onVerify,
  onBack,
  onResend,
}: {
  title: string;
  subtitle: string;
  maskedContact: string;
  onVerify: () => void;
  onBack: () => void;
  onResend: () => void;
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendCount, setResendCount] = useState(30);
  const [resent, setResent] = useState(false);
  const refs = Array.from({ length: 6 }, () => null) as Array<HTMLInputElement | null>;

  // Countdown timer
  useState(() => {
    const timer = setInterval(() => {
      setResendCount((c) => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  });

  function handleDigit(i: number, val: string) {
    const cleaned = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = cleaned;
    setDigits(next);
    setError(false);
    if (cleaned && i < 5) refs[i + 1]?.focus();
    if (!cleaned && i > 0) refs[i - 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      refs[5]?.focus();
    }
  }

  function handleVerify() {
    const code = digits.join("");
    // In production this calls your backend/Supabase. Demo: any 6 digits work.
    if (code.length === 6) {
      setSuccess(true);
      setTimeout(onVerify, 1200);
    } else {
      setError(true);
      setDigits(["", "", "", "", "", ""]);
      refs[0]?.focus();
    }
  }

  function handleResend() {
    setResendCount(30);
    setResent(true);
    onResend();
    setTimeout(() => setResent(false), 3000);
  }

  return (
    <div style={{ maxWidth: 400, margin: "3rem auto", padding: "0 1.5rem" }}>
      <Card>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <Logo size={24} />
        </div>

        {success ? (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#eaf3de",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                fontSize: 26,
              }}
            >
              ✓
            </div>
            <p style={{ fontWeight: 600, fontSize: 16, color: "#111827", marginBottom: 4 }}>Verified!</p>
            <p style={{ fontSize: 13, color: "#6b7280" }}>Signing you in to Slotrez...</p>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  fontSize: 24,
                }}
              >
                📱
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{title}</h2>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{subtitle}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#2563eb", marginTop: 4 }}>
                {maskedContact}
              </p>
            </div>

            {/* 6 digit boxes */}
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { refs[i] = el; }}
                  value={d}
                  maxLength={1}
                  inputMode="numeric"
                  onChange={(e) => handleDigit(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !d && i > 0) refs[i - 1]?.focus();
                  }}
                  onPaste={handlePaste}
                  style={{
                    width: 44,
                    height: 52,
                    textAlign: "center",
                    fontSize: 22,
                    fontWeight: 600,
                    border: `${error ? "1.5px solid #ef4444" : d ? "1.5px solid #2563eb" : "0.5px solid #d1d5db"}`,
                    borderRadius: 10,
                    background: d ? "#eff6ff" : "#fff",
                    color: "#111827",
                    fontFamily: "inherit",
                    outline: "none",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                />
              ))}
            </div>

            {/* Error message */}
            {error && (
              <p style={{ textAlign: "center", fontSize: 12, color: "#ef4444", marginBottom: "1rem" }}>
                ⚠️ Invalid code. Please try again.
              </p>
            )}

            {/* Resent confirmation */}
            {resent && (
              <p style={{ textAlign: "center", fontSize: 12, color: "#3b6d11", marginBottom: "1rem" }}>
                ✓ New code sent!
              </p>
            )}

            {/* Verify button */}
            <Button
              variant={digits.join("").length === 6 ? "primary" : "outline"}
              fullWidth
              onClick={handleVerify}
            >
              Verify & continue
            </Button>

            {/* Resend */}
            <p style={{ textAlign: "center", marginTop: "1rem", fontSize: 12, color: "#6b7280" }}>
              Didn't receive a code?{" "}
              {resendCount > 0 ? (
                <span style={{ color: "#9ca3af" }}>Resend in {resendCount}s</span>
              ) : (
                <span
                  style={{ color: "#2563eb", cursor: "pointer", fontWeight: 500 }}
                  onClick={handleResend}
                >
                  Resend code
                </span>
              )}
            </p>

            {/* Back */}
            <p
              style={{
                textAlign: "center",
                marginTop: ".5rem",
                fontSize: 12,
                color: "#2563eb",
                cursor: "pointer",
              }}
              onClick={onBack}
            >
              ← Use a different account
            </p>
          </>
        )}
      </Card>
    </div>
  );
}

// ─── Login Page (with 2FA) ────────────────────────────────────────────────────

function LoginPage({
  setPage,
  setLoggedIn,
}: {
  setPage: (p: Portal) => void;
  setLoggedIn: (v: boolean) => void;
}) {
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "7px 10px",
    border: "0.5px solid #d1d5db",
    borderRadius: 8,
    fontSize: 13,
    fontFamily: "inherit",
    boxSizing: "border-box",
    outline: "none",
  };

  if (step === "2fa") {
    return (
      <TwoFAInput
        title="Two-factor authentication"
        subtitle="We sent a 6-digit code to your phone."
        maskedContact="••• ••• 0192"
        onVerify={() => { setLoggedIn(true); setPage("home"); }}
        onBack={() => setStep("credentials")}
        onResend={() => console.log("resend")}
      />
    );
  }

  return (
    <div style={{ maxWidth: 380, margin: "3rem auto", padding: "0 1.5rem" }}>
      <Card>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <Logo size={24} />
        </div>
        <h1 style={{ fontSize: 19, fontWeight: 600, marginBottom: 4 }}>Welcome back</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.25rem" }}>
          Sign in to your Slotrez account
        </p>

        <div style={{ marginBottom: ".85rem" }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: ".85rem" }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputStyle}
          />
        </div>

        <div style={{ textAlign: "right", marginBottom: "1rem" }}>
          <span style={{ fontSize: 12, color: "#2563eb", cursor: "pointer" }}>Forgot password?</span>
        </div>

        {/* 2FA notice */}
        <div
          style={{
            background: "#eff6ff",
            border: "0.5px solid #93c5fd",
            borderRadius: 8,
            padding: "9px 12px",
            fontSize: 12,
            color: "#1d4ed8",
            marginBottom: "1rem",
            lineHeight: 1.6,
          }}
        >
          🔐 After signing in, we'll send a verification code to your phone for security.
        </div>

        <Button variant="primary" fullWidth onClick={() => setStep("2fa")}>
          Continue →
        </Button>

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: 13, color: "#6b7280" }}>
          No account?{" "}
          <span style={{ color: "#2563eb", cursor: "pointer" }} onClick={() => setPage("register")}>
            Sign up free
          </span>
        </p>
      </Card>
    </div>
  );
}

// ─── Register Page ────────────────────────────────────────────────────────────

function RegisterPage({
  setPage,
  setLoggedIn,
}: {
  setPage: (p: Portal) => void;
  setLoggedIn: (v: boolean) => void;
}) {
  const [role, setRole] = useState<"client" | "biz">("client");
  const [step, setStep] = useState<"details" | "phone" | "2fa">("details");
  const [phone, setPhone] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "7px 10px",
    border: "0.5px solid #d1d5db",
    borderRadius: 8,
    fontSize: 13,
    fontFamily: "inherit",
    boxSizing: "border-box",
    outline: "none",
  };

  // Step 3 — 2FA verify
  if (step === "2fa") {
    const masked = phone
      ? `(${phone.slice(0, 3)}) ••• ${phone.slice(-4)}`
      : "••• ••• 0192";
    return (
      <TwoFAInput
        title="Verify your phone"
        subtitle="We sent a 6-digit code to confirm your number."
        maskedContact={masked}
        onVerify={() => { setLoggedIn(true); setPage("home"); }}
        onBack={() => setStep("phone")}
        onResend={() => console.log("resend")}
      />
    );
  }

  // Step 2 — Add phone
  if (step === "phone") {
    return (
      <div style={{ maxWidth: 400, margin: "3rem auto", padding: "0 1.5rem" }}>
        <Card>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <Logo size={24} />
          </div>

          {/* Progress dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: "1.5rem" }}>
            {["Account", "Phone", "Verify"].map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: i === 0 ? "#2563eb" : i === 1 ? "#eff6ff" : "#f3f4f6",
                    color: i === 0 ? "#fff" : i === 1 ? "#2563eb" : "#9ca3af",
                    border: i === 1 ? "1.5px solid #2563eb" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {i === 0 ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 10, color: i === 1 ? "#2563eb" : "#9ca3af", fontWeight: i === 1 ? 600 : 400 }}>
                  {s}
                </span>
                {i < 2 && <div style={{ width: 18, height: 1, background: "#e5e7eb" }} />}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                fontSize: 24,
              }}
            >
              📱
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Add your phone number</h2>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
              Used for two-factor authentication and booking reminders. We'll never spam you.
            </p>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>
              Phone number
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <select
                style={{
                  padding: "7px 10px",
                  border: "0.5px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 13,
                  fontFamily: "inherit",
                  background: "#fff",
                  color: "#374151",
                  flexShrink: 0,
                }}
              >
                <option>🇺🇸 +1</option>
                <option>🇲🇽 +52</option>
                <option>🇬🇧 +44</option>
                <option>🇨🇦 +1</option>
              </select>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="(201) 555-0192"
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>
          </div>

          <div
            style={{
              background: "#f9fafb",
              border: "0.5px solid #e5e7eb",
              borderRadius: 8,
              padding: "9px 12px",
              fontSize: 12,
              color: "#6b7280",
              marginBottom: "1.25rem",
              lineHeight: 1.6,
            }}
          >
            🔐 Slotrez uses SMS-based 2FA to protect your account and payments.
          </div>

          <Button variant="primary" fullWidth onClick={() => setStep("2fa")}>
            Send verification code
          </Button>

          <p
            style={{
              textAlign: "center",
              marginTop: ".75rem",
              fontSize: 12,
              color: "#2563eb",
              cursor: "pointer",
            }}
            onClick={() => setStep("details")}
          >
            ← Back
          </p>
        </Card>
      </div>
    );
  }

  // Step 1 — Account details
  return (
    <div style={{ maxWidth: 440, margin: "2.5rem auto", padding: "0 1.5rem" }}>
      <Card>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <Logo size={24} />
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: "1.5rem" }}>
          {["Account", "Phone", "Verify"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: i === 0 ? "#eff6ff" : "#f3f4f6",
                  color: i === 0 ? "#2563eb" : "#9ca3af",
                  border: i === 0 ? "1.5px solid #2563eb" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <span style={{ fontSize: 10, color: i === 0 ? "#2563eb" : "#9ca3af", fontWeight: i === 0 ? 600 : 400 }}>
                {s}
              </span>
              {i < 2 && <div style={{ width: 18, height: 1, background: "#e5e7eb" }} />}
            </div>
          ))}
        </div>

        <h1 style={{ fontSize: 19, fontWeight: 600, marginBottom: 4 }}>Create your account</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.25rem" }}>
          Join Slotrez as a client or a business
        </p>

        {/* Role toggle */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "1.25rem" }}>
          {(["client", "biz"] as const).map((r) => (
            <div
              key={r}
              onClick={() => setRole(r)}
              style={{
                padding: 12,
                border: `${role === r ? "2px" : "0.5px"} solid ${role === r ? "#2563eb" : "#d1d5db"}`,
                borderRadius: 9,
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 4 }}>{r === "client" ? "👤" : "🏪"}</div>
              <p style={{ fontSize: 13, fontWeight: 500 }}>{r === "client" ? "Client" : "Business"}</p>
              <p style={{ fontSize: 11, color: "#9ca3af" }}>
                {r === "client" ? "Book services" : "Accept bookings"}
              </p>
            </div>
          ))}
        </div>

        {/* Name fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {["First name", "Last name"].map((f) => (
            <div key={f} style={{ marginBottom: ".85rem" }}>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>{f}</label>
              <input
                placeholder={f === "First name" ? "Alex" : "Rivera"}
                style={inputStyle}
              />
            </div>
          ))}
        </div>

        {["Email", "Password"].map((f) => (
          <div key={f} style={{ marginBottom: ".85rem" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>{f}</label>
            <input
              type={f === "Password" ? "password" : "email"}
              placeholder={f === "Email" ? "you@example.com" : "Min. 8 characters"}
              style={inputStyle}
            />
          </div>
        ))}

        {role === "biz" && (
          <div style={{ marginBottom: ".85rem" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Business name</label>
            <input placeholder="Your shop or studio name" style={inputStyle} />
          </div>
        )}

        <Button variant="primary" fullWidth onClick={() => setStep("phone")}>
          Continue →
        </Button>

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: 13, color: "#6b7280" }}>
          Already have an account?{" "}
          <span style={{ color: "#2563eb", cursor: "pointer" }} onClick={() => setPage("login")}>
            Log in
          </span>
        </p>
      </Card>
    </div>
  );
}

// ─── Pricing Page ─────────────────────────────────────────────────────────────

function PricingPage({ setPage }: { setPage: (p: Portal) => void }) {
  const plans = [
    {
      name: "Free",
      price: "$0",
      badge: "Always free",
      badgeVariant: "gray" as const,
      buttonLabel: "Get started free",
      buttonVariant: "outline" as const,
      fee: "3.5%",
      highlight: false,
      features: [
        { label: "Public Slotrez listing", locked: false },
        { label: "Online booking page", locked: false },
        { label: "Up to 3 staff", locked: false },
        { label: "In-app payments", locked: false },
        { label: "Custom intake forms", locked: true },
        { label: "SMS reminders", locked: true },
        { label: "Loyalty program", locked: true },
        { label: "Analytics", locked: true },
      ],
    },
    {
      name: "Pro",
      price: "$29",
      badge: "Most popular",
      badgeVariant: "blue" as const,
      buttonLabel: "Start free trial",
      buttonVariant: "primary" as const,
      fee: "2.0%",
      highlight: true,
      features: [
        { label: "Everything in Free", locked: false },
        { label: "Up to 10 staff", locked: false },
        { label: "Custom intake forms", locked: false },
        { label: "Cancellation & no-show fees", locked: false },
        { label: "SMS reminders", locked: false },
        { label: "Loyalty program", locked: false },
        { label: "Waitlist management", locked: false },
        { label: "Analytics & reporting", locked: false },
      ],
    },
    {
      name: "Elite",
      price: "$79",
      badge: "For chains",
      badgeVariant: "amber" as const,
      buttonLabel: "Start Elite",
      buttonVariant: "dark" as const,
      fee: "1.0%",
      highlight: false,
      features: [
        { label: "Everything in Pro", locked: false },
        { label: "Unlimited staff", locked: false },
        { label: "Multi-location", locked: false },
        { label: "Branded mobile app", locked: false },
        { label: "API access", locked: false },
        { label: "Payroll integration", locked: false },
        { label: "Priority support", locked: false },
        { label: "White-label option", locked: false },
      ],
    },
  ];

  return (
    <div style={{ padding: "3rem 1.5rem", maxWidth: 760, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Logo size={22} />
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-.5px", margin: "1rem 0 6px" }}>
          Start free. Grow on your terms.
        </h1>
        <p style={{ fontSize: 13, color: "#6b7280" }}>No lock-in. Cancel any time.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {plans.map((plan) => (
          <Card
            key={plan.name}
            style={{ border: plan.highlight ? "2px solid #2563eb" : undefined }}
          >
            <p style={{ fontSize: 11, color: plan.highlight ? "#2563eb" : "#9ca3af", textTransform: "uppercase", letterSpacing: "1px", fontWeight: plan.highlight ? 600 : 400 }}>
              {plan.name}
            </p>
            <p style={{ fontSize: 28, fontWeight: 700, margin: "6px 0 4px" }}>
              {plan.price}
              <span style={{ fontSize: 13, fontWeight: 400, color: "#6b7280" }}> / mo</span>
            </p>
            <div style={{ marginBottom: 12 }}>
              <Tag variant={plan.badgeVariant}>{plan.badge}</Tag>
            </div>
            <Button variant={plan.buttonVariant} fullWidth onClick={() => setPage("register")}>
              {plan.buttonLabel}
            </Button>

            <div style={{ fontSize: 12, marginTop: "1rem", display: "flex", flexDirection: "column", gap: 0 }}>
              {plan.features.map((f) => (
                <div
                  key={f.label}
                  style={{
                    display: "flex",
                    gap: 7,
                    padding: "5px 0",
                    borderBottom: "0.5px solid #f3f4f6",
                    opacity: f.locked ? 0.45 : 1,
                  }}
                >
                  <span>{f.locked ? "🔒" : "✓"}</span>
                  <span style={{ color: f.locked ? "#9ca3af" : "#374151" }}>{f.label}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "1rem", paddingTop: ".75rem", borderTop: "0.5px solid #f3f4f6", fontSize: 11, color: "#6b7280" }}>
              Slotrez fee: <strong style={{ color: "#111827" }}>{plan.fee}</strong>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function SlotrezApp() {
  const [page, setPage] = useState<Portal>("home");
  const [loggedIn, setLoggedIn] = useState(false);

  const renderPage = () => {
    switch (page) {
      case "home":     return <HomePage setPage={setPage} />;
      case "browse":   return <BrowsePage setPage={setPage} />;
      case "book":     return <BookPage setPage={setPage} setLoggedIn={setLoggedIn} />;
      case "login":    return <LoginPage setPage={setPage} setLoggedIn={setLoggedIn} />;
      case "register": return <RegisterPage setPage={setPage} setLoggedIn={setLoggedIn} />;
      case "pricing":  return <PricingPage setPage={setPage} />;
      default:         return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Nav page={page} setPage={setPage} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <main>{renderPage()}</main>
    </div>
  );
}
