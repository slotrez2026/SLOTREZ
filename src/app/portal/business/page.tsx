"use client";

// ─────────────────────────────────────────────────────────────
// Slotrez — Business Portal
// Save to: src/app/portal/business/page.tsx
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Tab = "dashboard" | "calendar" | "clients" | "services" | "staff" | "payments" | "settings";

interface Business {
  id: string;
  name: string;
  plan: string;
  category: string;
  description: string;
  address: string;
  onboarding_steps: string[];
}

interface Service {
  id: string;
  name: string;
  duration_mins: number;
  price: number;
  active: boolean;
}

interface Client {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
}

// ── Shared styles ─────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "#fff",
  border: "0.5px solid #e5e7eb",
  borderRadius: 12,
  padding: "1.25rem",
};

const btnPrimary: React.CSSProperties = {
  background: "#2563eb", color: "#fff", border: "none",
  padding: "9px 18px", borderRadius: 8, fontSize: 13,
  fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
};

const btnOutline: React.CSSProperties = {
  background: "#fff", border: "0.5px solid #d1d5db", color: "#374151",
  padding: "9px 18px", borderRadius: 8, fontSize: 13,
  cursor: "pointer", fontFamily: "inherit",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px",
  border: "0.5px solid #d1d5db", borderRadius: 8,
  fontSize: 13, fontFamily: "inherit",
  outline: "none", boxSizing: "border-box",
  background: "#fff", color: "#111827",
};

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, React.CSSProperties> = {
    pro:   { background: "#eff6ff", color: "#1d4ed8" },
    elite: { background: "#faeeda", color: "#854f0b" },
    free:  { background: "#f1efe8", color: "#5f5e5a" },
  };
  return (
    <span style={{ ...(styles[plan] || styles.free), padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
      {plan === "free" ? "Starter" : plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  );
}

function LockedFeature({ feature, requiredPlan }: { feature: string; requiredPlan: string }) {
  return (
    <div style={{ background: "#f9fafb", border: "0.5px dashed #d1d5db", borderRadius: 10, padding: "1.5rem", textAlign: "center" }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
      <p style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 6 }}>{feature}</p>
      <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: "1rem", lineHeight: 1.6 }}>
        This feature is available on the {requiredPlan} plan and above.
      </p>
      <button
        onClick={() => window.location.href = "/pricing"}
        style={{ ...btnPrimary, fontSize: 12, padding: "7px 16px" }}>
        Upgrade to {requiredPlan} →
      </button>
    </div>
  );
}

function StatCard({ label, value, sub, color = "#111827" }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 10, padding: "1rem" }}>
      <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 700, color }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{sub}</p>}
    </div>
  );
}

