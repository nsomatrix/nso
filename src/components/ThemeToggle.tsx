"use client";

import React, { useEffect, useState } from "react";
import { useTheme, ThemeMode } from "../context/ThemeContext";
import { SunIcon, MoonIcon, MonitorIcon } from "./Icons";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
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
      label: `Auto (${systemTheme})`,
      icon: <MonitorIcon size={16} />,
    },
    {
      id: "light",
      label: "Light",
      icon: <SunIcon size={16} />,
    },
    {
      id: "dark",
      label: "Dark",
      icon: <MoonIcon size={16} />,
    },
  ];

  return (
    <div className="theme-toggle-wrapper" role="radiogroup" aria-label="Theme selection">
      <div className="theme-toggle-container">
        {options.map((option) => {
          const isActive = theme === option.id;
          return (
            <button
              key={option.id}
              onClick={() => setTheme(option.id)}
              className={`theme-toggle-btn ${isActive ? "active" : ""}`}
              role="radio"
              aria-checked={isActive}
              title={`Switch to ${option.label} theme`}
            >
              <span className="theme-btn-icon">{option.icon}</span>
              <span className="theme-btn-text">{option.label}</span>
            </button>
          );
        })}
      </div>
      <div className="theme-status-badge">
        <span className="status-dot"></span>
        <span className="status-text">
          Active Mode: <strong>{resolvedTheme.toUpperCase()}</strong>
          {theme === "system" && <span className="auto-tag"> (System Matched)</span>}
        </span>
      </div>
    </div>
  );
}
