import { createClient } from "@/lib/supabase/server";
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

    const supabase = await createClient();

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
