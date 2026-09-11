"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, Disc, Music } from "lucide-react";
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
    }, 6000);
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
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 select-none font-mono">
      {/* Toast Notification when Track Starts */}
      {showToast && (
        <div className="mb-2 bg-[#1B1B1B]/95 border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] px-3.5 py-2 shadow-[4px_4px_0px_#000] flex items-center gap-2.5 animate-bounce-short">
          <Disc className="w-4 h-4 text-[#55FF55] animate-spin" style={{ animationDuration: "3s" }} />
          <div className="text-[11px] font-bold text-white [text-shadow:_1px_1px_0_#000]">
            <span className="text-[#FFAA00]">NOW PLAYING:</span> C418 - Sweden (OST)
          </div>
        </div>
      )}

      {/* Main Minecraft Jukebox Widget */}
      <div
        className={clsx(
          "bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[6px_6px_0px_#000] transition-all duration-200 overflow-hidden",
          isExpanded ? "p-3 sm:p-4 w-72 sm:w-80" : "p-2 sm:p-2.5"
        )}
      >
        {!isExpanded ? (
          /* Compact Jukebox Button */
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className={clsx(
                "p-2 border-3 flex items-center justify-center cursor-pointer transition-transform active:translate-y-0.5 shadow-[2px_2px_0px_#000]",
                isPlaying
                  ? "bg-[#5B8731] hover:bg-[#689B37] text-white border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813]"
                  : "bg-[#707070] hover:bg-[#808080] text-white border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838]"
              )}
              title={isPlaying ? "Pause Theme Song" : "Play Minecraft Theme Song (Sweden)"}
              aria-label="Toggle Theme Music"
            >
              {isPlaying ? (
                <Disc className="w-5 h-5 animate-spin" style={{ animationDuration: "4s" }} />
              ) : (
                <Music className="w-5 h-5" />
              )}
            </button>

            {/* Equalizer animation & Title button to expand */}
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 px-2.5 py-1 bg-[#8B8B8B] hover:bg-[#999999] border-2 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] text-left cursor-pointer shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]"
              title="Expand Music Player"
            >
              {isPlaying ? (
                <div className="flex items-end gap-0.5 h-4 w-4">
                  <span className="w-1 bg-[#55FF55] h-3 animate-pulse" />
                  <span className="w-1 bg-[#55FFFF] h-4 animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <span className="w-1 bg-[#FFAA00] h-2 animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              ) : (
                <span className="w-2 h-2 bg-[#FF5555] rounded-none border border-black" />
              )}
              <span className="text-[11px] font-black text-white [text-shadow:_1px_1px_0_#000] truncate max-w-[100px] sm:max-w-[120px]">
                {isPlaying ? "SWEDEN" : "MUSIC OFF"}
              </span>
            </button>
          </div>
        ) : (
          /* Expanded HUD Controller */
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-[#8B8B8B] pb-2">
              <div className="flex items-center gap-2">
                <Disc
                  className={clsx(
                    "w-4 h-4 text-[#55FF55]",
                    isPlaying && "animate-spin"
                  )}
                  style={{ animationDuration: "3s" }}
                />
                <span className="font-black text-xs text-black uppercase">
                  MINECRAFT JUKEBOX
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-xs font-black text-[#333333] hover:text-black px-1.5 py-0.5 bg-[#8B8B8B] border border-[#555555] cursor-pointer"
                title="Minimize player"
              >
                ✕
              </button>
            </div>

            {/* Track Info Box */}
            <div className="p-2.5 bg-[#8B8B8B] border-2 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)]">
              <div className="text-[10px] font-black text-[#55FFFF] uppercase [text-shadow:_1px_1px_0_#000]">
                PROJECT THEME SONG
              </div>
              <div className="text-xs font-black text-white truncate [text-shadow:_1px_1px_0_#000]">
                C418 - Sweden (Minecraft OST)
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                {/* Play / Pause 3D Button */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className={clsx(
                    "px-3 py-1.5 border-3 font-black text-xs uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_#000] cursor-pointer active:translate-y-0.5 transition-all",
                    isPlaying
                      ? "bg-[#5B8731] hover:bg-[#689B37] text-white border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] [text-shadow:_1px_1px_0_#000]"
                      : "bg-[#707070] hover:bg-[#808080] text-white border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] [text-shadow:_1px_1px_0_#000]"
                  )}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>PAUSE</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>PLAY</span>
                    </>
                  )}
                </button>

                {/* Mute Button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 bg-[#707070] hover:bg-[#808080] text-white border-3 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] shadow-[2px_2px_0px_#000] cursor-pointer active:translate-y-0.5"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-[#FF5555]" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-[#55FF55]" />
                  )}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5 flex-1 max-w-[90px] sm:max-w-[100px]">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-[#8B8B8B] rounded-none accent-[#5B8731] cursor-pointer border border-black"
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
