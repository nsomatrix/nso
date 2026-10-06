"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "system" | "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
  systemTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage and detect system preference
  useEffect(() => {
    const savedTheme = (localStorage.getItem("app-theme") as ThemeMode) || "system";
    setThemeState(savedTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    const handleSystemChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    setMounted(true);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, []);

  // Update HTML data-theme attribute whenever theme or system preference changes
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (theme === "system") {
      root.setAttribute("data-theme", "system");
      localStorage.setItem("app-theme", "system");
    } else {
      root.setAttribute("data-theme", theme);
      localStorage.setItem("app-theme", theme);
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, systemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
