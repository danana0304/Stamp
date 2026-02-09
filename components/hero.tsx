import Logo from "../app/assets/stamp.svg";
import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center"></p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      <Link href="/postbox">
        <Image
          height={220}
          width={420}
          src={Logo.src}
          alt="Stamp Logo"
          className="transition-transform duration-500 ease-in-out hover:scale-110 cursor-pointer"
        />
      </Link>
      {!hasEnvVars ? (
        <EnvVarWarning />
      ) : (
        <Suspense>
          <AuthButton />
        </Suspense>
      )}
    </div>
  );
}
