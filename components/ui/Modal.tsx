"use client";

import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  badge?: string;
  children: React.ReactNode;
  maxWidth?: "md" | "lg" | "xl" | "2xl" | "4xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  badge,
  children,
  maxWidth = "2xl",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none animate-in fade-in duration-100"
    >
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Box */}
      <div
        ref={modalRef}
        className={clsx(
          "relative z-10 w-full bg-white border-4 border-black shadow-neo-xl max-h-[90vh] flex flex-col rounded-none overflow-hidden",
          maxWidthStyles[maxWidth]
        )}
      >
        {/* Modal Header */}
        <div className="bg-neo-secondary border-b-4 border-black px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 pr-4">
            {badge && (
              <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white border border-black">
                {badge}
              </span>
            )}
            <h2 id="modal-title" className="font-black text-lg sm:text-xl uppercase tracking-wider text-black truncate">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-10 h-10 border-2 border-black bg-white text-black hover:bg-neo-accent flex items-center justify-center transition-colors focus:outline-none focus:bg-neo-accent shrink-0"
          >
            <X className="w-6 h-6 stroke-[3px]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-black bg-white">{children}</div>
      </div>
    </div>
  );
}
