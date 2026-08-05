"use client";

import { Moon, Sun, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative size-9 rounded-full border-border/60 bg-background/60 backdrop-blur-md hover:bg-muted active:scale-95 transition-all duration-200 focus-visible:ring-1 focus-visible:ring-primary shadow-sm touch-manipulation"
        >
          {/* Sun Icon Animation */}
          <Sun className="size-[1.1rem] text-amber-500 scale-100 rotate-0 transition-all duration-300 ease-in-out dark:scale-0 dark:-rotate-90" />
          
          {/* Moon Icon Animation */}
          <Moon className="absolute size-[1.1rem] text-blue-400 scale-0 rotate-90 transition-all duration-300 ease-in-out dark:scale-100 dark:rotate-0" />
          
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      {/* Sleek Glassmorphic Dropdown Menu */}
      <DropdownMenuContent
        align="end"
        className="w-36 p-1.5 mt-2 rounded-2xl border border-border/80 bg-background/95 backdrop-blur-2xl shadow-2xl animate-in fade-in-80 zoom-in-95 duration-150"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors focus:bg-primary/10 focus:text-primary active:scale-95"
        >
          <span className="flex items-center gap-2">
            <Sun className="size-3.5 text-amber-500" />
            Light
          </span>
          {theme === "light" && <Check className="size-3.5 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors focus:bg-primary/10 focus:text-primary active:scale-95"
        >
          <span className="flex items-center gap-2">
            <Moon className="size-3.5 text-blue-400" />
            Dark
          </span>
          {theme === "dark" && <Check className="size-3.5 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors focus:bg-primary/10 focus:text-primary active:scale-95"
        >
          <span className="flex items-center gap-2">
            <span className="size-3.5 flex items-center justify-center font-mono text-[10px] font-bold text-muted-foreground">⚙</span>
            System
          </span>
          {theme === "system" && <Check className="size-3.5 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}