import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { createServerClient } from "@supabase/ssr";

export async function AuthButton() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  if (!user) {
    return (
      <Button asChild size="lg" variant="default">
        <Link href="/auth/login">Check In</Link>
      </Button>
    );
  }

  // Use service role client to fetch profile (bypass RLS)
  const supabaseAdmin = createServerClient(
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

  // Fetch the custom profile from 'profiles' table
  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("full_name")
    .eq("id", user.sub)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error);
  }

  return (
    <div className="flex text-black items-center gap-4">
      Hey, {profile?.full_name || user.user_metadata?.full_name || "User"}!
      <LogoutButton />
    </div>
  );
}