export default function BusinessPortalPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Service form
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [newService, setNewService] = useState({ name: "", duration_mins: 30, price: 0 });
  const [addingService, setAddingService] = useState(false);

  // Settings form
  const [bizName, setBizName] = useState("");
  const [bizDesc, setBizDesc] = useState("");
  const [bizAddress, setBizAddress] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = "/login"; return; }

      // Get business for this owner
      const { data: bizData, error } = await supabase
        .from("businesses")
        .select("id, name, plan, category, description, address, onboarding_steps")
        .eq("owner_id", session.user.id)
        .single();

      if (error || !bizData) {
        // No business yet — send to onboarding
        window.location.href = "/onboarding";
        return;
      }

      setBusiness(bizData);
      setBizName(bizData.name || "");
      setBizDesc(bizData.description || "");
      setBizAddress(bizData.address || "");

      // Load services
      const { data: svcData } = await supabase
        .from("services")
        .select("id, name, duration_mins, price, active")
        .eq("business_id", bizData.id)
        .order("created_at", { ascending: false });

      // Load clients (profiles who have booked with this business)
      const { data: clientData } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone, created_at")
        .limit(50);

      setServices((svcData as Service[]) || []);
      setClients((clientData as Client[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSaveSettings() {
    if (!business) return;
    setSaving(true);
    await supabase
      .from("businesses")
      .update({ name: bizName, description: bizDesc, address: bizAddress })
      .eq("id", business.id);
    setBusiness({ ...business, name: bizName, description: bizDesc, address: bizAddress });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleAddService() {
    if (!business || !newService.name) return;
    setAddingService(true);
    const { data } = await supabase
      .from("services")
      .insert({ business_id: business.id, ...newService, active: true })
      .select()
      .single();
    if (data) setServices([data as Service, ...services]);
    setNewService({ name: "", duration_mins: 30, price: 0 });
    setShowServiceForm(false);
    setAddingService(false);
  }

  async function toggleService(id: string, active: boolean) {
    await supabase.from("services").update({ active: !active }).eq("id", id);
    setServices(services.map(s => s.id === id ? { ...s, active: !active } : s));
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const plan = business?.plan || "free";
  const isPro = plan === "pro" || plan === "elite";
  const isElite = plan === "elite";
  const firstName = business?.name?.split(" ")[0] || "there";

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard",  icon: "📊" },
    { id: "calendar",  label: "Calendar",   icon: "📅" },
    { id: "clients",   label: "Clients",    icon: "👥" },
    { id: "services",  label: "Services",   icon: "🛎️" },
    { id: "staff",     label: "Staff",      icon: "👤" },
    { id: "payments",  label: "Payments",   icon: "💳" },
    { id: "settings",  label: "Settings",   icon: "⚙️" },
  ];

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f9fafb", fontFamily: "system-ui,-apple-system,sans-serif", gap: 16 }}>
      <div style={{ fontSize: 24, fontWeight: 700 }}><span style={{ color: "#1a1a2e" }}>slot</span><span style={{ color: "#2563eb" }}>rez</span></div>
      <div style={{ width: 28, height: 28, border: "3px solid #e5e7eb", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-.5px" }}>
              <span style={{ color: "#1a1a2e" }}>slot</span><span style={{ color: "#2563eb" }}>rez</span>
            </div>
            <span style={{ color: "#9ca3af", fontSize: 13 }}>·</span>
            <p style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>{business?.name}</p>
            <PlanBadge plan={plan} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setTab("settings")} style={{ ...btnOutline, fontSize: 12, padding: "6px 12px" }}>⚙️ Settings</button>
            <button onClick={handleSignOut} style={{ ...btnOutline, fontSize: 12, padding: "6px 12px" }}>Sign out</button>
          </div>
        </div>

        {/* ── Tab nav ── */}
        <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "7px 14px", borderRadius: 20, fontSize: 13, border: "0.5px solid", borderColor: tab === t.id ? "#2563eb" : "#d1d5db", background: tab === t.id ? "#2563eb" : "#fff", color: tab === t.id ? "#fff" : "#6b7280", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* ══ DASHBOARD ══ */}
        {tab === "dashboard" && (
          <div>
            <div style={{ background: "linear-gradient(135deg, #1a1a2e, #1e3a8a)", borderRadius: 12, padding: "1.25rem", color: "#fff", marginBottom: "1.25rem" }}>
              <p style={{ fontSize: 11, opacity: .6, textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: 4 }}>Good day 👋</p>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Welcome back, {firstName}!</h2>
              <p style={{ fontSize: 13, opacity: .8 }}>Here&apos;s what&apos;s happening with {business?.name} today.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: "1.25rem" }}>
              <StatCard label="Today's bookings" value="0" sub="no rezzes yet" color="#2563eb" />
              <StatCard label="This week" value="0" sub="total rezzes" />
              <StatCard label="Revenue" value="$0" sub="this month" color="#3b6d11" />
              <StatCard label="Clients" value={clients.length.toString()} sub="total" />
              <StatCard label="Services" value={services.length.toString()} sub="active" color="#854f0b" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {/* Quick actions */}
              <div style={{ ...card }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", marginBottom: "1rem" }}>Quick actions</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button onClick={() => setTab("services")} style={{ ...btnOutline, textAlign: "left", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px" }}>
                    <span>✂️</span><span style={{ flex: 1 }}>Manage services</span><span style={{ color: "#9ca3af" }}>→</span>
                  </button>
                  <button onClick={() => setTab("clients")} style={{ ...btnOutline, textAlign: "left", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px" }}>
                    <span>👥</span><span style={{ flex: 1 }}>View clients</span><span style={{ color: "#9ca3af" }}>→</span>
                  </button>
                  <button onClick={() => setTab("settings")} style={{ ...btnOutline, textAlign: "left", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px" }}>
                    <span>⚙️</span><span style={{ flex: 1 }}>Update business info</span><span style={{ color: "#9ca3af" }}>→</span>
                  </button>
                  {!isPro && (
                    <button onClick={() => window.location.href = "/pricing"} style={{ ...btnPrimary, textAlign: "left", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px" }}>
                      <span>⚡</span><span style={{ flex: 1 }}>Upgrade to Pro</span><span>→</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Booking link */}
              <div style={{ ...card }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", marginBottom: 6 }}>Your booking link</p>
                <p style={{ fontSize: 12, color: "#6b7280", marginBottom: "1rem", lineHeight: 1.6 }}>
                  Share this link with clients — they can book directly with you.
                </p>
                <div style={{ background: "#f9fafb", border: "0.5px solid #e5e7eb", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#374151", fontFamily: "monospace", marginBottom: "1rem", wordBreak: "break-all" as const }}>
                  slotrez.com/book/{business?.name?.toLowerCase().replace(/\s+/g, "-")}
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(`slotrez.com/book/${business?.name?.toLowerCase().replace(/\s+/g, "-")}`); alert("Copied!"); }}
                  style={{ ...btnOutline, fontSize: 12, padding: "7px 14px" }}>
                  📋 Copy link
                </button>
              </div>
            </div>

            {/* Upgrade banner for free plan */}
            {!isPro && (
              <div style={{ background: "linear-gradient(135deg, #eff6ff, #f0fdf4)", border: "0.5px solid #93c5fd", borderRadius: 12, padding: "1.25rem", marginTop: "1.25rem", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 32, flexShrink: 0 }}>🚀</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", marginBottom: 4 }}>Unlock the full Slotrez experience</p>
                  <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>Upgrade to Pro to get SMS reminders, loyalty programs, no-show fees, analytics, and more. Starting at $29/mo.</p>
                </div>
                <button onClick={() => window.location.href = "/pricing"} style={{ ...btnPrimary, whiteSpace: "nowrap" as const, flexShrink: 0 }}>
                  Upgrade now →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══ CALENDAR ══ */}
        {tab === "calendar" && (
          <div>
            <p style={{ fontWeight: 600, fontSize: 16, color: "#111827", marginBottom: "1rem" }}>Calendar</p>
            <div style={{ ...card, textAlign: "center", padding: "3rem" }}>
              <div style={{ fontSize: 48, marginBottom: "1rem" }}>📅</div>
              <p style={{ fontWeight: 600, fontSize: 16, color: "#111827", marginBottom: 8 }}>No bookings yet</p>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, maxWidth: 380, margin: "0 auto 1.5rem" }}>
                Once clients start booking, their appointments will appear here on your calendar.
              </p>
              <p style={{ fontSize: 12, color: "#9ca3af" }}>Share your booking link to get your first rez!</p>
            </div>
          </div>
        )}

        {/* ══ CLIENTS ══ */}
        {tab === "clients" && (
          <div>
            <p style={{ fontWeight: 600, fontSize: 16, color: "#111827", marginBottom: "1rem" }}>Clients ({clients.length})</p>
            {clients.length === 0 ? (
              <div style={{ ...card, textAlign: "center", padding: "3rem" }}>
                <div style={{ fontSize: 48, marginBottom: "1rem" }}>👥</div>
                <p style={{ fontWeight: 600, fontSize: 16, color: "#111827", marginBottom: 8 }}>No clients yet</p>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, maxWidth: 380, margin: "0 auto" }}>
                  Clients who book with you will appear here. Share your booking link to get started!
                </p>
              </div>
            ) : (
              <div style={{ ...card, padding: 0, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "0.5px solid #e5e7eb", background: "#f9fafb" }}>
                      {["Client", "Email", "Phone", "Joined"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((c) => (
                      <tr key={c.id} style={{ borderBottom: "0.5px solid #f3f4f6" }}>
                        <td style={{ padding: "10px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                              {(c.full_name || c.email || "?")[0].toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 500, color: "#111827" }}>{c.full_name || "—"}</span>
                          </div>
                        </td>
                        <td style={{ padding: "10px 16px", color: "#6b7280" }}>{c.email}</td>
                        <td style={{ padding: "10px 16px", color: "#6b7280" }}>{c.phone || "—"}</td>
                        <td style={{ padding: "10px 16px", color: "#6b7280" }}>{new Date(c.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* CRM locked for free */}
            {!isPro && (
              <div style={{ marginTop: "1rem" }}>
                <LockedFeature feature="Client CRM — notes, tags & booking history" requiredPlan="Pro" />
              </div>
            )}
          </div>
        )}

        {/* ══ SERVICES ══ */}
        {tab === "services" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <p style={{ fontWeight: 600, fontSize: 16, color: "#111827" }}>Services ({services.length})</p>
              <button onClick={() => setShowServiceForm(!showServiceForm)} style={btnPrimary}>
                + Add service
              </button>
            </div>

            {/* Add service form */}
            {showServiceForm && (
              <div style={{ ...card, marginBottom: "1rem", border: "0.5px solid #93c5fd", background: "#eff6ff" }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: "#1d4ed8", marginBottom: "1rem" }}>New service</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", gap: 10, marginBottom: "1rem" }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Service name *</label>
                    <input value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} placeholder="e.g. 60min Consultation, Deep Tissue Massage, HIIT Session" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Duration (min)</label>
                    <input type="number" value={newService.duration_mins} onChange={(e) => setNewService({ ...newService, duration_mins: parseInt(e.target.value) })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Price ($)</label>
                    <input type="number" value={newService.price} onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })} style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={handleAddService} disabled={addingService || !newService.name} style={{ ...btnPrimary, opacity: addingService || !newService.name ? 0.6 : 1 }}>
                    {addingService ? "Adding..." : "Add service"}
                  </button>
                  <button onClick={() => setShowServiceForm(false)} style={btnOutline}>Cancel</button>
                </div>
              </div>
            )}

            {services.length === 0 ? (
              <div style={{ ...card, textAlign: "center", padding: "3rem" }}>
                <div style={{ fontSize: 48, marginBottom: "1rem" }}>🛎️</div>
                <p style={{ fontWeight: 600, fontSize: 16, color: "#111827", marginBottom: 8 }}>No services yet</p>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.5rem", lineHeight: 1.7 }}>
                  Add your first service so clients can start booking with you.
                </p>
                <button onClick={() => setShowServiceForm(true)} style={btnPrimary}>+ Add your first service</button>
              </div>
            ) : (
              <div style={{ ...card, padding: 0, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "0.5px solid #e5e7eb", background: "#f9fafb" }}>
                      {["Service", "Duration", "Price", "Status", ""].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s) => (
                      <tr key={s.id} style={{ borderBottom: "0.5px solid #f3f4f6" }}>
                        <td style={{ padding: "10px 16px", fontWeight: 500, color: "#111827" }}>{s.name}</td>
                        <td style={{ padding: "10px 16px", color: "#6b7280" }}>{s.duration_mins} min</td>
                        <td style={{ padding: "10px 16px", fontWeight: 500 }}>${s.price}</td>
                        <td style={{ padding: "10px 16px" }}>
                          <span style={{ background: s.active ? "#eaf3de" : "#f3f4f6", color: s.active ? "#3b6d11" : "#9ca3af", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                            {s.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td style={{ padding: "10px 16px" }}>
                          <button onClick={() => toggleService(s.id, s.active)}
                            style={{ background: "none", border: "0.5px solid #d1d5db", padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "inherit", color: "#374151" }}>
                            {s.active ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══ STAFF ══ */}
        {tab === "staff" && (
          <div>
            <p style={{ fontWeight: 600, fontSize: 16, color: "#111827", marginBottom: "1rem" }}>Staff</p>
            <div style={{ ...card, marginBottom: "1rem", display: "flex", alignItems: "center", gap: 12, padding: "1rem" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                {business?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{business?.name}</p>
                <p style={{ fontSize: 12, color: "#6b7280" }}>Owner · All services</p>
              </div>
              <span style={{ background: "#faeeda", color: "#854f0b", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>Owner</span>
            </div>
            {!isPro ? (
              <LockedFeature feature="Add staff members — up to 10 on Pro, unlimited on Elite" requiredPlan="Pro" />
            ) : (
              <div style={{ ...card, textAlign: "center", padding: "2rem" }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", marginBottom: 8 }}>Add staff members</p>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1rem" }}>Invite team members to manage bookings under your business.</p>
                <button style={btnPrimary}>+ Invite staff member</button>
              </div>
            )}
          </div>
        )}

        {/* ══ PAYMENTS ══ */}
        {tab === "payments" && (
          <div>
            <p style={{ fontWeight: 600, fontSize: 16, color: "#111827", marginBottom: "1rem" }}>Payments & Payouts</p>
            <div style={{ ...card, border: "0.5px solid #93c5fd", background: "#eff6ff", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>🏦</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: "#1d4ed8", marginBottom: 4 }}>Connect your bank account</p>
                  <p style={{ fontSize: 13, color: "#1d4ed8", opacity: 0.8, lineHeight: 1.6, marginBottom: "1rem" }}>
                    Connect via Stripe to start receiving payments from clients. Slotrez takes a small platform fee and deposits the rest directly to your bank every Friday.
                  </p>
                  <button style={{ ...btnPrimary, background: "#1d4ed8" }}>Connect bank account →</button>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 10, marginBottom: "1rem" }}>
              <StatCard label="Available balance" value="$0.00" color="#3b6d11" />
              <StatCard label="Pending payout" value="$0.00" />
              <StatCard label="This month" value="$0.00" />
              <StatCard label="Platform fee" value={plan === "pro" ? "2.0%" : plan === "elite" ? "1.0%" : "3.5%"} sub={`${plan} plan`} color="#2563eb" />
            </div>
            <div style={{ ...card, textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: 40, marginBottom: "1rem" }}>💳</div>
              <p style={{ fontWeight: 600, fontSize: 15, color: "#111827", marginBottom: 8 }}>No transactions yet</p>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7 }}>Your payment history will appear here once clients start booking and paying.</p>
            </div>
          </div>
        )}

        {/* ══ SETTINGS ══ */}
        {tab === "settings" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ ...card }}>
              <p style={{ fontWeight: 600, fontSize: 15, color: "#111827", marginBottom: "1.5rem" }}>Business info</p>
              <div style={{ marginBottom: ".85rem" }}>
                <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Business name</label>
                <input value={bizName} onChange={(e) => setBizName(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: ".85rem" }}>
                <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Description</label>
                <textarea value={bizDesc} onChange={(e) => setBizDesc(e.target.value)} placeholder="Tell clients what you do..." style={{ ...inputStyle, minHeight: 80, resize: "vertical" as const }} />
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Address</label>
                <input value={bizAddress} onChange={(e) => setBizAddress(e.target.value)} placeholder="123 Main St, Passaic NJ" style={inputStyle} />
              </div>
              {saved && (
                <div style={{ background: "#eaf3de", border: "0.5px solid #b2d98a", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#3b6d11", marginBottom: "1rem" }}>
                  ✓ Settings saved!
                </div>
              )}
              <button onClick={handleSaveSettings} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Current plan */}
              <div style={{ ...card }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", marginBottom: "1rem" }}>Current plan</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <PlanBadge plan={plan} />
                  <span style={{ fontSize: 13, color: "#6b7280" }}>{plan === "free" ? "Free forever" : plan === "pro" ? "$29/mo" : "$79/mo"}</span>
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: "1rem" }}>
                  Platform fee: <strong style={{ color: "#111827" }}>{plan === "pro" ? "2.0%" : plan === "elite" ? "1.0%" : "3.5%"}</strong> per transaction
                </div>
                {!isElite && (
                  <button onClick={() => window.location.href = "/pricing"} style={btnPrimary}>
                    {plan === "free" ? "Upgrade to Pro →" : "Upgrade to Elite →"}
                  </button>
                )}
              </div>

              {/* Locked features preview */}
              {!isPro && (
                <div style={{ ...card, background: "#f9fafb" }}>
                  <p style={{ fontWeight: 600, fontSize: 13, color: "#111827", marginBottom: ".75rem" }}>🔒 Unlock with Pro</p>
                  {["Custom intake forms", "SMS & email reminders", "No-show fees", "Loyalty program", "Analytics dashboard", "Waitlist management"].map((f) => (
                    <div key={f} style={{ display: "flex", gap: 6, padding: "5px 0", fontSize: 12, color: "#6b7280", borderBottom: "0.5px solid #f3f4f6" }}>
                      <span style={{ color: "#9ca3af" }}>🔒</span><span>{f}</span>
                    </div>
                  ))}
                  <button onClick={() => window.location.href = "/pricing"} style={{ ...btnPrimary, width: "100%", marginTop: "1rem", fontSize: 12 }}>
                    Upgrade to Pro — $29/mo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
