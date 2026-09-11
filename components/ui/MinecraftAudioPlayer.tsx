"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, Disc, Music, SlidersHorizontal, X } from "lucide-react";
import clsx from "clsx";

export function MinecraftAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const audio = new Audio("/sounds/Sweden.mp3");
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    const handlePlayEvent = () => setIsPlaying(true);
    const handlePauseEvent = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlayEvent);
    audio.addEventListener("pause", handlePauseEvent);

    // Attempt autoplay or listen for first interaction
    const tryAutoplay = () => {
      const savedMuted = localStorage.getItem("hackverse_bgm_muted");
      if (savedMuted === "true") {
        return;
      }

      audio.play().then(() => {
        setIsPlaying(true);
        triggerToast();
      }).catch(() => {
        // Autoplay policy prevented playback, wait for first user gesture
        const unlockAudio = () => {
          const currentlyMuted = localStorage.getItem("hackverse_bgm_muted");
          if (currentlyMuted !== "true") {
            audio.play().then(() => {
              setIsPlaying(true);
              triggerToast();
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
    };

    tryAutoplay();

    return () => {
      audio.removeEventListener("play", handlePlayEvent);
      audio.removeEventListener("pause", handlePauseEvent);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const triggerToast = () => {
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
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

  return (
    <div className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-50 select-none font-mono">
      {/* Toast Notification when Track Starts */}
      {showToast && (
        <div className="mb-1.5 bg-[#1B1B1B]/90 backdrop-blur-xs border-2 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] px-2.5 py-1 shadow-[2px_2px_0px_#000] flex items-center gap-1.5 animate-bounce-short max-w-xs">
          <Disc className="w-3 h-3 text-[#55FF55] animate-spin shrink-0" style={{ animationDuration: "3s" }} />
          <span className="text-[10px] font-bold text-white truncate [text-shadow:_1px_1px_0_#000]">
            <span className="text-[#FFAA00]">OST:</span> C418 - Sweden
          </span>
        </div>
      )}

      {/* Main Minecraft Jukebox Widget */}
      <div
        className={clsx(
          "bg-[#C6C6C6] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[3px_3px_0px_#000] transition-all duration-150 overflow-hidden",
          isExpanded ? "p-2.5 w-60 sm:w-64" : "p-1 sm:p-1.5"
        )}
      >
        {!isExpanded ? (
          /* Mini Minimal Pill / Jukebox Button */
          <div className="flex items-center gap-1.5">
            {/* Play/Pause Direct Button */}
            <button
              type="button"
              onClick={togglePlay}
              className={clsx(
                "h-7 w-7 sm:h-8 sm:w-8 border-2 flex items-center justify-center cursor-pointer transition-transform active:translate-y-0.5 shadow-[1px_1px_0px_#000]",
                isPlaying
                  ? "bg-[#5B8731] hover:bg-[#689B37] text-white border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813]"
                  : "bg-[#707070] hover:bg-[#808080] text-white border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838]"
              )}
              title={isPlaying ? "Pause Theme Music" : "Play Minecraft Theme (Sweden)"}
              aria-label="Toggle Theme Music"
            >
              {isPlaying ? (
                <Disc className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" style={{ animationDuration: "3s" }} />
              ) : (
                <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>

            {/* Clickable Track Pill to Open Controls */}
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="h-7 sm:h-8 flex items-center gap-1.5 px-2 bg-[#8B8B8B] hover:bg-[#999999] border-2 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] text-left cursor-pointer shadow-[inset_1px_1px_1px_rgba(0,0,0,0.5)]"
              title="Open Sound Settings"
            >
              {isPlaying ? (
                <div className="flex items-end gap-0.5 h-3 w-3">
                  <span className="w-0.5 bg-[#55FF55] h-2.5 animate-pulse" />
                  <span className="w-0.5 bg-[#55FFFF] h-3 animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <span className="w-0.5 bg-[#FFAA00] h-1.5 animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              ) : (
                <span className="w-1.5 h-1.5 bg-[#FF5555] rounded-none border border-black shrink-0" />
              )}
              <span className="text-[10px] font-black text-white [text-shadow:_1px_1px_0_#000] truncate max-w-[70px] sm:max-w-[85px]">
                {isPlaying ? "SWEDEN" : "MUSIC"}
              </span>
              <SlidersHorizontal className="w-2.5 h-2.5 text-white/80 shrink-0 ml-0.5" />
            </button>
          </div>
        ) : (
          /* Minimal Expanded HUD Controller */
          <div className="space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#8B8B8B] pb-1.5">
              <div className="flex items-center gap-1.5">
                <Disc
                  className={clsx(
                    "w-3 h-3 text-[#55FF55]",
                    isPlaying && "animate-spin"
                  )}
                  style={{ animationDuration: "3s" }}
                />
                <span className="font-black text-[10px] sm:text-[11px] text-black uppercase tracking-tight">
                  JUKEBOX: SWEDEN
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="w-4 h-4 text-[10px] font-black text-[#333333] hover:text-black flex items-center justify-center bg-[#8B8B8B] border border-[#555555] cursor-pointer"
                title="Minimize player"
              >
                <X className="w-2.5 h-2.5 stroke-[3px]" />
              </button>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between gap-1.5 pt-0.5">
              {/* Play / Pause Button */}
              <button
                type="button"
                onClick={togglePlay}
                className={clsx(
                  "px-2 py-1 border-2 font-black text-[10px] uppercase flex items-center gap-1 shadow-[1px_1px_0px_#000] cursor-pointer active:translate-y-0.5 transition-all",
                  isPlaying
                    ? "bg-[#5B8731] hover:bg-[#689B37] text-white border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] [text-shadow:_1px_1px_0_#000]"
                    : "bg-[#707070] hover:bg-[#808080] text-white border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] [text-shadow:_1px_1px_0_#000]"
                )}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-2.5 h-2.5 fill-current" />
                    <span>PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>PLAY</span>
                  </>
                )}
              </button>

              {/* Mute Button */}
              <button
                type="button"
                onClick={toggleMute}
                className="p-1 bg-[#707070] hover:bg-[#808080] text-white border-2 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] shadow-[1px_1px_0px_#000] cursor-pointer active:translate-y-0.5"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-3 h-3 text-[#FF5555]" />
                ) : (
                  <Volume2 className="w-3 h-3 text-[#55FF55]" />
                )}
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-1 flex-1 max-w-[70px] sm:max-w-[80px]">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1.5 bg-[#8B8B8B] rounded-none accent-[#5B8731] cursor-pointer border border-black"
                  title={`Volume: ${Math.round(volume * 100)}%`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
