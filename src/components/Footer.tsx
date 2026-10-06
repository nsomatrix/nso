"use client";

import React from "react";
import Image from "next/image";

export function Footer() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.NODE_ENV === "production" ? "/nso" : "");

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="brand-logo">
            <Image
              src={`${basePath}/mtx.png`}
              alt="Brand Logo"
              width={140}
              height={42}
              className="brand-logo-img"
            />
          </div>
          <p className="footer-desc">
            Seeking Eternal Glory, One World
          </p>
        </div>

        <div className="footer-status">
          <span className="status-indicator"></span>
          <span>Online</span>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; 2019 Matrix™</p>
      </div>
    </footer>
  );
}
