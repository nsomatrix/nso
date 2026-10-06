"use client";

import React, { useEffect, useState } from "react";
import { SparklesIcon, HeartIcon } from "./Icons";

export function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="brand-logo">
            <div className="logo-icon-wrapper">
              <SparklesIcon size={18} className="logo-icon" />
            </div>
            <span className="logo-title">VanillaNext</span>
          </div>
          <p className="footer-tagline">
            Industry Standard Next.js App Template with Vanilla CSS & Auto Dark/Light Theme.
          </p>
        </div>

        <div className="footer-links-group">
          <div className="footer-col">
            <h4 className="footer-heading">Features</h4>
            <a href="#overview">Overview</a>
            <a href="#responsive">Phone & Desktop</a>
            <a href="#darkmode">Auto Theme</a>
            <a href="#code">Source Code</a>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Stack</h4>
            <span>Next.js 16 App Router</span>
            <span>TypeScript 5</span>
            <span>Pure Vanilla CSS</span>
            <span>React 19</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>&copy; {year} VanillaNext. Built with precision for Phone & Desktop.</p>
        <div className="footer-status">
          <span className="status-indicator"></span>
          <span>System Status: Operational</span>
        </div>
      </div>
    </footer>
  );
}
