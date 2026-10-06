"use client";

import React, { useEffect, useState } from "react";
import { SparklesIcon } from "./Icons";

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
              <SparklesIcon size={16} className="logo-icon" />
            </div>
            <span className="logo-title">NextApp</span>
          </div>
          <p className="footer-desc">
            Industry standard Next.js template built with Vanilla CSS & Auto Dark/Light theme mode.
          </p>
        </div>

        <div className="footer-status">
          <span className="status-indicator"></span>
          <span>Phone & Desktop Ready</span>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {year} NextApp. All rights reserved.</p>
      </div>
    </footer>
  );
}
