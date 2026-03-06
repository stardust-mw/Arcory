"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "arcory-theme";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle({ className }: { className?: string }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);

    if (savedTheme === "dark" || savedTheme === "light") {
      applyTheme(savedTheme);
      return;
    }

    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    applyTheme(preferredTheme);
  }, []);

  return (
    <Button
      aria-label="Toggle theme"
      className={cn("size-8 rounded-none border-0 bg-transparent text-foreground shadow-none hover:bg-transparent", className)}
      onClick={() => {
        const isDark = document.documentElement.classList.contains("dark");
        const nextTheme: Theme = isDark ? "light" : "dark";

        applyTheme(nextTheme);
        localStorage.setItem(STORAGE_KEY, nextTheme);
      }}
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </Button>
  );
}
