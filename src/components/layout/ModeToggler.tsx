"use client";

import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  // Single Click Direct Toggle Handler
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="relative size-9 rounded-full border border-border/70 bg-background/80 backdrop-blur-md shadow-sm hover:border-[#FF5500]/40 hover:bg-muted/60 active:scale-90 transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[#FF5500]/50 touch-manipulation group overflow-hidden"
    >
      {/* Background Subtle Ambient Glow on Hover */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/10 to-[#FF5500]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-blue-500/10 dark:to-indigo-500/10" />

      {/* Sun Icon (Visible in Light Mode) */}
      <Sun className="size-[1.15rem] text-amber-500 transition-all duration-500 ease-spring scale-100 rotate-0 opacity-100 dark:scale-0 dark:-rotate-90 dark:opacity-0" />

      {/* Moon Icon (Visible in Dark Mode) */}
      <Moon className="absolute size-[1.15rem] text-sky-400 transition-all duration-500 ease-spring scale-0 rotate-90 opacity-0 dark:scale-100 dark:rotate-0 dark:opacity-100" />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}