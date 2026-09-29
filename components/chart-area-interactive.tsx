"use client";

import React from "react";
import { AdminRegistrationChart } from "@/components/admin/AdminRegistrationChart";
import { RegistrationRecord } from "@/types/admin";

export function ChartAreaInteractive({
  registrations = [],
}: {
  registrations?: RegistrationRecord[];
}) {
  return <AdminRegistrationChart registrations={registrations} />;
}
