"use client";

import React, { useEffect, useState } from "react";
import { useTheme, ThemeMode } from "../context/ThemeContext";
import { SunIcon, MoonIcon, MonitorIcon } from "./Icons";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="theme-toggle-skeleton" aria-hidden="true">
        <div className="skeleton-btn"></div>
      </div>
    );
  }

  const options: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
    {
      id: "system",
      label: `System Auto (${systemTheme})`,
      icon: <MonitorIcon size={16} />,
    },
    {
      id: "light",
      label: "Light Mode",
      icon: <SunIcon size={16} />,
    },
    {
      id: "dark",
      label: "Dark Mode",
      icon: <MoonIcon size={16} />,
    },
  ];

  return (
    <div className="theme-toggle-container" role="radiogroup" aria-label="Theme selection">
      {options.map((option) => {
        const isActive = theme === option.id;
        return (
          <button
            key={option.id}
            onClick={() => setTheme(option.id)}
            className={`theme-toggle-btn ${isActive ? "active" : ""}`}
            role="radio"
            aria-checked={isActive}
            title={option.label}
            aria-label={option.label}
          >
            <span className="theme-btn-icon">{option.icon}</span>
          </button>
        );
      })}
    </div>
  );
}
