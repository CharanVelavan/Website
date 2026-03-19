"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import BorderGlow from "./BorderGlow";

/**
 * Site-specific BorderGlow wrapper.
 * Adapts backgroundColor to the active theme so the card background
 * matches the page in both light and dark mode.
 */
export default function GlowCard({
  children,
  className = "",
  borderRadius = 16,
  glowColor = "270 55 75",
  colors = ["#c084fc", "#818cf8", "#38bdf8"],
  glowRadius = 32,
  glowIntensity = 0.9,
  edgeSensitivity = 20,
  coneSpread = 25,
  fillOpacity = 0.45,
  ...props
}) {
  const { resolvedTheme } = useTheme();
  // default to dark; updates after hydration
  const [bg, setBg] = useState("#0b0b0b");

  useEffect(() => {
    setBg(resolvedTheme === "light" ? "#ffffff" : "#0b0b0b");
  }, [resolvedTheme]);

  return (
    <BorderGlow
      backgroundColor={bg}
      glowColor={glowColor}
      colors={colors}
      borderRadius={borderRadius}
      glowRadius={glowRadius}
      glowIntensity={glowIntensity}
      edgeSensitivity={edgeSensitivity}
      coneSpread={coneSpread}
      fillOpacity={fillOpacity}
      className={className}
      {...props}
    >
      {children}
    </BorderGlow>
  );
}
