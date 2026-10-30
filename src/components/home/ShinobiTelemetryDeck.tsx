"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { getAssetUrl } from "../../utils/assetPath";
import {
  calculateUptime,
  generateDialogues,
  DialogueItem,
  UptimeData,
} from "../../utils/nsoEvents";

export function ShinobiTelemetryDeck() {
  // 1. Chrono Uptime State
  const [uptime, setUptime] = useState<UptimeData | null>(null);

  useEffect(() => {
    setUptime(calculateUptime());
    const interval = setInterval(() => {
      setUptime(calculateUptime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Live Shinobi Quest Telemetry State
  const [dialogues, setDialogues] = useState<DialogueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Initialize and refresh dialogues every 30s
  useEffect(() => {
    setDialogues(generateDialogues());
    const refreshTimer = setInterval(() => {
      setDialogues(generateDialogues());
    }, 30000);
    return () => clearInterval(refreshTimer);
  }, []);

  const activeDialogue = useMemo(() => {
    return dialogues[currentIndex] || {
      id: "welcome",
      text: "Welcome to Matrix™",
      color: "#ffffff" as const,
    };
  }, [dialogues, currentIndex]);

  // Derive human-readable category for gaming telemetry
  const categoryTag = useMemo(() => {
    const id = activeDialogue.id;
    if (id.startsWith("sb-") || id === "seven-beasts-upcoming") {
      return "WORLD BOSS // SEVEN BEASTS";
    }
    if (id.startsWith("yy-")) {
      return "PVP ARENA // YIN-YANG WAR";
    }
    if (id === "server-reset") {
      return "DAILY CYCLE // SERVER RESET";
    }
    if (id === "maintenance") {
      return "MAINTENANCE // NOTICE";
    }
    if (id.startsWith("tip-")) {
      return "SHINOBI CODEX // TIP";
    }
    return "HEADQUARTERS // TRANSMISSION";
  }, [activeDialogue.id]);

  // Typewriter effect
  useEffect(() => {
    if (!dialogues.length) return;

    const fullText = activeDialogue.text;
    let charPos = 0;
    setTypedText("");
    setIsTyping(true);

    const typingTimer = setInterval(() => {
      if (charPos < fullText.length) {
        setTypedText(fullText.slice(0, charPos + 1));
        charPos++;
      } else {
        clearInterval(typingTimer);
        setIsTyping(false);
      }
    }, 32);

    return () => clearInterval(typingTimer);
  }, [currentIndex, dialogues, activeDialogue]);

  // Auto-advance after typewriter finishes
  useEffect(() => {
    if (isTyping || !dialogues.length) return;

    const pauseTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % dialogues.length);
    }, 3400);

    return () => clearTimeout(pauseTimer);
  }, [isTyping, dialogues.length]);

  const handlePrev = () => {
    if (!dialogues.length) return;
    setCurrentIndex((prev) => (prev - 1 + dialogues.length) % dialogues.length);
  };

  const handleNext = () => {
    if (!dialogues.length) return;
    setCurrentIndex((prev) => (prev + 1) % dialogues.length);
  };

  // Chrono units for display
  const units = uptime
    ? [
        { val: uptime.years, label: "YRS" },
        { val: uptime.months, label: "MOS" },
        { val: uptime.days, label: "DAYS" },
        { val: String(uptime.hours).padStart(2, "0"), label: "HRS" },
        { val: String(uptime.minutes).padStart(2, "0"), label: "MIN" },
        { val: String(uptime.seconds).padStart(2, "0"), label: "SEC", isLive: true },
      ]
    : [];

  return (
    <div className="shinobi-deck-card">
      {/* ── TOP HUD HEADER ── */}
      <div className="deck-header">
        <div className="deck-header-left">
          <span className="deck-chakra-orb" />
          <span className="deck-terminal-id">MATRI-X // SHINOBI TELEMETRY HUD</span>
        </div>
        <div className="deck-header-right">
          <span className="deck-sync-chip">
            <span className="sync-pulse" />
            SYNCHRONIZED (UTC)
          </span>
        </div>
      </div>

      {/* ── UPPER SECTION: CHRONO MATRIX (UPTIME) ── */}
      <div className="deck-chrono-section">
        <div className="chrono-section-bar">
          <span className="chrono-label">
            <span className="chrono-icon">⏱</span> PLATFORM INCEPTION CHRONOMETER
          </span>
          <span className="chrono-sub-tag">SINCE FEB 01, 2019 • 17:05:40 UTC</span>
        </div>

        <div className="chrono-grid">
          {uptime ? (
            units.map((unit) => (
              <div
                key={unit.label}
                className={`chrono-cell ${unit.isLive ? "cell-live" : ""}`}
              >
                <span className="chrono-cell-num">{unit.val}</span>
                <span className="chrono-cell-unit">{unit.label}</span>
              </div>
            ))
          ) : (
            <div className="chrono-loading">Connecting to Chrono Node...</div>
          )}
        </div>
      </div>

      {/* ── SEAM DIVIDER ── */}
      <div className="deck-seam-divider">
        <span className="seam-line" />
        <span className="seam-badge">LIVE QUEST &amp; WORLD RADAR</span>
        <span className="seam-line" />
      </div>

      {/* ── LOWER SECTION: CHARACTER DIALOGUE & TELEMETRY ── */}
      <div className="deck-dialogue-section">
        {/* Pixel Avatar Stage */}
        <div className="deck-avatar-box">
          <div className="avatar-pixel-frame">
            <Image
              src={getAssetUrl("/Pictures/char.gif")}
              alt="Ninja Character"
              width={64}
              height={64}
              unoptimized
              className="deck-pixel-sprite"
            />
            <span className="avatar-live-indicator" />
          </div>
          <span className="avatar-rank-tag">LV.130 SHINOBI</span>
        </div>

        {/* Transmission Speech Frame */}
        <div className="deck-speech-box">
          <div className="speech-meta-bar">
            <span
              className="speech-category-chip"
              style={{
                borderColor: `${activeDialogue.color}55`,
                color: activeDialogue.color,
                boxShadow: `0 0 10px ${activeDialogue.color}22`,
              }}
            >
              {categoryTag}
            </span>

            {/* Stepper controls */}
            <div className="deck-controls">
              <button
                type="button"
                className="deck-nav-btn"
                onClick={handlePrev}
                aria-label="Previous Dispatch"
              >
                ‹
              </button>
              <div className="deck-dots">
                {dialogues.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`deck-dot ${idx === currentIndex ? "active" : ""}`}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Jump to dispatch ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className="deck-nav-btn"
                onClick={handleNext}
                aria-label="Next Dispatch"
              >
                ›
              </button>
            </div>
          </div>

          <div className="speech-content-box">
            <p
              className="speech-text"
              style={{
                color: activeDialogue.color,
                textShadow: `0 0 12px ${activeDialogue.color}40`,
              }}
            >
              {typedText}
              <span className="speech-blinking-caret">_</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── TACTICAL FOOTER ── */}
      <div className="deck-footer">
        <span className="deck-status-item">
          <span className="status-dot green" /> CONTINUOUS OPERATION (100%)
        </span>
        <span className="deck-status-item">
          <span className="status-dot blue" /> CLOUDFLARE R2 EDGE CACHED
        </span>
        <span className="deck-status-item">
          <span className="status-dot purple" /> NO LOGIN REQUIRED
        </span>
      </div>
    </div>
  );
}
