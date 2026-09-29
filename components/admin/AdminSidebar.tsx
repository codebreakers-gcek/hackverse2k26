"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useAdmin } from "@/features/admin/AdminDataContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  Compass,
  CreditCard,
  KeyRound,
  Settings,
  LogOut,
  ExternalLink,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { stats, scannerData, settings } = useAdmin();
  const { isMobile, setOpenMobile } = useSidebar();

  const user = session?.user as
    | { name?: string; email?: string; image?: string; role?: string }
    | undefined;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully.");
      window.location.href = "/";
    } catch {
      toast.error("Failed to sign out.");
    }
  };

  const navItems = [
    {
      title: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      badge: stats?.totalSquads !== undefined ? stats.totalSquads : undefined,
      badgeColor: "bg-amber-400 text-black",
      exact: true,
    },
    {
      title: "Squads & Rosters",
      href: "/admin/squads",
      icon: Users,
      badge: stats?.totalSquads !== undefined ? stats.totalSquads : undefined,
      badgeColor: "bg-cyan-400 text-black",
    },
    {
      title: "Problem Statements",
      href: "/admin/problems",
      icon: Compass,
      badge:
        stats?.psDistribution && Object.keys(stats.psDistribution).length > 0
          ? Object.values(stats.psDistribution).reduce((a, b) => a + b, 0)
          : undefined,
      badgeColor: "bg-fuchsia-400 text-black",
    },
    {
      title: "Payment Verification",
      href: "/admin/payments",
      icon: CreditCard,
      badge:
        stats?.paymentPending !== undefined && stats.paymentPending > 0
          ? `${stats.paymentPending} PENDING`
          : "FREE/PAID",
      badgeColor:
        stats?.paymentPending && stats.paymentPending > 0
          ? "bg-rose-500 text-white font-black animate-pulse"
          : "bg-neutral-800 text-neutral-300 border-neutral-700",
    },
    {
      title: "Scanner & PIN",
      href: "/admin/scanner",
      icon: KeyRound,
      badge: scannerData.active
        ? `${scannerData.session?.activeDeviceCount || 0}/8 ONLINE`
        : "OFFLINE",
      badgeColor: scannerData.active
        ? "bg-lime-400 text-black font-black"
        : "bg-neutral-800 text-neutral-400 border-neutral-700",
    },
    {
      title: "Storage & Settings",
      href: "/admin/settings",
      icon: Settings,
      badge: settings.googleDriveEnabled ? "DRIVE" : undefined,
      badgeColor: "bg-violet-400 text-black",
    },
  ];

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r-2 border-neutral-800 bg-[#0e0e12] select-none text-neutral-100"
      {...props}
    >
      {/* Brand Header */}
      <SidebarHeader className="border-b-2 border-neutral-800 bg-neutral-950 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/admin"
              className="flex items-center gap-3 group"
              onClick={() => isMobile && setOpenMobile(false)}
            >
              <div className="flex flex-col items-center justify-center">
                <span className="font-mono font-black text-sm text-amber-400 tracking-wider">
                  HACKVERSE &apos;26
                </span>
                <span className="font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                  ADMIN CONSOLE
                </span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="p-3 space-y-4 bg-[#0e0e12]">
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[11px] font-black uppercase text-neutral-400 tracking-wider px-2 mb-1">
            CONTROL CENTER
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname?.startsWith(`${item.href}/`);

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive}
                    className={`w-full justify-between h-11 px-3 border-2 font-mono text-xs font-black uppercase tracking-wide transition-all cursor-pointer ${
                      isActive
                        ? "bg-amber-400 text-black border-amber-400 shadow-[3px_3px_0px_0px_#000000] translate-x-1"
                        : "bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800 hover:border-neutral-700 shadow-[2px_2px_0px_0px_#000000] hover:translate-x-0.5"
                    }`}
                    render={
                      <Link
                        href={item.href}
                        onClick={() => isMobile && setOpenMobile(false)}
                      />
                    }
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 stroke-[2.5px] shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`ml-2 px-1.5 py-0.5 border border-black/30 font-mono text-[10px] font-black shrink-0 ${
                            item.badgeColor || "bg-black text-white"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Quick External Links */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[11px] font-black uppercase text-neutral-400 tracking-wider px-2 mb-1">
            EXTERNAL &amp; SYSTEM
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1.5">
            <SidebarMenuItem>
              <SidebarMenuButton
                className="w-full justify-between h-9 px-3 border-2 border-neutral-800 bg-neutral-900 hover:bg-neutral-800 font-mono text-[11px] font-bold text-neutral-300 shadow-[2px_2px_0px_0px_#000000]"
                render={<Link href="/" target="_blank" />}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Public Website
                  </span>
                  <span className="font-mono text-[9px] text-emerald-400 font-bold">
                    LIVE
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Admin User Footer & Sign Out */}
      <SidebarFooter className="p-3 border-t-2 border-neutral-800 bg-neutral-950">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="w-full border-2 border-neutral-800 bg-neutral-900 hover:bg-neutral-800 hover:border-neutral-700 shadow-[2px_2px_0px_0px_#000000] p-2 h-auto text-white"
                  />
                }
              >
                <div className="w-8 h-8 border-2 border-cyan-400 bg-cyan-400 text-black font-black text-xs flex items-center justify-center shrink-0">
                  {user?.name?.[0]?.toUpperCase() || "A"}
                </div>
                <div className="grid flex-1 text-left text-xs leading-tight min-w-0 pl-1">
                  <span className="truncate font-black uppercase text-neutral-100">
                    {user?.name || "Administrator"}
                  </span>
                  <span className="truncate font-mono text-[10px] text-neutral-400">
                    {user?.email || "admin@gcek.ac.in"}
                  </span>
                </div>
                <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0 ml-auto" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-56 border-2 border-neutral-700 bg-neutral-900 text-white shadow-[4px_4px_0px_0px_#000000] p-1.5"
              >
                <DropdownMenuLabel className="font-mono text-xs font-black uppercase text-neutral-400 px-2 py-1">
                  ADMIN AUTH SESSION
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-neutral-800 h-0.5 my-1" />
                <DropdownMenuItem
                  onClick={() => (window.location.href = "/admin/settings")}
                  className="font-mono text-xs font-bold cursor-pointer hover:bg-neutral-800 px-2 py-1.5 text-neutral-200"
                >
                  <Settings className="w-3.5 h-3.5 mr-2" />
                  System Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-neutral-800 h-0.5 my-1" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="font-mono text-xs font-black text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 cursor-pointer px-2 py-1.5"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  SIGN OUT
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
