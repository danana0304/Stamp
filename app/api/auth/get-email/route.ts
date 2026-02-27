import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );
    }

    // Use service role client to bypass RLS
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {},
        },
      },
    );

    // Query the profiles table to get the email for this username
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("username", username.toLowerCase())
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { error: "Username not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ email: profile.email });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
