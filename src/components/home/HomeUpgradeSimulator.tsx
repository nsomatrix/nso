"use client";

import React, { useState } from "react";
import { SparklesIcon } from "../Icons";

interface UpgradeTier {
  level: number;
  rate: number;
  title: string;
  glowColor: string;
  glowShadow: string;
  auraName: string;
}

const UPGRADE_TIERS: UpgradeTier[] = [
  { level: 0, rate: 100, title: "Standard Katana", glowColor: "#94a3b8", glowShadow: "rgba(148, 163, 184, 0.2)", auraName: "No Aura" },
  { level: 1, rate: 100, title: "Refined Katana +1", glowColor: "#a3e635", glowShadow: "rgba(163, 230, 53, 0.4)", auraName: "Faint Green" },
  { level: 2, rate: 100, title: "Refined Katana +2", glowColor: "#a3e635", glowShadow: "rgba(163, 230, 53, 0.5)", auraName: "Faint Green" },
  { level: 3, rate: 100, title: "Refined Katana +3", glowColor: "#4ade80", glowShadow: "rgba(74, 222, 128, 0.5)", auraName: "Emerald Light" },
  { level: 4, rate: 80, title: "Honed Katana +4", glowColor: "#38bdf8", glowShadow: "rgba(56, 189, 248, 0.5)", auraName: "Azure Wave" },
  { level: 5, rate: 70, title: "Honed Katana +5", glowColor: "#38bdf8", glowShadow: "rgba(56, 189, 248, 0.6)", auraName: "Azure Wave" },
  { level: 6, rate: 60, title: "Honed Katana +6", glowColor: "#60a5fa", glowShadow: "rgba(96, 165, 250, 0.6)", auraName: "Sapphire Flame" },
  { level: 7, rate: 50, title: "Honed Katana +7", glowColor: "#818cf8", glowShadow: "rgba(129, 140, 248, 0.6)", auraName: "Indigo Flash" },
  { level: 8, rate: 45, title: "Elite Katana +8", glowColor: "#a855f7", glowShadow: "rgba(168, 85, 247, 0.7)", auraName: "Amethyst Glow" },
  { level: 9, rate: 35, title: "Elite Katana +9", glowColor: "#c084fc", glowShadow: "rgba(192, 132, 252, 0.7)", auraName: "Purple Thunder" },
  { level: 10, rate: 30, title: "Elite Katana +10", glowColor: "#e879f9", glowShadow: "rgba(232, 121, 249, 0.8)", auraName: "Violet Radiance" },
  { level: 11, rate: 25, title: "Master Katana +11", glowColor: "#fb7185", glowShadow: "rgba(251, 113, 133, 0.8)", auraName: "Crimson Blaze" },
  { level: 12, rate: 20, title: "Master Katana +12", glowColor: "#f97316", glowShadow: "rgba(249, 115, 22, 0.85)", auraName: "Solar Flare" },
  { level: 13, rate: 15, title: "Legendary Katana +13", glowColor: "#fbbf24", glowShadow: "rgba(251, 191, 36, 0.9)", auraName: "Golden Dragon" },
  { level: 14, rate: 12, title: "Legendary Katana +14", glowColor: "#facc15", glowShadow: "rgba(250, 204, 21, 0.95)", auraName: "Divine Radiance" },
  { level: 15, rate: 8, title: "Mythic Katana +15", glowColor: "#38bdf8", glowShadow: "0 0 35px #38bdf8, 0 0 60px #f43f5e", auraName: "Prismatic Celestial" },
  { level: 16, rate: 5, title: "Immortal Katana +16", glowColor: "#ffffff", glowShadow: "0 0 40px #ffffff, 0 0 70px #e11d48, 0 0 100px #3b82f6", auraName: "Godlike Sovereign" },
];

