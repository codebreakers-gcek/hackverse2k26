"use client";

import { useState, useEffect } from "react";
import { EVENT_DATA } from "@/data/event";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const targetDate = new Date(EVENT_DATA.startDate).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto my-6">
        {["DAYS", "HOURS", "MINS", "SECS"].map((unit) => (
          <div
            key={unit}
            className="border-4 border-black bg-white p-3 sm:p-4 text-center shadow-neo-sm"
          >
            <div className="font-black text-2xl sm:text-4xl text-black">00</div>
            <div className="font-mono text-[10px] sm:text-xs font-bold text-black/60 tracking-wider">
              {unit}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const units = [
    { label: "DAYS", value: String(timeLeft.days).padStart(2, "0"), color: "bg-neo-secondary" },
    { label: "HOURS", value: String(timeLeft.hours).padStart(2, "0"), color: "bg-white" },
    { label: "MINS", value: String(timeLeft.minutes).padStart(2, "0"), color: "bg-neo-muted" },
    { label: "SECS", value: String(timeLeft.seconds).padStart(2, "0"), color: "bg-neo-accent" },
  ];

  return (
    <div className="max-w-xl mx-auto my-6 px-1">
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] xs:text-xs font-black uppercase tracking-wider mb-2">
        <span className="inline-flex items-center gap-1.5 bg-black text-white px-2.5 py-1 border-2 border-black shadow-neo-sm">
          <span className="w-2 h-2 bg-neo-accent inline-block rounded-full animate-pulse" />
          <span>HACKATHON KICKOFF IN:</span>
        </span>
        <span className="inline-block bg-white text-black px-2.5 py-1 border-2 border-black shadow-neo-sm font-black">
          OCTOBER 8, 2026
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 sm:gap-4">
        {units.map((unit) => (
          <div
            key={unit.label}
            className={`border-3 sm:border-4 border-black ${unit.color} p-2 sm:p-4 text-center shadow-neo-sm hover:-translate-y-0.5 transition-transform`}
          >
            <div className="font-black text-xl xs:text-2xl sm:text-4xl text-black leading-none font-mono">
              {unit.value}
            </div>
            <div className="font-mono text-[8px] xs:text-[9px] sm:text-xs font-black text-black tracking-wider uppercase mt-1">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
