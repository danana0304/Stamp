// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import Image from "next/image";
import Logo from "../../app/assets/postbox.svg";
import Link from "next/link";

// async function UserDetails() {
//   const supabase = await createClient();
//   const { data, error } = await supabase.auth.getClaims();

//   if (error || !data?.claims) {
//     redirect("/auth/login");
//   }

//   return JSON.stringify(data.claims, null, 2);
// }

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12 justify-center">
      <div className="w-full">
        <div className="flex items-center justify-center">
          <Link href="/postbox">
            <Image
              height={120}
              width={120}
              src={Logo.src}
              alt="Stamp Logo"
              className="transition-transform duration-500 ease-in-out hover:scale-110 cursor-pointer flex justify-center self-center"
            />
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <Suspense>{/* <UserDetails /> */}</Suspense>
      </div>
      <div></div>
    </div>
  );
}
