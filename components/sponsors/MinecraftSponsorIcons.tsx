import React from "react";

/**
 * Pixel-perfect Minecraft Banner & Element Components
 * Designed to replace emojis with authentic Minecraft vector artwork.
 */

// 1. Pixel Creeper Banner (used on notice boards)
export function MinecraftCreeperBanner({ className = "w-6 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      {/* Top Iron Rod */}
      <rect x="2" y="0" width="20" height="2" fill="#2E2E2E" />
      <rect x="1" y="0" width="2" height="2" fill="#5A5A5A" />
      <rect x="21" y="0" width="2" height="2" fill="#5A5A5A" />

      {/* Banner Base Body (Blue) */}
      <path
        d="M3 2 H21 V34 L12 39 L3 34 Z"
        fill="#0066CC"
        stroke="#003D7A"
        strokeWidth="1.5"
      />
      {/* Banner Highlight Stripe */}
      <rect x="4" y="3" width="2" height="28" fill="#1A85FF" opacity="0.4" />

      {/* Creeper Face (Pixel Black Pattern) */}
      {/* Eyes */}
      <rect x="6" y="9" width="3" height="3" fill="#0A0A0A" />
      <rect x="15" y="9" width="3" height="3" fill="#0A0A0A" />
      {/* Center Nose / Bridge */}
      <rect x="10.5" y="12" width="3" height="4" fill="#0A0A0A" />
      {/* Mouth */}
      <rect x="8" y="16" width="8" height="3" fill="#0A0A0A" />
      {/* Mouth Bottom Extensions */}
      <rect x="8" y="19" width="2.5" height="4" fill="#0A0A0A" />
      <rect x="13.5" y="19" width="2.5" height="4" fill="#0A0A0A" />

      {/* Bottom Chevron Stripes */}
      <path d="M6 28 L12 32 L18 28" stroke="#1A85FF" strokeWidth="1.5" fill="none" />
      <path d="M6 31 L12 35 L18 31" stroke="#003D7A" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// 2. Minecraft Lantern (Hanging with chain)
export function MinecraftLantern({ className = "w-6 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 28"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      {/* Hanging Chain Links */}
      <rect x="9" y="0" width="2" height="3" fill="#3B3B3B" />
      <rect x="8" y="2" width="4" height="2" fill="#525252" />
      <rect x="9" y="4" width="2" height="3" fill="#3B3B3B" />

      {/* Lantern Top Cap */}
      <rect x="6" y="7" width="8" height="2" fill="#2E2E2E" />
      <rect x="4" y="9" width="12" height="2" fill="#424242" />

      {/* Glass Body */}
      <rect x="5" y="11" width="10" height="10" fill="#FFA500" />
      {/* Inner Flame Glow */}
      <rect x="7" y="13" width="6" height="6" fill="#FFEE55" />
      <rect x="8" y="14" width="4" height="4" fill="#FFFFFF" />

      {/* Iron Frame Ribs */}
      <rect x="5" y="11" width="1" height="10" fill="#262626" />
      <rect x="14" y="11" width="1" height="10" fill="#262626" />
      <rect x="9" y="11" width="2" height="10" fill="#262626" opacity="0.6" />

      {/* Lantern Bottom Base */}
      <rect x="4" y="21" width="12" height="2" fill="#424242" />
      <rect x="6" y="23" width="8" height="2" fill="#2E2E2E" />
    </svg>
  );
}

// 3. Minecraft Gold Tier Shield Banner (with pixel crown)
export function MinecraftGoldBanner({ className = "w-10 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      {/* Banner Shield Body */}
      <path
        d="M3 2 H33 V34 L18 45 L3 34 Z"
        fill="#FFAA00"
        stroke="#8F5500"
        strokeWidth="2.5"
      />
      {/* 3D Highlight Edge */}
      <path d="M5 4 H31 V32 L18 42 L5 32 Z" stroke="#FFE285" strokeWidth="1.5" fill="none" />

      {/* Minecraft Pixel Crown */}
      {/* Crown Base */}
      <rect x="10" y="22" width="16" height="3" fill="#573300" />
      {/* Crown Jewels in base */}
      <rect x="12" y="23" width="2" height="1" fill="#4DEDF4" />
      <rect x="17" y="23" width="2" height="1" fill="#FF4444" />
      <rect x="22" y="23" width="2" height="1" fill="#4DEDF4" />

      {/* Crown Peaks */}
      <rect x="10" y="15" width="3" height="7" fill="#573300" />
      <rect x="16.5" y="13" width="3" height="9" fill="#573300" />
      <rect x="23" y="15" width="3" height="7" fill="#573300" />

      {/* Crown Peak Highlights */}
      <rect x="10" y="14" width="3" height="2" fill="#FFE285" />
      <rect x="16.5" y="12" width="3" height="2" fill="#FFE285" />
      <rect x="23" y="14" width="3" height="2" fill="#FFE285" />
    </svg>
  );
}

// 4. Minecraft Silver Tier Shield Banner (with pixel shield)
export function MinecraftSilverBanner({ className = "w-10 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      {/* Banner Shield Body */}
      <path
        d="M3 2 H33 V34 L18 45 L3 34 Z"
        fill="#D0D0D0"
        stroke="#5A5A5A"
        strokeWidth="2.5"
      />
      {/* 3D Highlight Edge */}
      <path d="M5 4 H31 V32 L18 42 L5 32 Z" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />

      {/* Minecraft Pixel Shield Icon */}
      <path
        d="M11 13 H25 V24 L18 29 L11 24 Z"
        fill="#3D3D3D"
        stroke="#222222"
        strokeWidth="1.5"
      />
      <rect x="13" y="15" width="10" height="7" fill="#555555" />
      <rect x="16.5" y="15" width="3" height="11" fill="#888888" />
    </svg>
  );
}

// 5. Minecraft Bronze Tier Shield Banner (with pixel anvil / brick)
export function MinecraftBronzeBanner({ className = "w-10 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      {/* Banner Shield Body */}
      <path
        d="M3 2 H33 V34 L18 45 L3 34 Z"
        fill="#D97706"
        stroke="#6B3004"
        strokeWidth="2.5"
      />
      {/* 3D Highlight Edge */}
      <path d="M5 4 H31 V32 L18 42 L5 32 Z" stroke="#FBBF24" strokeWidth="1.5" fill="none" />

      {/* Minecraft Pixel Brick / Ingot Icon */}
      {/* Brick 1 */}
      <rect x="10" y="14" width="7" height="4" fill="#451A03" />
      <rect x="19" y="14" width="7" height="4" fill="#451A03" />
      {/* Brick 2 (Middle Offset) */}
      <rect x="13" y="20" width="10" height="4" fill="#451A03" />
      {/* Brick 3 (Bottom) */}
      <rect x="10" y="26" width="7" height="4" fill="#451A03" />
      <rect x="19" y="26" width="7" height="4" fill="#451A03" />

      {/* Highlights */}
      <rect x="11" y="15" width="5" height="1" fill="#78350F" />
      <rect x="20" y="15" width="5" height="1" fill="#78350F" />
      <rect x="14" y="21" width="8" height="1" fill="#78350F" />
    </svg>
  );
}

// 6. Minecraft Pixel Checkmark (3D pixel check box from brochure image 3)
export function MinecraftCheckmark({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`${className} mx-auto relative bg-[#43B528] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center`}>
      {/* Top/Left Bevel Light */}
      <div className="absolute inset-0 border-t-2 border-l-2 border-[#76DF5B] pointer-events-none" />
      {/* Bottom/Right Bevel Dark */}
      <div className="absolute inset-0 border-r-2 border-b-2 border-[#1E5C10] pointer-events-none" />
      
      {/* Pixel Checkmark SVG */}
      <svg
        viewBox="0 0 16 16"
        className="w-4 h-4 text-black relative z-10"
        fill="currentColor"
        shapeRendering="crispEdges"
      >
        <rect x="11" y="3" width="2" height="3" fill="#000000" />
        <rect x="9" y="6" width="2" height="3" fill="#000000" />
        <rect x="7" y="9" width="2" height="3" fill="#000000" />
        <rect x="5" y="7" width="2" height="3" fill="#000000" />
        <rect x="3" y="5" width="2" height="3" fill="#000000" />
        <rect x="5" y="10" width="3" height="2" fill="#000000" />
      </svg>
    </div>
  );
}

// 7. Minecraft Pixel Cross (3D pixel X box from brochure image 3)
export function MinecraftCross({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`${className} mx-auto relative bg-[#D12828] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center`}>
      {/* Top/Left Bevel Light */}
      <div className="absolute inset-0 border-t-2 border-l-2 border-[#F86B6B] pointer-events-none" />
      {/* Bottom/Right Bevel Dark */}
      <div className="absolute inset-0 border-r-2 border-b-2 border-[#680D0D] pointer-events-none" />

      {/* Pixel Cross SVG */}
      <svg
        viewBox="0 0 16 16"
        className="w-4 h-4 text-white relative z-10"
        fill="currentColor"
        shapeRendering="crispEdges"
      >
        {/* Main Diagonals */}
        <rect x="3" y="3" width="2.5" height="2.5" fill="#FFFFFF" />
        <rect x="10.5" y="3" width="2.5" height="2.5" fill="#FFFFFF" />
        <rect x="5.5" y="5.5" width="2.5" height="2.5" fill="#FFFFFF" />
        <rect x="8" y="5.5" width="2.5" height="2.5" fill="#FFFFFF" />
        <rect x="6.75" y="6.75" width="2.5" height="2.5" fill="#FFFFFF" />
        <rect x="5.5" y="8" width="2.5" height="2.5" fill="#FFFFFF" />
        <rect x="8" y="8" width="2.5" height="2.5" fill="#FFFFFF" />
        <rect x="3" y="10.5" width="2.5" height="2.5" fill="#FFFFFF" />
        <rect x="10.5" y="10.5" width="2.5" height="2.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

// 8. Minecraft Crown Icon (Top Left Table Crown & Headings)
export function MinecraftPixelCrown({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      {/* Crown Base */}
      <rect x="3" y="16" width="18" height="4" fill="#FFAA00" stroke="#8F5500" strokeWidth="1" />
      {/* Jewels */}
      <rect x="6" y="17" width="2" height="2" fill="#4DEDF4" />
      <rect x="11" y="17" width="2" height="2" fill="#FF4444" />
      <rect x="16" y="17" width="2" height="2" fill="#4DEDF4" />

      {/* Peaks */}
      <rect x="3" y="8" width="4" height="8" fill="#FFAA00" stroke="#8F5500" strokeWidth="1" />
      <rect x="10" y="5" width="4" height="11" fill="#FFAA00" stroke="#8F5500" strokeWidth="1" />
      <rect x="17" y="8" width="4" height="8" fill="#FFAA00" stroke="#8F5500" strokeWidth="1" />

      {/* Highlights */}
      <rect x="4" y="6" width="2" height="2" fill="#FFE285" />
      <rect x="11" y="3" width="2" height="2" fill="#FFE285" />
      <rect x="18" y="6" width="2" height="2" fill="#FFE285" />
    </svg>
  );
}
