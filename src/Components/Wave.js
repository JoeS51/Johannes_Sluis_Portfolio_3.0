"use client";
import { cn } from "../utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import { useDarkMode } from './DarkModeContext';

// Easing function for organic feel
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 3,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}) => {
  const noise = createNoise3D();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const dimensionsRef = useRef({ w: 0, h: 0 });
  const ntRef = useRef(0);
  const { isDarkMode } = useDarkMode();

  // Wave entrance animation timing
  const animationStartTime = useRef(null);
  const entranceDuration = 1800; // 1.8 seconds for cinematic feel
  const entranceDelay = 300; // Start with other elements

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const init = () => {
    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext("2d");
    const ctx = ctxRef.current;
    dimensionsRef.current.w = ctx.canvas.width = window.innerWidth;
    dimensionsRef.current.h = ctx.canvas.height = window.innerHeight;
    ctx.filter = `blur(${blur}px)`;
    ntRef.current = 0;
    window.onresize = function () {
      if (ctxRef.current) {
        dimensionsRef.current.w = ctxRef.current.canvas.width = window.innerWidth;
        dimensionsRef.current.h = ctxRef.current.canvas.height = window.innerHeight;
        ctxRef.current.filter = `blur(${blur}px)`;
      }
    };
    // Start animation loop with requestAnimationFrame to get proper timestamp
    animationIdRef.current = requestAnimationFrame(render);
  };

  // Define separate color palettes for light and dark modes
  const lightModeColors = colors ?? [
    "#a7fcab",  // Light mint green
    "#b7fcb4",  // Slightly lighter mint green
    "#c2f0fc",  // Soft blue
    "#bdecff",  // Light cyan
    "#bdf5ff",  // Pale aqua
  ];

  const darkModeColors = [
    "#3f51b5",  // Indigo
    "#5c6bc0",  // Light indigo
    "#303f9f",  // Dark indigo
    "#7986cb",  // Light purple
    "#3d5afe",  // Bright blue
  ];

  // Add more color options for better variety in dark mode
  const extendedDarkModeColors = [
    "#3f51b5",  // Indigo
    "#5c6bc0",  // Light indigo
    "#303f9f",  // Dark indigo
    "#7986cb",  // Light purple
    "#3d5afe",  // Bright blue
    "#5e35b1",  // Deep purple
    "#7e57c2",  // Medium purple
    "#2196f3",  // Blue
    "#42a5f5",  // Light blue
  ];

  const waveColors = isDarkMode ? extendedDarkModeColors : lightModeColors;

  const drawWave = (n, progress) => {
    const ctx = ctxRef.current;
    const { w, h } = dimensionsRef.current;
    if (!ctx || !w) return;

    ntRef.current += getSpeed();
    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];

      // Each wave has a staggered start but same animation duration
      // This keeps every wave moving at the same smooth pace
      const waveDelay = i * 0.06; // 6% staggered start per wave
      const waveAnimDuration = 0.7; // Each wave takes 70% of total time to complete
      const waveProgress = Math.max(0, Math.min(1, (progress - waveDelay) / waveAnimDuration));
      const easedProgress = easeOutCubic(waveProgress);

      // Calculate how far to draw this wave
      const maxX = easedProgress * w;

      for (let x = 0; x < Math.min(maxX, w); x += 5) {
        const y = noise(x / 800, 0.3 * i, ntRef.current) * 100;
        ctx.lineTo(x, y + h * 0.8);
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  const animationIdRef = useRef(null);
  const progressRef = useRef(0);

  const render = (timestamp) => {
    const ctx = ctxRef.current;
    const { w, h } = dimensionsRef.current;
    if (!ctx) return; // Safety check

    // Handle entrance animation timing
    if (animationStartTime.current === null) {
      animationStartTime.current = timestamp + entranceDelay;
    }

    const elapsed = timestamp - animationStartTime.current;
    progressRef.current = elapsed > 0 ? Math.min(1, elapsed / entranceDuration) : 0;

    ctx.fillStyle = isDarkMode ? '#121212' : (backgroundFill || "white");
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillRect(0, 0, w, h);
    drawWave(5, progressRef.current);
    animationIdRef.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    // Reset animation on mount/theme change
    animationStartTime.current = null;
    progressRef.current = 0;
    init();
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isDarkMode]); // Re-initialize when dark mode changes

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    // I'm sorry but i have got to support it on safari.
    setIsSafari(typeof window !== "undefined" &&
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome"));
  }, []);

  return (
    (<div
      className={cn("flex flex-col items-center justify-center", containerClassName)}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>)
  );
};
