"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { SparklesIcon, MenuIcon, CloseIcon } from "./Icons";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner container">
        {/* Brand Logo */}
        <Link href="/" className="brand-logo">
          <div className="logo-icon-wrapper">
            <SparklesIcon size={18} className="logo-icon" />
          </div>
          <div className="logo-text-group">
            <span className="logo-title">NextApp</span>
            <span className="logo-badge">App Router</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link href="/" className="nav-link active">Home</Link>
          <a href="#about" className="nav-link">About</a>
          <a href="#features" className="nav-link">Features</a>
        </nav>

        {/* Right Actions - Theme Switcher */}
        <div className="header-actions">
          <div className="desktop-theme-toggle">
            <ThemeToggle />
          </div>
          <button
            className="mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link active">
              Home
            </Link>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              About
            </a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              Features
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
