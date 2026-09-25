/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface PsStatsData {
  count: number;
  primaryCount: number;
  secondaryCount: number;
}

export function useProblemStatementStats() {
  const [stats, setStats] = useState<Record<string, PsStatsData>>({});
  const [totalSquads, setTotalSquads] = useState<number>(0);
  const [totalSelections, setTotalSelections] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState<boolean>(false);
  const isFetchingRef = useRef(false);

  const fetchStats = useCallback(async () => {
    if (isFetchingRef.current) return;
    try {
      isFetchingRef.current = true;
      const res = await fetch("/api/problem-statements/stats", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (data?.success && data?.stats) {
        setStats(data.stats);
        if (typeof data.totalSquads === "number") setTotalSquads(data.totalSquads);
        if (typeof data.totalSelections === "number") setTotalSelections(data.totalSelections);
      }
    } catch (err) {
      console.error("Failed to fetch real-time PS stats:", err);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchStats();

    // 1. Supabase Realtime Channel Subscription
    let channel: any = null;

    if (supabase) {
      try {
        channel = supabase
          .channel("ps-team-selection-realtime")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "team_registrations",
            },
            () => {
              // Realtime event received! Instantly refetch aggregated stats
              fetchStats();
            }
          )
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              setIsRealtimeConnected(true);
            } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
              setIsRealtimeConnected(false);
            }
          });
      } catch (err) {
        console.warn("Supabase realtime setup notice:", err);
      }
    }

    // 2. Fallback / Synchronized interval (polls every 5s if disconnected, or 15s heartbeat if connected)
    const intervalTime = isRealtimeConnected ? 15000 : 5000;
    const interval = setInterval(() => {
      fetchStats();
    }, intervalTime);

    // 3. Tab visibility / Focus sync
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchStats();
      }
    };
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", fetchStats);

    return () => {
      clearInterval(interval);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", fetchStats);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchStats, isRealtimeConnected]);

  return {
    stats,
    totalSquads,
    totalSelections,
    loading,
    isRealtimeConnected,
    refetch: fetchStats,
  };
}
