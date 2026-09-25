import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  brandKey?: string;
  logoUrl?: string;
  name: string;
  className?: string;
}

export function BrandLogo({ brandKey, logoUrl, name, className = "h-16 w-auto" }: BrandLogoProps) {
  if (logoUrl) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <Image
          src={logoUrl}
          alt={`${name} Logo`}
          width={240}
          height={120}
          unoptimized
          className="max-h-16 sm:max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center font-mono font-black text-lg text-black">
      {name}
    </div>
  );
}
