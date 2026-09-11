"use client";

import React, { useEffect, useRef } from "react";

interface ElectricGridProps {
  gridSize?: number;
  beamCount?: number;
  speedMultiplier?: number;
  className?: string;
  drawGrid?: boolean;
  interactive?: boolean;
}

interface Beam {
  x: number;
  y: number;
  length: number;
  speed: number;
  dirX: number; // -1, 0, 1
  dirY: number; // -1, 0, 1
  color: string;
  headColor: string;
  glowColor: string;
  distanceTraveled: number;
  maxDistance: number;
  fadeInDistance: number;
  fadeOutDistance: number;
  turningCooldown: number;
}

const COLOR_PALETTES = [
  // Minecraft Gold / Amber Beam
  {
    color: "rgba(255, 170, 0, 0.85)",
    headColor: "#FFF4B8",
    glowColor: "rgba(255, 170, 0, 0.7)",
  },
  // Diamond / Cyan Beam
  {
    color: "rgba(85, 255, 255, 0.85)",
    headColor: "#E8FFFF",
    glowColor: "rgba(85, 255, 255, 0.7)",
  },
  // Redstone / Warm Flame Beam
  {
    color: "rgba(255, 119, 85, 0.85)",
    headColor: "#FFEBE4",
    glowColor: "rgba(255, 85, 51, 0.7)",
  },
  // Emerald / XP Green Beam
  {
    color: "rgba(85, 255, 85, 0.8)",
    headColor: "#E8FFE8",
    glowColor: "rgba(85, 255, 85, 0.7)",
  },
];

export function ElectricGrid({
  gridSize = 32,
  beamCount = 14,
  speedMultiplier = 1,
  className = "",
  drawGrid = true,
  interactive = true,
}: ElectricGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const beams: Beam[] = [];

    // Helper: Snap coordinates to grid
    const snapToGrid = (val: number) => Math.round(val / gridSize) * gridSize;

    // Helper: Create a fresh beam on grid lines
    const createBeam = (customX?: number, customY?: number): Beam => {
      const palette =
        COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];

      const isHorizontal = Math.random() > 0.5;
      const isForward = Math.random() > 0.5;

      const dirX = isHorizontal ? (isForward ? 1 : -1) : 0;
      const dirY = !isHorizontal ? (isForward ? 1 : -1) : 0;

      const cols = Math.max(1, Math.floor(width / gridSize));
      const rows = Math.max(1, Math.floor(height / gridSize));

      const startX =
        customX !== undefined
          ? snapToGrid(customX)
          : Math.floor(Math.random() * cols) * gridSize;

      const startY =
        customY !== undefined
          ? snapToGrid(customY)
          : Math.floor(Math.random() * rows) * gridSize;

      const maxDist = 350 + Math.random() * 600;

      return {
        x: startX,
        y: startY,
        length: 120 + Math.random() * 140, // 120px to 260px graceful long tail
        speed: (0.45 + Math.random() * 0.4) * speedMultiplier, // Slow, meditative & smooth (0.45 to 0.85 px)
        dirX,
        dirY,
        color: palette.color,
        headColor: palette.headColor,
        glowColor: palette.glowColor,
        distanceTraveled: 0,
        maxDistance: maxDist,
        fadeInDistance: 60,
        fadeOutDistance: 60,
        turningCooldown: 0,
      };
    };

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Re-seed initial beams if needed
      if (beams.length === 0) {
        for (let i = 0; i < beamCount; i++) {
          const beam = createBeam();
          // Stagger distance traveled so beams start naturally placed across the grid
          beam.distanceTraveled = Math.random() * beam.maxDistance;
          beam.x += beam.dirX * beam.distanceTraveled;
          beam.y += beam.dirY * beam.distanceTraveled;
          beams.push(beam);
        }
      }
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(canvas);

    // Interactive mouse trigger
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Occasionally spawn a gentle slow beam near the cursor
      if (Math.random() < 0.08 && beams.length < beamCount + 3) {
        beams.push(createBeam(mouseX, mouseY));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle background grid
      if (drawGrid && width > 0 && height > 0) {
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 1;

        ctx.beginPath();
        // Vertical grid lines
        for (let x = 0; x <= width; x += gridSize) {
          ctx.moveTo(x + 0.5, 0);
          ctx.lineTo(x + 0.5, height);
        }
        // Horizontal grid lines
        for (let y = 0; y <= height; y += gridSize) {
          ctx.moveTo(0, y + 0.5);
          ctx.lineTo(width, y + 0.5);
        }
        ctx.stroke();
        ctx.restore();
      }

      // 2. Update and draw electric current beams smoothly
      for (let i = 0; i < beams.length; i++) {
        const b = beams[i];

        // Move beam forward smoothly
        b.x += b.dirX * b.speed;
        b.y += b.dirY * b.speed;
        b.distanceTraveled += b.speed;
        b.turningCooldown += b.speed;

        // Occasional smooth 90-degree turn at grid intersections
        if (b.turningCooldown > gridSize * 4) {
          const nearX = Math.abs(b.x - snapToGrid(b.x)) < b.speed * 0.9;
          const nearY = Math.abs(b.y - snapToGrid(b.y)) < b.speed * 0.9;

          if (nearX && nearY && Math.random() < 0.12) {
            b.x = snapToGrid(b.x);
            b.y = snapToGrid(b.y);
            b.turningCooldown = 0;

            if (b.dirX !== 0) {
              b.dirY = Math.random() > 0.5 ? 1 : -1;
              b.dirX = 0;
            } else {
              b.dirX = Math.random() > 0.5 ? 1 : -1;
              b.dirY = 0;
            }
          }
        }

        // Calculate smooth opacity (fade in on spawn, fade out on finish)
        let alpha = 1;
        if (b.distanceTraveled < b.fadeInDistance) {
          alpha = b.distanceTraveled / b.fadeInDistance;
        } else if (b.distanceTraveled > b.maxDistance - b.fadeOutDistance) {
          alpha = Math.max(
            0,
            (b.maxDistance - b.distanceTraveled) / b.fadeOutDistance
          );
        }

        // Calculate tail position
        const tailX = b.x - b.dirX * b.length;
        const tailY = b.y - b.dirY * b.length;

        ctx.save();
        ctx.globalAlpha = alpha;

        // Soft, smooth glow
        ctx.shadowColor = b.glowColor;
        ctx.shadowBlur = 8;
        ctx.lineWidth = 2.2;
        ctx.lineCap = "round";

        const gradient = ctx.createLinearGradient(tailX, tailY, b.x, b.y);
        // Head to tail gradient: bright -> dark -> transparent
        gradient.addColorStop(0, "rgba(0, 0, 0, 0)"); // Tail: completely transparent
        gradient.addColorStop(0.25, "rgba(0, 0, 0, 0)");
        gradient.addColorStop(0.6, b.color); // Body: rich color
        gradient.addColorStop(0.88, b.headColor); // Upper body: bright
        gradient.addColorStop(1, "#FFFFFF"); // Leading head: pure bright

        ctx.strokeStyle = gradient;

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        // Leading Head Spark
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Despawn condition: smoothly finished or moved far out of view
        const isOutOfBounds =
          b.x < -b.length * 2 ||
          b.x > width + b.length * 2 ||
          b.y < -b.length * 2 ||
          b.y > height + b.length * 2;

        if (b.distanceTraveled >= b.maxDistance || isOutOfBounds) {
          beams[i] = createBeam();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gridSize, beamCount, speedMultiplier, drawGrid, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className}`}
    />
  );
}
