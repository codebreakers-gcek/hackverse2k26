"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

export interface AccordionItemProps {
  id: string;
  title: string;
  badge?: string;
  number?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({
  id,
  title,
  badge,
  number,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const headerId = `accordion-header-${id}`;
  const panelId = `accordion-panel-${id}`;

  return (
    <div className="border-4 border-black bg-white mb-4 shadow-neo transition-all duration-150 rounded-none">
      <h3>
        <button
          type="button"
          id={headerId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "w-full px-6 py-4 flex items-center justify-between text-left transition-colors duration-100",
            "focus-visible:outline-none focus-visible:bg-neo-secondary",
            isOpen ? "bg-neo-secondary border-b-4 border-black text-black" : "bg-white hover:bg-neutral-50 text-black"
          )}
        >
          <div className="flex items-center gap-3 pr-4">
            {number && (
              <span className="font-mono text-xs font-black px-2 py-0.5 bg-black text-white rounded-none border border-black">
                {number}
              </span>
            )}
            <span className="font-black text-base sm:text-lg uppercase tracking-wider">
              {title}
            </span>
            {badge && (
              <span className="hidden sm:inline-block font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-neo-accent text-black border-2 border-black">
                {badge}
              </span>
            )}
          </div>
          <div
            className={clsx(
              "w-8 h-8 flex items-center justify-center border-2 border-black bg-white text-black shrink-0 transition-transform duration-200",
              isOpen && "rotate-180 bg-black text-white"
            )}
          >
            <ChevronDown className="w-5 h-5 stroke-[3px]" />
          </div>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        hidden={!isOpen}
        className={clsx("p-6 text-black bg-white", !isOpen && "hidden")}
      >
        {children}
      </div>
    </div>
  );
}

export function Accordion({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx("w-full", className)}>{children}</div>;
}
