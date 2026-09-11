"use client";

import React, { useEffect, useRef } from "react";

// Web Audio API buffer cache for zero-latency instant button click sounds
let audioCtx: AudioContext | null = null;
let clickAudioBuffer: AudioBuffer | null = null;
let isAudioLoaded = false;

export function playButtonClickSound(volume = 0.5) {
  if (typeof window === "undefined") return;

  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }

    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }

    if (audioCtx && clickAudioBuffer) {
      const source = audioCtx.createBufferSource();
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = volume;
      source.buffer = clickAudioBuffer;
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      source.start(0);
      return;
    }

    // Fallback: HTML5 Audio clone
    const audio = new Audio("/sounds/ButtonClick.mp3");
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch (err) {
    // Gracefully handle any browser audio policy or environment restrictions
    console.debug("Audio click sound effect prevented:", err);
  }
}

export function MinecraftSoundEffects() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || typeof window === "undefined") return;
    initialized.current = true;

    // Preload and decode ButtonClick.mp3 for instant playback
    const loadAudioBuffer = async () => {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;

        if (!audioCtx) {
          audioCtx = new AudioContextClass();
        }

        const response = await fetch("/sounds/ButtonClick.mp3");
        const arrayBuffer = await response.arrayBuffer();
        clickAudioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        isAudioLoaded = true;
      } catch (e) {
        console.debug("Failed to preload click audio buffer via Web Audio API, will use HTML5 Audio fallback:", e);
      }
    };

    loadAudioBuffer();

    // Global click listener for all interactive elements
    const handleGlobalPointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if target or any parent is interactive
      const isInteractive = target.closest(
        "button, a, input, select, textarea, [role='button'], [role='tab'], [role='checkbox'], [role='menuitem'], .cursor-pointer, [data-clickable]"
      );

      if (isInteractive) {
        playButtonClickSound(0.45);
      }
    };

    document.addEventListener("pointerdown", handleGlobalPointerDown, { capture: true, passive: true });

    return () => {
      document.removeEventListener("pointerdown", handleGlobalPointerDown, { capture: true });
    };
  }, []);

  return null;
}
