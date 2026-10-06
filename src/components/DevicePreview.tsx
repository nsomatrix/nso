"use client";

import React, { useState } from "react";
import { SmartphoneIcon, MonitorIcon, SunIcon, MoonIcon, ZapIcon, SparklesIcon, ShieldCheckIcon } from "./Icons";
import { useTheme } from "../context/ThemeContext";

export function DevicePreview() {
  const [deviceMode, setDeviceMode] = useState<"phone" | "tablet" | "desktop">("desktop");
  const { resolvedTheme } = useTheme();

  return (
    <section id="responsive" className="device-preview-section section">
      <div className="container">
        <div className="section-header center">
          <div className="section-pill">
            <SmartphoneIcon size={14} /> & <MonitorIcon size={14} />
            <span>Responsive Architecture</span>
          </div>
          <h2 className="section-title">
            Optimized for <span className="gradient-text">Phone & Desktop</span>
          </h2>
          <p className="section-subtitle">
            Seamlessly adapts to any screen width using zero-framework, highly optimized pure Vanilla CSS media queries and CSS grid math.
          </p>
        </div>

        {/* Device Switcher Controls */}
        <div className="device-controls">
          <button
            className={`device-btn ${deviceMode === "phone" ? "active" : ""}`}
            onClick={() => setDeviceMode("phone")}
          >
            <SmartphoneIcon size={18} />
            <span>Phone View (375px)</span>
          </button>
          <button
            className={`device-btn ${deviceMode === "tablet" ? "active" : ""}`}
            onClick={() => setDeviceMode("tablet")}
          >
            <SmartphoneIcon size={18} style={{ transform: "rotate(-90deg)" }} />
            <span>Tablet View (768px)</span>
          </button>
          <button
            className={`device-btn ${deviceMode === "desktop" ? "active" : ""}`}
            onClick={() => setDeviceMode("desktop")}
          >
            <MonitorIcon size={18} />
            <span>Desktop View (1200px)</span>
          </button>
        </div>

        {/* Dynamic Frame Display */}
        <div className="preview-viewport-container">
          <div className={`mockup-frame mockup-${deviceMode}`}>
            <div className="mockup-header">
              <div className="mockup-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <div className="mockup-url-bar">
                <span className="url-lock">https://</span>
                <span className="url-text">localhost:3000 (Vanilla Next.js App)</span>
              </div>
              <div className="mockup-status">
                <span className="badge-theme">{resolvedTheme.toUpperCase()} MODE</span>
              </div>
            </div>

            <div className="mockup-content">
              <div className="mini-app-screen">
                <header className="mini-header">
                  <span className="mini-brand">⚡ Hello World</span>
                  <span className="mini-tag">Next.js 16</span>
                </header>

                <main className="mini-body">
                  <div className="mini-hero">
                    <h3>Adaptive Layout Test</h3>
                    <p>Testing dynamic viewport response in pure CSS.</p>
                  </div>

                  <div className="mini-grid">
                    <div className="mini-card">
                      <ZapIcon size={18} className="mini-icon cyan" />
                      <h4>Fast Execution</h4>
                      <p>Instant CSS compilation.</p>
                    </div>
                    <div className="mini-card">
                      <SparklesIcon size={18} className="mini-icon purple" />
                      <h4>Auto Theme</h4>
                      <p>Matches OS theme preference.</p>
                    </div>
                    <div className="mini-card">
                      <ShieldCheckIcon size={18} className="mini-icon emerald" />
                      <h4>Type Safe</h4>
                      <p>Strict TypeScript App Router.</p>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
