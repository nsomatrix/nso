"use client";

import React from "react";
import { PaletteIcon, SmartphoneIcon, ZapIcon, ShieldCheckIcon, CodeIcon, MonitorIcon } from "./Icons";

export function FeatureGrid() {
  const features = [
    {
      icon: <PaletteIcon size={24} className="feature-icon text-indigo" />,
      title: "Auto Dark & Light Mode",
      description:
        "Seamlessly switches between System default preferences, Light mode, and Dark mode without page flicker or hydration mismatch.",
    },
    {
      icon: <SmartphoneIcon size={24} className="feature-icon text-cyan" />,
      title: "Phone & Desktop Responsive",
      description:
        "Fluid flexbox and grid mathematical layout designed from mobile 320px screens up to ultrawide 4K desktop displays.",
    },
    {
      icon: <CodeIcon size={24} className="feature-icon text-purple" />,
      title: "Pure Vanilla CSS",
      description:
        "Built strictly with native CSS variables, custom utilities, and modern CSS color-mix() without heavy external framework bloat.",
    },
    {
      icon: <ZapIcon size={24} className="feature-icon text-emerald" />,
      title: "Industry Standard Next.js",
      description:
        "Leverages Next.js 16 App Router, TypeScript, React Server Components, and optimized font loading for maximum SEO and speed.",
    },
    {
      icon: <ShieldCheckIcon size={24} className="feature-icon text-amber" />,
      title: "Zero FOUC SSR Script",
      description:
        "Includes an ultra-light inline script in the document head that reads stored theme preferences before rendering to prevent white flash.",
    },
    {
      icon: <MonitorIcon size={24} className="feature-icon text-rose" />,
      title: "Accessible & Clean",
      description:
        "Semantic HTML5 structure, ARIA radio group attributes, focus rings, high contrast ratios, and touch-friendly targets.",
    },
  ];

  return (
    <section id="darkmode" className="feature-section section">
      <div className="container">
        <div className="section-header center">
          <div className="section-pill">
            <ZapIcon size={14} />
            <span>Architecture Highlights</span>
          </div>
          <h2 className="section-title">
            Built to <span className="gradient-text">Industry Standards</span>
          </h2>
          <p className="section-subtitle">
            Every layer of this application is crafted for simplicity, speed, and standard compliance.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon-wrapper">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