export function HomeUpgradeSimulator() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [historyMsg, setHistoryMsg] = useState<string>("Ready for upgrade. Insert upgrade stones.");
  const [lastOutcome, setLastOutcome] = useState<"success" | "fail" | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const currentTier = UPGRADE_TIERS[currentLevel];
  const nextTier = UPGRADE_TIERS[Math.min(currentLevel + 1, UPGRADE_TIERS.length - 1)];
  const isMaxLevel = currentLevel >= 16;

  const handleUpgrade = () => {
    if (isMaxLevel || isUpgrading) return;

    setIsUpgrading(true);
    setAttempts((prev) => prev + 1);

    setTimeout(() => {
      const roll = Math.random() * 100;
      const successChance = nextTier.rate;

      if (roll <= successChance) {
        const newLvl = currentLevel + 1;
        setCurrentLevel(newLvl);
        setSuccesses((prev) => prev + 1);
        setLastOutcome("success");
        setHistoryMsg(`Success! Upgraded to +${newLvl} [${UPGRADE_TIERS[newLvl].auraName}]`);
      } else {
        setLastOutcome("fail");
        // In NSO, failing above +8 can drop level if unprotected
        if (currentLevel >= 8) {
          const droppedLvl = Math.max(7, currentLevel - 1);
          setCurrentLevel(droppedLvl);
          setHistoryMsg(`Failed! Weapon cracked and fell to +${droppedLvl}.`);
        } else {
          setHistoryMsg("Failed! Upgrade stones shattered, weapon intact.");
        }
      }
      setIsUpgrading(false);
    }, 450);
  };

  const handleReset = () => {
    setCurrentLevel(0);
    setAttempts(0);
    setSuccesses(0);
    setLastOutcome(null);
    setHistoryMsg("Simulator reset. Level 0 standard Katana.");
  };

  return (
    <section className="upgrade-sim-section">
      <div className="section-header-center">
        <span className="section-eyebrow">Interactive Mini-Game</span>
        <h2 className="section-heading">Luyện Trang Bị • Weapon Forge</h2>
        <p className="section-lead">
          Test your luck with authentic Ninja School Online weapon refinement odds up to +16.
        </p>
      </div>

      <div className="sim-container">
        <div className="sim-card">
          {/* Weapon Stage */}
          <div className="sim-weapon-stage">
            <div
              className={`sim-weapon-glow ${isUpgrading ? "pulse-fast" : ""}`}
              style={{
                boxShadow: currentTier.glowShadow,
                borderColor: currentTier.glowColor,
              }}
            />

            <div className="sim-weapon-art">
              <span
                className="sim-katana-icon"
                style={{
                  color: currentTier.glowColor,
                  textShadow: `0 0 20px ${currentTier.glowColor}`,
                }}
              >
                ⚔️
              </span>
            </div>

            <div className="sim-level-badge" style={{ backgroundColor: currentTier.glowColor }}>
              +{currentLevel}
            </div>
          </div>

          {/* Weapon Info */}
          <div className="sim-details">
            <h3 className="sim-weapon-title" style={{ color: currentTier.glowColor }}>
              {currentTier.title}
            </h3>
            <p className="sim-aura-tag">Aura: {currentTier.auraName}</p>

            <div className="sim-odds-box">
              <div className="odds-row">
                <span>Next Refinement:</span>
                <span className="odds-val">{isMaxLevel ? "MAX REACHED" : `+${currentLevel + 1}`}</span>
              </div>
              <div className="odds-row">
                <span>Success Rate:</span>
                <span className="odds-val highlight">
                  {isMaxLevel ? "—" : `${nextTier.rate}%`}
                </span>
              </div>
            </div>

            {/* Status Message */}
            <div
              className={`sim-status-message ${
                lastOutcome === "success" ? "msg-success" : lastOutcome === "fail" ? "msg-fail" : ""
              }`}
            >
              {historyMsg}
            </div>

            {/* Actions */}
            <div className="sim-actions-row">
              <button
                type="button"
                className={`sim-upgrade-btn ${isUpgrading ? "btn-disabled" : ""}`}
                onClick={handleUpgrade}
                disabled={isMaxLevel || isUpgrading}
              >
                <SparklesIcon size={16} />
                <span>{isUpgrading ? "Forging..." : isMaxLevel ? "Max Level +16" : "Luyện Ngay (Refine)"}</span>
              </button>

              <button
                type="button"
                className="sim-reset-btn"
                onClick={handleReset}
                title="Reset Weapon"
              >
                Reset
              </button>
            </div>

            {/* Session Stats */}
            <div className="sim-session-stats">
              <span>Attempts: {attempts}</span>
              <span>•</span>
              <span>Successes: {successes}</span>
              <span>•</span>
              <span>
                Win Rate: {attempts > 0 ? ((successes / attempts) * 100).toFixed(0) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
