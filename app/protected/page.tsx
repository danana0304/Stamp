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
    <div className="flex-1 w-full flex flex-col gap-12 justify-center items-center">
      {/* Postbox and Icons Container */}
      <div className="flex flex-col items-center gap-8">
        {/* Postbox Icon */}
        <div className="flex items-center justify-center">
          <Link href="/map">
            <Image
              height={120}
              width={120}
              src={Logo.src}
              alt="Stamp Logo"
              className="transition-transform duration-500 ease-in-out hover:scale-110 cursor-pointer"
            />
          </Link>
        </div>

        {/* Icon Grid */}
        <div className="absolute flex bottom-40 left-1/2 transform -translate-x-1/2 gap-12">
          <Link href="/connections">
            <div className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-bblue group-hover:scale-110 transition-all duration-200">
                <span className="text-2xl">🌐</span>
              </div>
              <span className="text-xs font-medium text-gray-700">
                Connections
              </span>
            </div>
          </Link>

          <Link href="/passport">
            <div className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-bblue group-hover:scale-110 transition-all duration-200">
                <span className="text-2xl">📕</span>
              </div>
              <span className="text-xs font-medium text-gray-700">
                Passport
              </span>
            </div>
          </Link>

          {/* Settings Icon */}
          <Link href="/settings">
            <div className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-bblue group-hover:scale-110 transition-all duration-200">
                <span className="text-2xl">⚙️</span>
              </div>
              <span className="text-xs font-medium text-gray-700">
                Settings
              </span>
            </div>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-start">
        <Suspense>{/* <UserDetails /> */}</Suspense>
      </div>
    </div>
  );
}
