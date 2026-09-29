import React from "react";
import { AdminProvider } from "@/features/admin/AdminDataContext";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export const metadata = {
  title: "Admin Console | HACKVERSE '26",
  description: "Official Hackathon Management Console for CodeBreakers GCEK",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AdminProvider>
  );
}
