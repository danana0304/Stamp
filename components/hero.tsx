import Logo from "../app/assets/stamp.png";

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center"></p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      <img src={Logo.src} alt="Stamp Logo" className="h-32 w-auto" />
    </div>
  );
}
