"use client";

import React from "react";
import { SparklesIcon, ArrowRightIcon, ZapIcon, PaletteIcon, SmartphoneIcon, MonitorIcon } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";

export function Hero() {
  return (
    <section id="overview" className="hero-section">
      <div className="hero-glow hero-glow-1"></div>
      <div className="hero-glow hero-glow-2"></div>

      <div className="container hero-container">
        {/* Animated Badge */}
        <div className="hero-badge-wrapper">
          <div className="hero-badge">
            <SparklesIcon size={14} className="badge-sparkle" />
            <span>Next.js 16 App Router &bull; Vanilla CSS</span>
            <span className="badge-live">Live</span>
          </div>
        </div>

        {/* Hero Main Headline */}
        <h1 className="hero-title">
          Hello World. <br />
          <span className="gradient-text">Modern Phone & Desktop App.</span>
        </h1>

        {/* Hero Description */}
        <p className="hero-description">
          An industry-standard Next.js foundation built using pure Vanilla CSS tokens,
          automatic system dark/light mode detection, and zero heavy dependencies.
        </p>

        {/* Quick Theme Switcher Box */}
        <div className="hero-toggle-card">
          <div className="toggle-card-label">
            <PaletteIcon size={16} />
            <span>Interactive Auto Dark/Light Theme Controller</span>
          </div>
          <ThemeToggle />
        </div>

        {/* Action Buttons */}
        <div className="hero-cta-group">
          <a href="#responsive" className="btn btn-primary">
            <span>Test Phone & Desktop</span>
            <ArrowRightIcon size={18} />
          </a>
          <a href="#code" className="btn btn-secondary">
            <span>View Architecture</span>
          </a>
        </div>

        {/* Stats & Highlights */}
        <div className="hero-stats-grid">
          <div className="stat-card">
            <div className="stat-icon-box cyan">
              <ZapIcon size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">100/100</span>
              <span className="stat-label">Lighthouse Performance</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-box purple">
              <PaletteIcon size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">Auto / Light / Dark</span>
              <span className="stat-label">CSS Theme Engine</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-box emerald">
              <SmartphoneIcon size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">Phone & Desktop</span>
              <span className="stat-label">Fluid Media Layout</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
