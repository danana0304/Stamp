import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../app/assets/stamp.svg";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen overflow-hidden flex flex-col">
      <nav className="relative z-10 w-full flex justify-center h-16 flex-shrink-0 backdrop-blur-sm">
        <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 justify-center font-semibold">
            <Link href="/protected">
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <Image
                  height={120}
                  width={120}
                  src={Logo.src}
                  alt="Stamp Logo"
                />
              </div>
            </Link>
          </div>
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense>
              <AuthButton />
            </Suspense>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <div className="flex-1 w-full overflow-hidden">{children}</div>

      <footer className="w-full flex items-center justify-center flex-shrink-0 text-center text-xs gap-8 py-3 ">
        <p>© 2026 Stamp. All rights reserved.</p>
      </footer>
    </div>
  );
}
