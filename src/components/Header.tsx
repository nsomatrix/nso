"use client";

import React, { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { SparklesIcon, MenuIcon, CloseIcon, SmartphoneIcon, MonitorIcon } from "./Icons";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner container">
        {/* Brand Logo */}
        <a href="#" className="brand-logo">
          <div className="logo-icon-wrapper">
            <SparklesIcon size={20} className="logo-icon" />
          </div>
          <div className="logo-text-group">
            <span className="logo-title">VanillaNext</span>
            <span className="logo-badge">App Router</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <a href="#overview" className="nav-link">Overview</a>
          <a href="#responsive" className="nav-link">Phone & Desktop</a>
          <a href="#darkmode" className="nav-link">Auto Dark Mode</a>
          <a href="#code" className="nav-link">Snippet</a>
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions">
          <div className="desktop-theme-toggle">
            <ThemeToggle />
          </div>
          <button
            className="mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav">
            <a href="#overview" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              Overview
            </a>
            <a href="#responsive" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              Phone & Desktop
            </a>
            <a href="#darkmode" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              Auto Dark Mode
            </a>
            <a href="#code" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              Code Snippet
            </a>
          </nav>
          <div className="mobile-drawer-footer">
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
