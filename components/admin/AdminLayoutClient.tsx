"use client";

import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminTeamDrawer } from "@/components/admin/AdminTeamDrawer";
import { AdminIdCardModal } from "@/components/admin/AdminIdCardModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAdmin } from "@/features/admin/AdminDataContext";
import { useSession } from "@/lib/auth-client";
import { ShieldAlert, Loader2, LogIn, Lock } from "lucide-react";
import Link from "next/link";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { confirmDialog, closeConfirm, isUpdating } = useAdmin();
  const { data: session, isPending } = useSession();

  const user = session?.user as
    | { name?: string; email?: string; image?: string; role?: string }
    | undefined;

  // Loading Session State (Dark Mode)
  if (isPending) {
    return (
      <div className="dark min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4 font-mono select-none">
        <div className="border-3 border-neutral-700 bg-neutral-900 p-8 shadow-[6px_6px_0px_0px_#000000] max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 border-2 border-amber-400 bg-amber-400 text-black flex items-center justify-center mx-auto shadow-[2px_2px_0px_0px_#f59e0b]">
            <Loader2 className="w-6 h-6 animate-spin text-black" />
          </div>
          <h2 className="text-xl font-black uppercase text-amber-400 tracking-wider">
            AUTHENTICATING ACCESS...
          </h2>
          <p className="text-xs text-neutral-400 font-bold">
            Verifying administrative credentials with HACKVERSE &apos;26 cluster.
          </p>
        </div>
      </div>
    );
  }

  // Unauthorized State: Not logged in or not admin (Dark Mode)
  if (!user || user.role !== "admin") {
    return (
      <div className="dark min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4 font-mono select-none">
        <div className="border-4 border-neutral-700 bg-neutral-900 p-8 shadow-[8px_8px_0px_0px_#000000] max-w-lg w-full text-center space-y-6">
          <div className="w-16 h-16 border-3 border-rose-500 bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#f43f5e]">
            <ShieldAlert className="w-8 h-8 text-rose-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase text-white tracking-tight">
              RESTRICTED ADMIN PORTAL
            </h1>
            <p className="text-xs font-bold text-neutral-400">
              {user
                ? `Logged in as ${user.email}, but your account lacks "admin" role privileges.`
                : "You must sign in with an authorized administrator account to access the HACKVERSE '26 control console."}
            </p>
          </div>

          <div className="p-4 border-2 border-dashed border-amber-500/50 bg-amber-950/20 text-left text-xs space-y-1">
            <div className="font-black uppercase text-amber-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              SECURITY PROTOCOL
            </div>
            <p className="text-neutral-300">
              All administrative actions and IP addresses are audited for security compliance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="py-3 px-6 border-2 border-amber-400 bg-amber-400 hover:bg-amber-300 font-black text-xs uppercase flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-black"
            >
              <LogIn className="w-4 h-4" />
              <span>SIGN IN AS ADMIN</span>
            </Link>
            <Link
              href="/"
              className="py-3 px-6 border-2 border-neutral-700 bg-neutral-800 hover:bg-neutral-700 font-black text-xs uppercase flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-white"
            >
              <span>RETURN HOME</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dark bg-neutral-950 text-neutral-100 min-h-screen antialiased selection:bg-amber-400 selection:text-black">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "18rem",
            "--header-height": "3.5rem",
          } as React.CSSProperties
        }
      >
        <AdminSidebar variant="inset" />
        <SidebarInset className="bg-[#0c0c0e] min-h-screen flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
            {children}
          </main>
        </SidebarInset>

        {/* Global Modals & Drawers */}
        <AdminTeamDrawer />
        <AdminIdCardModal />
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={closeConfirm}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          description={confirmDialog.description}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          variant={confirmDialog.variant === "info" ? "neutral" : confirmDialog.variant || "danger"}
          isLoading={isUpdating}
        />
      </SidebarProvider>
    </div>
  );
}
