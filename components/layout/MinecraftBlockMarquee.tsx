"use client";

import React from "react";
import clsx from "clsx";

/**
 * 16x16 Pixel Art Minecraft Blocks (Crisp Vector SVG)
 */
export function GrassBlock({ size = 26 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block shrink-0 drop-shadow-[2px_2px_0px_#000]"
      style={{ shapeRendering: "crispEdges" }}
    >
      <rect width="16" height="16" fill="#866043" />
      <rect x="2" y="7" width="2" height="2" fill="#573D26" />
      <rect x="7" y="9" width="3" height="2" fill="#573D26" />
      <rect x="12" y="6" width="2" height="2" fill="#573D26" />
      <rect x="3" y="12" width="3" height="2" fill="#573D26" />
      <rect x="10" y="12" width="2" height="2" fill="#573D26" />
      <rect x="6" y="6" width="2" height="2" fill="#9C724C" />
      <rect x="1" y="10" width="2" height="2" fill="#9C724C" />
      <rect x="13" y="11" width="2" height="2" fill="#9C724C" />
      {/* Grass Top */}
      <rect width="16" height="4" fill="#5B8731" />
      <rect x="0" y="4" width="2" height="2" fill="#5B8731" />
      <rect x="3" y="4" width="3" height="3" fill="#5B8731" />
      <rect x="8" y="4" width="2" height="2" fill="#5B8731" />
      <rect x="11" y="4" width="3" height="3" fill="#5B8731" />
      <rect x="14" y="4" width="2" height="1" fill="#5B8731" />
      {/* Grass Highlights */}
      <rect x="1" y="0" width="4" height="1" fill="#7CBD38" />
      <rect x="7" y="0" width="5" height="1" fill="#7CBD38" />
      <rect x="3" y="1" width="2" height="1" fill="#7CBD38" />
      <rect x="11" y="1" width="2" height="2" fill="#7CBD38" />
      {/* Grass Shadows */}
      <rect x="0" y="3" width="16" height="1" fill="#4C7427" />
      <rect x="3" y="6" width="3" height="1" fill="#4C7427" />
      <rect x="11" y="6" width="3" height="1" fill="#4C7427" />
    </svg>
  );
}

export function DiamondBlock({ size = 26 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block shrink-0 drop-shadow-[2px_2px_0px_#000]"
      style={{ shapeRendering: "crispEdges" }}
    >
      <rect width="16" height="16" fill="#696969" />
      <rect x="2" y="2" width="4" height="3" fill="#505050" />
      <rect x="9" y="1" width="5" height="3" fill="#7A7A7A" />
      <rect x="1" y="9" width="4" height="4" fill="#7A7A7A" />
      <rect x="10" y="10" width="5" height="4" fill="#505050" />
      {/* Diamond Gem 1 */}
      <rect x="3" y="4" width="4" height="4" fill="#00AAAA" />
      <rect x="4" y="4" width="2" height="3" fill="#55FFFF" />
      <rect x="4" y="5" width="1" height="1" fill="#FFFFFF" />
      {/* Diamond Gem 2 */}
      <rect x="9" y="3" width="4" height="3" fill="#00AAAA" />
      <rect x="10" y="3" width="2" height="2" fill="#55FFFF" />
      <rect x="10" y="3" width="1" height="1" fill="#FFFFFF" />
      {/* Diamond Gem 3 */}
      <rect x="8" y="8" width="5" height="4" fill="#00AAAA" />
      <rect x="9" y="9" width="3" height="2" fill="#55FFFF" />
      <rect x="10" y="9" width="1" height="1" fill="#FFFFFF" />
      {/* Diamond Gem 4 */}
      <rect x="2" y="11" width="4" height="3" fill="#00AAAA" />
      <rect x="3" y="11" width="2" height="2" fill="#55FFFF" />
      <rect x="3" y="12" width="1" height="1" fill="#FFFFFF" />
    </svg>
  );
}

export function TNTBlock({ size = 26 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block shrink-0 drop-shadow-[2px_2px_0px_#000]"
      style={{ shapeRendering: "crispEdges" }}
    >
      <rect width="16" height="16" fill="#B52B1E" />
      <rect x="1" y="1" width="14" height="4" fill="#DB3627" />
      <rect x="1" y="11" width="14" height="4" fill="#DB3627" />
      {/* White Stripe */}
      <rect y="5" width="16" height="6" fill="#F0F0F0" />
      <rect y="5" width="16" height="1" fill="#C0C0C0" />
      <rect y="10" width="16" height="1" fill="#C0C0C0" />
      {/* TNT Lettering */}
      <rect x="2" y="6" width="3" height="1" fill="#111111" />
      <rect x="3" y="7" width="1" height="3" fill="#111111" />
      <rect x="6" y="6" width="1" height="4" fill="#111111" />
      <rect x="7" y="7" width="1" height="2" fill="#111111" />
      <rect x="8" y="6" width="1" height="4" fill="#111111" />
      <rect x="10" y="6" width="3" height="1" fill="#111111" />
      <rect x="11" y="7" width="1" height="3" fill="#111111" />
    </svg>
  );
}

export function RedstoneBlock({ size = 26 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block shrink-0 drop-shadow-[2px_2px_0px_#000]"
      style={{ shapeRendering: "crispEdges" }}
    >
      <rect width="16" height="16" fill="#990000" />
      <rect x="1" y="1" width="14" height="14" fill="#C41515" />
      <rect x="3" y="3" width="4" height="4" fill="#E62222" />
      <rect x="9" y="3" width="4" height="4" fill="#FF4444" />
      <rect x="3" y="9" width="4" height="4" fill="#FF4444" />
      <rect x="9" y="9" width="4" height="4" fill="#E62222" />
      <rect x="4" y="4" width="2" height="2" fill="#FFAAAA" />
      <rect x="10" y="10" width="2" height="2" fill="#FFAAAA" />
      <rect x="5" y="5" width="1" height="1" fill="#FFFFFF" />
      <rect x="11" y="11" width="1" height="1" fill="#FFFFFF" />
    </svg>
  );
}

export function CraftingTable({ size = 26 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block shrink-0 drop-shadow-[2px_2px_0px_#000]"
      style={{ shapeRendering: "crispEdges" }}
    >
      <rect width="16" height="16" fill="#5F3C1D" />
      <rect x="1" y="1" width="14" height="14" fill="#8F5E33" />
      <rect x="1" y="1" width="14" height="4" fill="#AB7544" />
      <rect x="2" y="2" width="3" height="2" fill="#3D2612" />
      <rect x="6" y="2" width="4" height="2" fill="#3D2612" />
      <rect x="11" y="2" width="3" height="2" fill="#3D2612" />
      <rect x="3" y="6" width="3" height="7" fill="#C0C0C0" />
      <rect x="4" y="8" width="5" height="2" fill="#3D2612" />
      <rect x="9" y="7" width="4" height="6" fill="#3D2612" />
      <rect x="10" y="8" width="2" height="4" fill="#AB7544" />
    </svg>
  );
}

export function LootChest({ size = 26 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block shrink-0 drop-shadow-[2px_2px_0px_#000]"
      style={{ shapeRendering: "crispEdges" }}
    >
      <rect width="16" height="16" fill="#291A0D" />
      <rect x="1" y="1" width="14" height="14" fill="#99602A" />
      <rect x="2" y="2" width="12" height="3" fill="#B37536" />
      <rect x="1" y="6" width="14" height="1" fill="#291A0D" />
      <rect x="7" y="5" width="2" height="4" fill="#E6E6E6" />
      <rect x="7" y="6" width="2" height="2" fill="#FFFFFF" />
      <rect x="7" y="8" width="2" height="1" fill="#333333" />
    </svg>
  );
}

export function GoldBlock({ size = 26 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block shrink-0 drop-shadow-[2px_2px_0px_#000]"
      style={{ shapeRendering: "crispEdges" }}
    >
      <rect width="16" height="16" fill="#B28200" />
      <rect x="1" y="1" width="14" height="14" fill="#FDD219" />
      <rect x="2" y="2" width="12" height="2" fill="#FFF280" />
      <rect x="2" y="2" width="2" height="12" fill="#FFF280" />
      <rect x="12" y="2" width="2" height="12" fill="#D69C00" />
      <rect x="2" y="12" width="12" height="2" fill="#D69C00" />
      <rect x="4" y="4" width="4" height="4" fill="#FFF280" />
      <rect x="5" y="5" width="2" height="2" fill="#FFFFFF" />
    </svg>
  );
}

export function EmeraldBlock({ size = 26 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block shrink-0 drop-shadow-[2px_2px_0px_#000]"
      style={{ shapeRendering: "crispEdges" }}
    >
      <rect width="16" height="16" fill="#08692B" />
      <rect x="1" y="1" width="14" height="14" fill="#17DD62" />
      <rect x="2" y="2" width="12" height="2" fill="#8FF0B3" />
      <rect x="2" y="2" width="2" height="12" fill="#8FF0B3" />
      <rect x="12" y="2" width="2" height="12" fill="#0FA847" />
      <rect x="2" y="12" width="12" height="2" fill="#0FA847" />
      <rect x="5" y="5" width="6" height="6" fill="#0FA847" />
      <rect x="6" y="6" width="4" height="4" fill="#8FF0B3" />
      <rect x="7" y="7" width="2" height="2" fill="#FFFFFF" />
    </svg>
  );
}

export interface MinecraftMarqueeItem {
  text: string;
  highlight?: string;
  color?: string;
  BlockComponent: React.ComponentType<{ size?: number }>;
}

const DEFAULT_MINECRAFT_ITEMS: MinecraftMarqueeItem[] = [
  {
    text: "DIAMOND REWARDS",
    highlight: "₹35K+ CASH",
    color: "#55FFFF",
    BlockComponent: DiamondBlock,
  },
  {
    text: "MINE & CRAFT YOUR CODE",
    color: "#55FF55",
    BlockComponent: GrassBlock,
  },
  {
    text: "REDSTONE CIRCUIT",
    highlight: "AI & HARDWARE",
    color: "#FF5555",
    BlockComponent: RedstoneBlock,
  },
  {
    text: "24-HOUR SURVIVAL SPRINT",
    color: "#FFAA00",
    BlockComponent: TNTBlock,
  },
  {
    text: "CRAFT ON OVERWORLD",
    highlight: "GCEK KALAHANDI",
    color: "#FFAA00",
    BlockComponent: CraftingTable,
  },
  {
    text: "UNSEAL LOOT CHEST",
    highlight: "SWAG & STATE CERTS",
    color: "#55FFFF",
    BlockComponent: LootChest,
  },
  {
    text: "GOLD VANGUARD",
    highlight: "TOP HACKERS",
    color: "#FFAA00",
    BlockComponent: GoldBlock,
  },
  {
    text: "CODEBREAKERS GUILD",
    highlight: "ODISHA STATE STAGE",
    color: "#55FF55",
    BlockComponent: EmeraldBlock,
  },
];

export interface MinecraftBlockMarqueeProps {
  speed?: "normal" | "fast";
  bended?: boolean;
  className?: string;
}

export function MinecraftBlockMarquee({
  speed = "normal",
  bended = false,
  className,
}: MinecraftBlockMarqueeProps) {
  const animClass = speed === "fast" ? "animate-marquee-fast" : "animate-marquee";

  // Duplicate items 4 times to ensure seamless infinite looping without gaps
  const repeatedItems = [
    ...DEFAULT_MINECRAFT_ITEMS,
    ...DEFAULT_MINECRAFT_ITEMS,
    ...DEFAULT_MINECRAFT_ITEMS,
    ...DEFAULT_MINECRAFT_ITEMS,
  ];

  const marqueeContent = (
    <div
      className={clsx(
        "relative w-full max-w-full overflow-hidden py-3.5 sm:py-4 select-none flex items-center bg-[#111111] border-y-4 border-black shadow-[0_4px_10px_rgba(0,0,0,0.8)] z-20",
        bended && "rotate-[-1.5deg] scale-[1.02] shadow-[0_8px_20px_rgba(0,0,0,1)]",
        className
      )}
    >
      <div className={clsx("flex items-center gap-8 whitespace-nowrap will-change-transform min-w-0", animClass)}>
        {repeatedItems.map((item, idx) => {
          const Block = item.BlockComponent;
          return (
            <div
              key={idx}
              className="inline-flex items-center gap-3 font-mono font-black text-xs sm:text-sm md:text-base tracking-widest uppercase [text-shadow:_2px_2px_0_#000]"
            >
              <Block size={26} />
              <span className="text-white">{item.text}</span>
              {item.highlight && (
                <span
                  style={{ color: item.color || "#FFAA00" }}
                  className="bg-black/90 px-2 py-0.5 border border-[#333333] shadow-[1px_1px_0_#000]"
                >
                  {item.highlight}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (bended) {
    return (
      <div className="relative w-full max-w-full overflow-hidden py-6 -my-3 sm:-my-4 z-20">
        {marqueeContent}
      </div>
    );
  }

  return marqueeContent;
}
