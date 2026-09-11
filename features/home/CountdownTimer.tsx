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
    {
      label: "DAYS",
      value: String(timeLeft.days).padStart(2, "0"),
      slotStyle: "bg-[#FFAA00] text-black border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500]",
    },
    {
      label: "HOURS",
      value: String(timeLeft.hours).padStart(2, "0"),
      slotStyle: "bg-[#E6E6E6] text-black border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#888888] border-b-[#888888]",
    },
    {
      label: "MINS",
      value: String(timeLeft.minutes).padStart(2, "0"),
      slotStyle: "bg-[#55FFFF] text-black border-4 border-t-[#A6FFFF] border-l-[#A6FFFF] border-r-[#008888] border-b-[#008888]",
    },
    {
      label: "SECS",
      value: String(timeLeft.seconds).padStart(2, "0"),
      slotStyle: "bg-[#FF5555] text-white border-4 border-t-[#FFAAAA] border-l-[#FFAAAA] border-r-[#880000] border-b-[#880000] [text-shadow:_1px_1px_0_#000]",
    },
  ];

  return (
    <div className="max-w-xl mx-auto my-5 px-1">
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] xs:text-xs font-black uppercase tracking-wider mb-2">
        <span className="inline-flex items-center gap-1.5 bg-black text-[#55FF55] px-2.5 py-1 border-2 border-[#55FF55] shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
          <span className="w-2 h-2 bg-[#55FF55] inline-block rounded-none animate-pulse" />
          <span>HACKATHON KICKOFF IN:</span>
        </span>
        <span className="inline-block bg-[#1B1B1B] text-[#FFAA00] px-2.5 py-1 border-2 border-[#FFAA00] shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000] font-black">
          OCTOBER 8, 2026
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 sm:gap-4">
        {units.map((unit) => (
          <div
            key={unit.label}
            className={`${unit.slotStyle} p-2 sm:p-4 text-center shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 transition-transform`}
          >
            <div className="font-black text-xl xs:text-2xl sm:text-4xl leading-none font-mono">
              {unit.value}
            </div>
            <div className="font-mono text-[8px] xs:text-[9px] sm:text-xs font-black tracking-wider uppercase mt-1">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
