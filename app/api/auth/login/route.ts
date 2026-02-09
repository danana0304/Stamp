import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { emailOrUsername, password } = await request.json();

    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { error: "Email/Username and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    let email = emailOrUsername;

    // Check if input is an email or username
    const isEmail = emailOrUsername.includes("@");

    if (!isEmail) {
      // If it's a username, find the associated email
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", emailOrUsername.toLowerCase())
        .single();

      if (profileError || !profile) {
        return NextResponse.json(
          { error: "Invalid username or password" },
          { status: 401 }
        );
      }

      email = profile.email;
    }

    // Sign in with the email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
