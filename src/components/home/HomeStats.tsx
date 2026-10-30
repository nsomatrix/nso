"use client";

import React from "react";
import { MonitorIcon, SmartphoneIcon, SparklesIcon, FileIcon } from "../Icons";

export function HomeStats() {
  const stats = [
    {
      icon: <SparklesIcon size={22} className="stat-icon-svg" />,
      label: "Direct R2 Cloud",
      sublabel: "Ultra-fast direct downloads with zero third-party ads",
    },
    {
      icon: <SmartphoneIcon size={22} className="stat-icon-svg" />,
      label: "Mobile & PC Ready",
      sublabel: "Pre-configured J2ME Loader, Kemulator & CoffeeVM",
    },
    {
      icon: <FileIcon size={22} className="stat-icon-svg" />,
      label: "Modded Archives",
      sublabel: "AngelChip, JLMod, and community automation tools",
    },
    {
      icon: <MonitorIcon size={22} className="stat-icon-svg" />,
      label: "Open Database",
      sublabel: "Complete guides, item encyclopaedia & game mechanics",
    },
  ];

  return (
    <section className="stats-section">
      <div className="stats-grid">
        {stats.map((item, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon-wrapper">{item.icon}</div>
            <div className="stat-content">
              <h3 className="stat-title">{item.label}</h3>
              <p className="stat-sub">{item.sublabel}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
