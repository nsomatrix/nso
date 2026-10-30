"use client";

import React from "react";
import Link from "next/link";
import { ExternalLinkIcon } from "../Icons";

interface PortalCardProps {
  tag: string;
  title: string;
  description: string;
  features: string[];
  href: string;
  badge?: string;
  badgeType?: "accent" | "cyan" | "gold" | "green";
  ctaText: string;
}

export function HomePortalGrid() {
  const cards: PortalCardProps[] = [
    {
      tag: "Client Mods",
      title: "MODs Repository",
      description:
        "Handpicked and optimized Ninja School Online modded clients. Features include auto-farm, auto-pick, speed controls, and auto-relogin.",
      features: ["AngelChip Core", "Auto Farm & Pick", "Multi-login Ready", "JAR & APK"],
      href: "/mods",
      badge: "Popular",
      badgeType: "accent",
      ctaText: "Browse MODs",
    },
    {
      tag: "Virtual Machines",
      title: "Emulator Suite",
      description:
        "The best emulators for running J2ME and Java apps on Android, Windows, and Linux with customized key bindings and display scalers.",
      features: ["J2ME-Loader", "KEmulator PC", "CoffeeVM", "Direct APK / Exe"],
      href: "/emulators",
      badge: "Essential",
      badgeType: "cyan",
      ctaText: "Get Emulators",
    },
    {
      tag: "Knowledge Base",
      title: "NinjaDEX Encyclopedia",
      description:
        "Comprehensive database for Ninja School Online: weapon upgrade charts (+1 to +16), skill calculators, boss timers, and gear stats.",
      features: ["Weapon Upgrade Rates", "Boss Respawn Timers", "Skill Trees", "School Stats"],
      href: "/ninjadex",
      badge: "In Dev",
      badgeType: "gold",
      ctaText: "Preview NinjaDEX",
    },
    {
      tag: "Community",
      title: "The Wall & Updates",
      description:
        "Stay up-to-date with the latest patch notes, mod releases, community tips, server status announcements, and player wall.",
      features: ["Release Changelogs", "Modding Tutorials", "Server Status", "Community Board"],
      href: "/wall",
      badge: "Community",
      badgeType: "green",
      ctaText: "Visit The Wall",
    },
  ];

  return (
    <section className="portal-section">
      <div className="section-header-center">
        <span className="section-eyebrow">Explore Matrix Hub</span>
        <h2 className="section-heading">Core Portals &amp; Utilities</h2>
        <p className="section-lead">
          Everything you need to play, automate, and dominate in Ninja School Online.
        </p>
      </div>

      <div className="portal-grid">
        {cards.map((card) => (
          <div key={card.title} className="portal-card">
            <div className="portal-card-top">
              <span className="portal-card-tag">{card.tag}</span>
              {card.badge && (
                <span className={`portal-card-badge badge-${card.badgeType || "accent"}`}>
                  {card.badge}
                </span>
              )}
            </div>

            <h3 className="portal-card-title">{card.title}</h3>
            <p className="portal-card-desc">{card.description}</p>

            <div className="portal-card-features">
              {card.features.map((feat) => (
                <span key={feat} className="portal-feature-pill">
                  {feat}
                </span>
              ))}
            </div>

            <div className="portal-card-footer">
              <Link href={card.href} className="portal-card-link">
                <span>{card.ctaText}</span>
                <ExternalLinkIcon size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
