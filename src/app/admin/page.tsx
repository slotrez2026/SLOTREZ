"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Tab = "dashboard" | "tenants" | "users" | "billing" | "support" | "settings";

interface Tenant { id: string; name: string; plan: string; category: string; created_at: string; }
interface Profile { id: string; full_name: string; email: string; role: string; created_at: string; }

const card: React.CSSProperties = { background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "1.25rem" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "0.5px solid #d1d5db", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: "#fff", color: "#111827" };

function StatCard({ label, value, sub, color = "#2563eb" }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 10, padding: "1rem" }}>
      <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 700, color }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{sub}</p>}
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = "/login"; return; }
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      if (session.user.email !== adminEmail) { window.location.href = "/"; return; }
      setAdminName(session.user.user_metadata?.full_name?.split(" ")[0] || "Admin");
      const { data: bizData } = await supabase.from("businesses").select("id, name, plan, category, created_at").order("created_at", { ascending: false });
      const { data: profileData } = await supabase.from("profiles").select("id, full_name, email, role, created_at").order("created_at", { ascending: false }).limit(50);
      setTenants((bizData as Tenant[]) || []);
      setUsers((profileData as Profile[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSignOut() { await supabase.auth.signOut(); window.location.href = "/"; }

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "tenants",   label: "Tenants",   icon: "🏪" },
    { id: "users",     label: "Users",     icon: "👥" },
    { id: "billing",   label: "Billing",   icon: "💳" },
    { id: "support",   label: "Support",   icon: "🎧" },
    { id: "settings",  label: "Settings",  icon: "⚙️" },
  ];

  const planStyle = (plan: string) => plan === "pro" ? { background: "#eff6ff", color: "#1d4ed8" } : plan === "elite" ? { background: "#faeeda", color: "#854f0b" } : { background: "#f1efe8", color: "#5f5e5a" };
  const roleStyle = (role: string) => role === "owner" ? { background: "#faeeda", color: "#854f0b" } : { background: "#eff6ff", color: "#1d4ed8" };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f9fafb", fontFamily: "system-ui,-apple-system,sans-serif", gap: 16 }}>
      <div style={{ fontSize: 24, fontWeight: 700 }}><span style={{ color: "#1a1a2e" }}>slot</span><span style={{ color: "#2563eb" }}>rez</span></div>
      <div style={{ width: 28, height: 28, border: "3px solid #e5e7eb", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const mrr = tenants.filter(t => t.plan === "pro").length * 29 + tenants.filter(t => t.plan === "elite").length * 79;

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-.5px" }}>
              <span style={{ color: "#1a1a2e" }}>slot</span><span style={{ color: "#2563eb" }}>rez</span>
            </div>
            <span style={{ background: "#fcebeb", color: "#a32d2d", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600 }}>ADMIN</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <p style={{ fontSize: 13, color: "#6b7280" }}>Welcome, {adminName}</p>
            <button onClick={handleSignOut} style={{ background: "none", border: "0.5px solid #d1d5db", padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: "#374151" }}>Sign out</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "7px 14px", borderRadius: 20, fontSize: 13, border: "0.5px solid", borderColor: tab === t.id ? "#2563eb" : "#d1d5db", background: tab === t.id ? "#2563eb" : "#fff", color: tab === t.id ? "#fff" : "#6b7280", cursor: "pointer", fontFamily: "inherit", gap: 6, display: "flex", alignItems: "center" }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === "dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: "1.5rem" }}>
              <StatCard label="Total tenants" value={tenants.length.toString()} sub="businesses" />
              <StatCard label="Total users" value={users.length.toString()} sub="all accounts" />
              <StatCard label="Pro" value={tenants.filter(t => t.plan === "pro").length.toString()} color="#2563eb" />
              <StatCard label="Elite" value={tenants.filter(t => t.plan === "elite").length.toString()} color="#854f0b" />
              <StatCard label="MRR" value={`$${mrr.toLocaleString()}`} sub="monthly recurring" color="#3b6d11" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ ...card }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", marginBottom: "1rem" }}>Recent businesses</p>
                {tenants.length === 0
                  ? <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", padding: "1rem 0" }}>No businesses yet</p>
                  : tenants.slice(0, 5).map((t) => (
                    <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "0.5px solid #f3f4f6", fontSize: 13 }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 500, color: "#111827" }}>{t.name}</p>
                        <p style={{ fontSize: 11, color: "#9ca3af" }}>{new Date(t.created_at).toLocaleDateString()}</p>
                      </div>
                      <span style={{ ...planStyle(t.plan || "free"), padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 500 }}>{t.plan || "free"}</span>
                    </div>
                  ))
                }
              </div>
              <div style={{ ...card }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", marginBottom: "1rem" }}>Recent signups</p>
                {users.length === 0
                  ? <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", padding: "1rem 0" }}>No users yet</p>
                  : users.slice(0, 5).map((u) => (
                    <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "0.5px solid #f3f4f6", fontSize: 13 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                        {(u.full_name || u.email || "?")[0].toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 500, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.full_name || u.email}</p>
                        <p style={{ fontSize: 11, color: "#9ca3af" }}>{new Date(u.created_at).toLocaleDateString()}</p>
                      </div>
                      <span style={{ ...roleStyle(u.role), padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 500 }}>{u.role}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}

        {/* Tenants */}
        {tab === "tenants" && (
          <div>
            <p style={{ fontWeight: 600, fontSize: 16, color: "#111827", marginBottom: "1rem" }}>All businesses ({tenants.length})</p>
            {tenants.length === 0
              ? <div style={{ ...card, textAlign: "center", padding: "3rem" }}><div style={{ fontSize: 48, marginBottom: "1rem" }}>🏪</div><p style={{ fontWeight: 600, fontSize: 16, color: "#111827", marginBottom: 8 }}>No businesses yet</p><p style={{ fontSize: 13, color: "#6b7280" }}>When businesses sign up they will appear here.</p></div>
              : <div style={{ ...card, padding: 0, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead><tr style={{ borderBottom: "0.5px solid #e5e7eb", background: "#f9fafb" }}>
                      {["Business","Category","Plan","Joined",""].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{h}</th>)}
                    </tr></thead>
                    <tbody>{tenants.map((t) => (
                      <tr key={t.id} style={{ borderBottom: "0.5px solid #f3f4f6" }}>
                        <td style={{ padding: "10px 16px", fontWeight: 500, color: "#111827" }}>{t.name}</td>
                        <td style={{ padding: "10px 16px", color: "#6b7280" }}>{t.category || "—"}</td>
                        <td style={{ padding: "10px 16px" }}><span style={{ ...planStyle(t.plan || "free"), padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{t.plan || "free"}</span></td>
                        <td style={{ padding: "10px 16px", color: "#6b7280" }}>{new Date(t.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: "10px 16px" }}><button style={{ background: "none", border: "0.5px solid #d1d5db", padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "inherit", color: "#374151" }}>View</button></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
            }
          </div>
        )}

        {/* Users */}
        {tab === "users" && (
          <div>
            <p style={{ fontWeight: 600, fontSize: 16, color: "#111827", marginBottom: "1rem" }}>All users ({users.length})</p>
            <div style={{ ...card, padding: 0, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ borderBottom: "0.5px solid #e5e7eb", background: "#f9fafb" }}>
                  {["Name","Email","Role","Joined"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{h}</th>)}
                </tr></thead>
                <tbody>{users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "0.5px solid #f3f4f6" }}>
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                          {(u.full_name || u.email || "?")[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500, color: "#111827" }}>{u.full_name || "—"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px", color: "#6b7280" }}>{u.email}</td>
                    <td style={{ padding: "10px 16px" }}><span style={{ ...roleStyle(u.role), padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{u.role}</span></td>
                    <td style={{ padding: "10px 16px", color: "#6b7280" }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* Billing */}
        {tab === "billing" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: "1.5rem" }}>
              <StatCard label="MRR" value={`$${mrr.toLocaleString()}`} color="#3b6d11" />
              <StatCard label="Pro" value={tenants.filter(t => t.plan === "pro").length.toString()} color="#2563eb" />
              <StatCard label="Elite" value={tenants.filter(t => t.plan === "elite").length.toString()} color="#854f0b" />
              <StatCard label="Free" value={tenants.filter(t => !t.plan || t.plan === "free").length.toString()} />
            </div>
            <div style={{ ...card }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", marginBottom: "1rem" }}>Plan distribution</p>
              {[
                { label: "Free", count: tenants.filter(t => !t.plan || t.plan === "free").length, color: "#9ca3af" },
                { label: "Pro ($29/mo)", count: tenants.filter(t => t.plan === "pro").length, color: "#2563eb" },
                { label: "Elite ($79/mo)", count: tenants.filter(t => t.plan === "elite").length, color: "#854f0b" },
              ].map((p) => {
                const pct = tenants.length > 0 ? Math.round((p.count / tenants.length) * 100) : 0;
                return (
                  <div key={p.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: "#374151" }}>{p.label} — {p.count} tenants</span>
                      <span style={{ color: "#6b7280" }}>{pct}%</span>
                    </div>
                    <div style={{ height: 6, background: "#f3f4f6", borderRadius: 3 }}>
                      <div style={{ height: 6, background: p.color, borderRadius: 3, width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Support */}
        {tab === "support" && (
          <div style={{ ...card, textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: 48, marginBottom: "1rem" }}>🎧</div>
            <p style={{ fontWeight: 600, fontSize: 16, color: "#111827", marginBottom: 8 }}>Support tickets</p>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, maxWidth: 400, margin: "0 auto 1.5rem" }}>
              Connect Intercom or Crisp to manage support tickets. All tenant and client messages will appear here.
            </p>
            <a href="https://intercom.com" target="_blank" rel="noopener noreferrer"
              style={{ background: "#2563eb", color: "#fff", padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: "none", display: "inline-block" }}>
              Set up Intercom →
            </a>
          </div>
        )}

        {/* Settings */}
        {tab === "settings" && (
          <div style={{ ...card, maxWidth: 520 }}>
            <p style={{ fontWeight: 600, fontSize: 15, color: "#111827", marginBottom: "1.5rem" }}>Platform settings</p>
            {[["Platform name","Slotrez"],["Support email","support@slotrez.com"],["Website","https://slotrez.com"]].map(([label, val]) => (
              <div key={label} style={{ marginBottom: ".85rem" }}>
                <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>{label}</label>
                <input defaultValue={val} style={inputStyle} />
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: "1.25rem" }}>
              {[["Free fee (%)","3.5"],["Pro fee (%)","2.0"],["Elite fee (%)","1.0"]].map(([label, val]) => (
                <div key={label}>
                  <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>{label}</label>
                  <input type="number" defaultValue={val} style={inputStyle} />
                </div>
              ))}
            </div>
            <button onClick={() => alert("Settings saved!")}
              style={{ background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              Save settings
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
