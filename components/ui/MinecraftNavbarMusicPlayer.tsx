"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Music,
  Disc,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  X,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { playButtonClickSound } from "./MinecraftSoundEffects";

export function MinecraftNavbarMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize background audio
  useEffect(() => {
    const audio = new Audio("/sounds/Sweden.mp3");
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    const handlePlayEvent = () => setIsPlaying(true);
    const handlePauseEvent = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlayEvent);
    audio.addEventListener("pause", handlePauseEvent);

    // Check user preference
    const savedMuted = localStorage.getItem("hackverse_bgm_muted");
    if (savedMuted !== "true") {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Handle autoplay block by playing on first user gesture
        const unlockAudio = () => {
          const currentlyMuted = localStorage.getItem("hackverse_bgm_muted");
          if (currentlyMuted !== "true" && audioRef.current) {
            audioRef.current.play().then(() => {
              setIsPlaying(true);
            }).catch(() => {});
          }
          window.removeEventListener("click", unlockAudio);
          window.removeEventListener("keydown", unlockAudio);
          window.removeEventListener("touchstart", unlockAudio);
        };

        window.addEventListener("click", unlockAudio, { once: true });
        window.addEventListener("keydown", unlockAudio, { once: true });
        window.addEventListener("touchstart", unlockAudio, { once: true });
      });
    }

    return () => {
      audio.removeEventListener("play", handlePlayEvent);
      audio.removeEventListener("pause", handlePauseEvent);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const triggerToast = useCallback(() => {
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 3500);
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    playButtonClickSound(0.4);
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem("hackverse_bgm_muted", "true");
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        localStorage.removeItem("hackverse_bgm_muted");
        triggerToast();
      }).catch((err) => {
        console.error("Audio playback error:", err);
      });
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    playButtonClickSound(0.4);
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
      localStorage.removeItem("hackverse_bgm_muted");
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
      localStorage.setItem("hackverse_bgm_muted", "true");
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      if (newVol > 0 && isMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative font-mono select-none" ref={containerRef}>
      {/* ── Compact Minecraft Music Icon Trigger Button ── */}
      <button
        type="button"
        onClick={() => {
          playButtonClickSound(0.4);
          setIsOpen(!isOpen);
        }}
        className={clsx(
          "relative h-9 w-9 sm:h-10 sm:w-10 border-2 sm:border-3 flex items-center justify-center cursor-pointer transition-all active:translate-y-0.5 shadow-[2px_2px_0px_#000]",
          isOpen
            ? "bg-[#A0A0A0] border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF]"
            : isPlaying
            ? "bg-[#C6C6C6] hover:bg-[#D4D4D4] border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555]"
            : "bg-[#B0B0B0] hover:bg-[#C0C0C0] border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555]"
        )}
        title={isPlaying ? "Minecraft Music: Playing (Click for Controls)" : "Minecraft Music: Paused (Click to Play)"}
        aria-label="Minecraft Music Player"
        aria-expanded={isOpen}
      >
        {/* Animated Disc / Music Note Icon */}
        {isPlaying ? (
          <Disc
            className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#2E7D32] animate-spin"
            style={{ animationDuration: "3s" }}
          />
        ) : (
          <Music className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-black" />
        )}

        {/* Mini Redstone / Emerald Status Indicator Dot at Top Right */}
        <span
          className={clsx(
            "absolute -top-1 -right-1 w-2.5 h-2.5 border border-black shadow-[1px_1px_0px_#000]",
            isPlaying
              ? "bg-[#55FF55] animate-pulse"
              : "bg-[#FF5555]"
          )}
        />
      </button>

      {/* ── Dropdown Menu (Minecraft Stone HUD) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-68 sm:w-72 bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[8px_8px_0px_#000] z-50 text-black overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 bg-[#DBDBDB] border-b-3 border-[#555555] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Disc
                  className={clsx(
                    "w-4 h-4 text-[#5B8731]",
                    isPlaying && "animate-spin"
                  )}
                  style={{ animationDuration: "3s" }}
                />
                <div className="flex flex-col text-left">
                  <span className="font-black text-xs uppercase text-black leading-tight">
                    MINECRAFT JUKEBOX
                  </span>
                  <span className="font-mono text-[10px] text-black/70 leading-none">
                    C418 - SWEDEN (OST)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  playButtonClickSound(0.4);
                  setIsOpen(false);
                }}
                className="w-5 h-5 flex items-center justify-center bg-[#8B8B8B] hover:bg-[#FF5555] hover:text-white text-black border border-black cursor-pointer shadow-[1px_1px_0px_#000] text-xs font-black"
                title="Close"
              >
                <X className="w-3 h-3 stroke-[3px]" />
              </button>
            </div>

            {/* Body Controls */}
            <div className="p-3 space-y-3 bg-[#C6C6C6]">
              {/* Playback Status Badge */}
              <div className="p-2 bg-[#8B8B8B] border-2 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] flex items-center justify-between text-[11px] text-white font-black shadow-[inset_1px_1px_1px_rgba(0,0,0,0.5)]">
                <span className="flex items-center gap-1.5 [text-shadow:_1px_1px_0_#000]">
                  {isPlaying ? (
                    <>
                      <span className="w-2 h-2 bg-[#55FF55] border border-black animate-pulse" />
                      NOW PLAYING
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-[#FF5555] border border-black" />
                      PAUSED
                    </>
                  )}
                </span>
                <span className="text-[#FFE285] [text-shadow:_1px_1px_0_#000]">
                  VOL: {isMuted ? "0%" : `${Math.round(volume * 100)}%`}
                </span>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2">
                {/* Play / Pause Button */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className={clsx(
                    "flex-1 h-9 px-3 border-3 font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000] cursor-pointer active:translate-y-0.5 transition-all [text-shadow:_1px_1px_0_#000]",
                    isPlaying
                      ? "bg-[#5B8731] hover:bg-[#689B37] text-white border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813]"
                      : "bg-[#707070] hover:bg-[#808080] text-white border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838]"
                  )}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>PAUSE TRACK</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>PLAY TRACK</span>
                    </>
                  )}
                </button>

                {/* Mute Button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className="w-9 h-9 flex items-center justify-center bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[2px_2px_0px_#000] cursor-pointer active:translate-y-0.5"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-[#FF5555] stroke-[2.5px]" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-[#55FF55] stroke-[2.5px]" />
                  )}
                </button>
              </div>

              {/* Volume Slider Section */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-black/80">
                  <span>VOLUME SLIDER</span>
                  <span>{isMuted ? "MUTED" : `${Math.round(volume * 100)}%`}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-[#8B8B8B] rounded-none accent-[#5B8731] cursor-pointer border-2 border-black"
                  aria-label="Volume slider"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
