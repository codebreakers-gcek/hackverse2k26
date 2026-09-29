"use client";

import React, { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RegistrationRecord } from "@/types/admin";
import { TrendingUp, Users, CheckCircle2, Calendar } from "lucide-react";

interface AdminRegistrationChartProps {
  registrations: RegistrationRecord[];
}

export function AdminRegistrationChart({
  registrations,
}: AdminRegistrationChartProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("all");

  const chartData = useMemo(() => {
    if (!registrations || registrations.length === 0) {
      return [];
    }

    // Sort registrations by createdAt ascending
    const sorted = [...registrations].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Group by date (YYYY-MM-DD)
    const dateMap: Record<
      string,
      { date: string; displayDate: string; daily: number; confirmed: number }
    > = {};

    sorted.forEach((r) => {
      const d = new Date(r.createdAt);
      const key = d.toISOString().split("T")[0];
      const displayDate = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!dateMap[key]) {
        dateMap[key] = {
          date: key,
          displayDate,
          daily: 0,
          confirmed: 0,
        };
      }

      dateMap[key].daily += 1;
      if (r.status === "CONFIRMED") {
        dateMap[key].confirmed += 1;
      }
    });

    // Convert map to array with cumulative count
    let cumulativeTotal = 0;
    let cumulativeConfirmed = 0;
    const sortedKeys = Object.keys(dateMap).sort();

    const fullSeries = sortedKeys.map((key) => {
      cumulativeTotal += dateMap[key].daily;
      cumulativeConfirmed += dateMap[key].confirmed;
      return {
        date: key,
        displayDate: dateMap[key].displayDate,
        daily: dateMap[key].daily,
        total: cumulativeTotal,
        confirmed: cumulativeConfirmed,
      };
    });

    if (timeRange === "7d") {
      return fullSeries.slice(-7);
    }
    if (timeRange === "30d") {
      return fullSeries.slice(-30);
    }
    return fullSeries;
  }, [registrations, timeRange]);

  const totalRegistered = registrations.length;
  const totalConfirmed = registrations.filter(
    (r) => r.status === "CONFIRMED"
  ).length;

  return (
    <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-5 select-none space-y-4 text-white">
      {/* Header with Title and Range Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b-2 border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-cyan-400 border border-black inline-block" />
            <h3 className="font-mono text-sm font-black uppercase text-white">
              Squad Registration Velocity &amp; Growth
            </h3>
          </div>
          <p className="font-mono text-xs text-neutral-400 mt-0.5">
            Real-time telemetry showing cumulative squad submissions over time
          </p>
        </div>

        {/* Time Range Filter Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(
            [
              { id: "7d", label: "7D" },
              { id: "30d", label: "30D" },
              { id: "all", label: "ALL TIME" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              className={`px-2.5 py-1 border-2 font-mono text-xs font-black uppercase cursor-pointer transition-all ${
                timeRange === t.id
                  ? "bg-amber-400 text-black border-amber-400 shadow-[2px_2px_0px_0px_#000000]"
                  : "bg-neutral-950 hover:bg-neutral-800 text-neutral-400 border-neutral-800 hover:border-neutral-700 shadow-[1px_1px_0px_0px_#000000]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      {chartData.length > 0 ? (
        <div className="h-[280px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis
                dataKey="displayDate"
                stroke="#a3a3a3"
                tick={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, fill: "#a3a3a3" }}
              />
              <YAxis
                stroke="#a3a3a3"
                tick={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, fill: "#a3a3a3" }}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="border-2 border-neutral-700 bg-neutral-900 p-3 shadow-[4px_4px_0px_0px_#000000] font-mono text-xs space-y-1 text-white">
                        <div className="font-black border-b border-neutral-800 pb-1 text-amber-400">
                          📅 {d.date} ({d.displayDate})
                        </div>
                        <div className="text-cyan-400 font-bold flex items-center justify-between gap-4">
                          <span>Total Squads:</span>
                          <span className="font-black">{d.total}</span>
                        </div>
                        <div className="text-emerald-400 font-bold flex items-center justify-between gap-4">
                          <span>Confirmed:</span>
                          <span className="font-black">{d.confirmed}</span>
                        </div>
                        <div className="text-neutral-400 text-[10px] pt-1">
                          +{d.daily} registered on this day
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#22d3ee"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
              <Area
                type="monotone"
                dataKey="confirmed"
                stroke="#34d399"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorConfirmed)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center font-mono text-xs text-neutral-500 border-2 border-dashed border-neutral-800">
          No registration timestamps recorded yet.
        </div>
      )}

      {/* Legend Footer */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t-2 border-neutral-800 font-mono text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 border border-black bg-cyan-400 inline-block" />
            <span className="font-bold text-neutral-200">Total Submissions ({totalRegistered})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 border border-black bg-emerald-400 inline-block" />
            <span className="font-bold text-emerald-400">Confirmed Teams ({totalConfirmed})</span>
          </div>
        </div>
        <div className="text-[11px] text-neutral-400 font-bold">
          ⚡ 100% Live Telemetry
        </div>
      </div>
    </div>
  );
}
