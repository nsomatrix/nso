"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MenuIcon, CloseIcon } from "./Icons";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Wall", href: "/wall" },
    { label: "Emulators", href: "/emulators" },
    { label: "MODs", href: "/mods" },
    { label: "NinjaDEX", href: "/ninjadex" },
  ];

  return (
    <header className="site-header">
      <div className="header-inner container">
        {/* Brand Logo */}
        <Link href="/" className="brand-logo">
          <Image
            src="/mtx.png"
            alt="Brand Logo"
            width={160}
            height={48}
            className="brand-logo-img"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return item.href.startsWith("/") ? (
              <Link
                key={item.label}
                href={item.href}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} className="nav-link">
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
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
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return item.href.startsWith("/") ? (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-link ${isActive ? "active" : ""}`}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-nav-link"
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
