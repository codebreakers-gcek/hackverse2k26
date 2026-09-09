"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, X, Check, ShieldAlert } from "lucide-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "success" | "neutral";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "CONFIRM",
  cancelText = "CANCEL",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
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
  }, [isOpen, onClose, isLoading]);

  if (!isOpen || !mounted) return null;

  const getHeaderBg = () => {
    switch (variant) {
      case "danger":
        return "bg-rose-400";
      case "warning":
        return "bg-amber-300";
      case "success":
        return "bg-emerald-300";
      default:
        return "bg-cyan-300";
    }
  };

  const getConfirmBtnClass = () => {
    switch (variant) {
      case "danger":
        return "bg-rose-500 hover:bg-rose-600 text-white";
      case "warning":
        return "bg-amber-400 hover:bg-amber-500 text-black";
      case "success":
        return "bg-emerald-400 hover:bg-emerald-500 text-black";
      default:
        return "bg-black hover:bg-neutral-800 text-white";
    }
  };

  const getIcon = () => {
    switch (variant) {
      case "danger":
        return <Trash2 className="w-5 h-5 stroke-[2.5px] text-black" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 stroke-[2.5px] text-black" />;
      case "success":
        return <Check className="w-5 h-5 stroke-[2.5px] text-black" />;
      default:
        return <ShieldAlert className="w-5 h-5 stroke-[2.5px] text-black" />;
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      {/* Backdrop click to dismiss */}
      <div
        className="absolute inset-0"
        onClick={() => !isLoading && onClose()}
        aria-hidden="true"
      />

      {/* Neo-brutalist modal card centered */}
      <div className="relative z-10 w-full max-w-md bg-white border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header Strip */}
        <div
          className={`${getHeaderBg()} border-b-4 border-black px-5 py-3.5 flex items-center justify-between gap-3 shrink-0`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {getIcon()}
            </div>
            <h3 className="font-black text-base uppercase tracking-tight text-black truncate">
              {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => !isLoading && onClose()}
            disabled={isLoading}
            className="w-8 h-8 bg-white hover:bg-neutral-100 border-2 border-black flex items-center justify-center text-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 shrink-0"
          >
            <X className="w-4 h-4 stroke-[2.5px]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 bg-white text-black">
          <p className="font-mono text-xs font-bold leading-relaxed text-neutral-800 break-words">
            {description}
          </p>

          <div className="p-3 bg-neutral-100 border-2 border-black font-mono text-[11px] text-neutral-600 space-y-1">
            <span className="font-black text-black uppercase">⚠️ Notice:</span>
            <p>Please double-check before proceeding. This operation will take effect immediately.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-neutral-50 border-t-3 border-black flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-black border-2 border-black font-black text-xs uppercase font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 ${getConfirmBtnClass()} border-2 border-black font-black text-xs uppercase font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-2 disabled:opacity-50`}
          >
            <span>{isLoading ? "PROCESSING..." : confirmText}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
