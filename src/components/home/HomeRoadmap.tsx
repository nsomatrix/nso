"use client";

import React from "react";
import { CheckIcon, SparklesIcon, FileIcon } from "../Icons";

interface RoadmapItem {
  title: string;
  category: string;
  description: string;
  status: "Completed" | "In Progress" | "Upcoming";
}

export function HomeRoadmap() {
  const items: RoadmapItem[] = [
    {
      title: "Cloudflare R2 Storage & Sync",
      category: "Infrastructure",
      description: "Direct high-speed edge distribution for all J2ME JARs, APKs, and emulators without file host captchas.",
      status: "Completed",
    },
    {
      title: "MODs Repository & Filtering",
      category: "Platform",
      description: "Live search, format filtering (.jar, .zip), and direct checksum verification for community modded builds.",
      status: "Completed",
    },
    {
      title: "NinjaDEX Skill & Equipment Database",
      category: "Database",
      description: "Comprehensive gear statistics, upgrade stone requirements, skill trees, and boss spawn notification hooks.",
      status: "In Progress",
    },
    {
      title: "Networking and Client APIs",
      category: "APIs & Webhooks",
      description: "Public REST and WebSocket endpoints for in-game server ping, player ranking stats, and real-time alerts.",
      status: "In Progress",
    },
    {
      title: "Matrix Connect & Discord Bot",
      category: "Community",
      description: "Unified account binding, personal mod presets sync, and in-game market tracker directly inside Discord.",
      status: "Upcoming",
    },
  ];

  return (
    <section className="roadmap-section">
      <div className="section-header-center">
        <span className="section-eyebrow">Development Progress</span>
        <h2 className="section-heading">Project Roadmap &amp; Features</h2>
        <p className="section-lead">
          Track the evolution of the NSO Matrix portal and upcoming tools.
        </p>
      </div>

      <div className="roadmap-grid">
        {items.map((item, index) => {
          const isCompleted = item.status === "Completed";
          const isInProgress = item.status === "In Progress";

          return (
            <div
              key={item.title}
              className={`roadmap-card ${isCompleted ? "roadmap-completed" : isInProgress ? "roadmap-active" : ""}`}
            >
              <div className="roadmap-card-header">
                <span className="roadmap-category">{item.category}</span>
                <span
                  className={`roadmap-status-badge status-${item.status.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {isCompleted && <CheckIcon size={12} />}
                  {isInProgress && <SparklesIcon size={12} />}
                  <span>{item.status}</span>
                </span>
              </div>

              <h3 className="roadmap-item-title">{item.title}</h3>
              <p className="roadmap-item-desc">{item.description}</p>

              <div className="roadmap-step-num">0{index + 1}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
