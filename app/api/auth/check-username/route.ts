import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username || username.length < 3) {
      return NextResponse.json(
        { available: false, error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if username exists in profiles table
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username.toLowerCase())
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 means no rows returned, which is what we want
      return NextResponse.json(
        { available: false, error: error.message },
        { status: 500 }
      );
    }

    // If data exists, username is taken
    const available = !data;

    return NextResponse.json({ available });
  } catch (error) {
    return NextResponse.json(
      {
        available: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
