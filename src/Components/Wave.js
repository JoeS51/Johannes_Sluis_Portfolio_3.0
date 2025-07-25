"use client";
import { cn } from "../utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import { useDarkMode } from './DarkModeContext';

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
  let w,
    h,
    nt,
    i,
    x,
    ctx,
    canvas;
  const canvasRef = useRef(null);
  const { isDarkMode } = useDarkMode();

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
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    w = ctx.canvas.width = window.innerWidth;
    h = ctx.canvas.height = window.innerHeight;
    ctx.filter = `blur(${blur}px)`;
    nt = 0;
    window.onresize = function () {
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };
    render();
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

  const drawWave = (n) => {
    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      for (x = 0; x < w; x += 5) {
        var y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.8); // adjust for height, currently at 50% of the container
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  let animationId;
  const render = () => {
    ctx.fillStyle = isDarkMode ? '#121212' : (backgroundFill || "white");
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillRect(0, 0, w, h);
    drawWave(5);
    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    init();
    return () => {
      cancelAnimationFrame(animationId);
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
