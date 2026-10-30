"use client";

import React, { useState, useEffect } from "react";
import { calculateUptime, UptimeData } from "../../utils/nsoEvents";

export function InceptionUptime() {
  const [uptime, setUptime] = useState<UptimeData | null>(null);

  useEffect(() => {
    setUptime(calculateUptime());

    const interval = setInterval(() => {
      setUptime(calculateUptime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!uptime) {
    return (
      <div className="glass-uptime-card">
        <div className="uptime-sync-text">Connecting to Chrono Node...</div>
      </div>
    );
  }

  const units = [
    { value: uptime.years, label: "YRS" },
    { value: uptime.months, label: "MOS" },
    { value: uptime.days, label: "DAYS" },
    { value: String(uptime.hours).padStart(2, "0"), label: "HRS" },
    { value: String(uptime.minutes).padStart(2, "0"), label: "MIN" },
    { value: String(uptime.seconds).padStart(2, "0"), label: "SEC", isLive: true },
  ];

  return (
    <div className="glass-uptime-card">
      <div className="glass-uptime-header">
        <div className="uptime-badge-group">
          <span className="uptime-beacon-pulse" />
          <span className="uptime-beacon-text">PLATFORM INCEPTION UPTIME</span>
        </div>
        <span className="uptime-date-stamp">EST. FEB 01, 2019</span>
      </div>

      <div className="glass-uptime-grid">
        {units.map((unit) => (
          <div
            key={unit.label}
            className={`uptime-unit-card ${unit.isLive ? "unit-card-live" : ""}`}
          >
            <span className="uptime-unit-val">{unit.value}</span>
            <span className="uptime-unit-lbl">{unit.label}</span>
          </div>
        ))}
      </div>

      <div className="glass-uptime-footer">
        <span className="uptime-footer-tag">
          &gt; Continuous Operation • Direct R2 Edge Mirrors
        </span>
      </div>
    </div>
  );
}
