// ─────────────────────────────────────────────────────────────
// Slotrez — Verify OTP
// Save to: src/app/api/auth/verify-otp/route.ts
// ─────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { phone, token } = await request.json();

    if (!phone || !token) {
      return NextResponse.json(
        { error: "Phone and code are required" },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(token)) {
      return NextResponse.json(
        { error: "Code must be 6 digits" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });

    if (error) {
      return NextResponse.json(
        { error: "Invalid or expired code. Please try again." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        phone: data.user?.phone,
        email: data.user?.email,
      },
    });
  } catch (err) {
    console.error("verify-otp error:", err);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
