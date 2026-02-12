"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import MapSvg from "../../app/assets/world-map.svg";

export default function MapPage() {
  const router = useRouter();

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Navigation Icons Container */}
      <div className="relative h-full items-center justify-center flex z-0">
        <Image src={MapSvg} alt="World Map" className="w-full object-cover" />
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-8">
        {/* Return  */}
        <button
          onClick={() => router.push("/protected")}
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:bg-gray-100 transition-colors duration-200">
            <span className="text-3xl">←</span>
          </div>
          <span className="text-white text-sm font-medium">Return</span>
        </button>

        {/* Gallery  */}
        <button
          onClick={() => router.push("/gallery")}
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:bg-gray-100 transition-colors duration-200">
            <span className="text-3xl">🖼️</span>
          </div>
          <span className="text-white text-sm font-medium">Gallery</span>
        </button>

        {/* New Postcard */}
        <button
          onClick={() => router.push("/postbox")}
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:bg-gray-100 transition-colors duration-200">
            <span className="text-3xl">✉️</span>
          </div>
          <span className="text-white text-sm font-medium">New Postcard</span>
        </button>
      </div>
    </div>
  );
}
