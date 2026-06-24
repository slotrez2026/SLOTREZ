// ─────────────────────────────────────────────────────────────
// Slotrez — Supabase browser client
// Save to: src/lib/supabase.ts
// ─────────────────────────────────────────────────────────────

import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (error) return null;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = "/";
}
