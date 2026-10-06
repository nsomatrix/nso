"use client";

import React from "react";
import { ThemeToggle } from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const { resolvedTheme } = useTheme();

  return (
    <main className="hello-container">
      <div className="hello-card">
        <h1 className="hello-title">Hello World</h1>
        <p className="hello-subtitle">
          Industry standard Next.js app in Vanilla CSS with automatic Dark/Light mode.
        </p>

        <div className="toggle-wrapper">
          <ThemeToggle />
        </div>

        <div className="active-info">
          <span>Active Theme: <strong>{resolvedTheme}</strong></span>
        </div>
      </div>
    </main>
  );
}
