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
  // Chrono Uptime State
  const [uptime, setUptime] = useState<UptimeData | null>(null);

  useEffect(() => {
    setUptime(calculateUptime());
    const interval = setInterval(() => {
      setUptime(calculateUptime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dialogues State
  const [dialogues, setDialogues] = useState<DialogueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDialogues(generateDialogues());
    const refreshTimer = setInterval(() => {
      setDialogues(generateDialogues());
    }, 30000);
    return () => clearInterval(refreshTimer);
  }, []);

  const activeDialogue = useMemo(() => {
    return (
      dialogues[currentIndex] || {
        id: "welcome",
        text: "Welcome to Matrix",
        color: "#ffffff" as const,
      }
    );
  }, [dialogues, currentIndex]);

  const categoryTag = useMemo(() => {
    const id = activeDialogue.id;
    if (id.startsWith("sb-") || id === "seven-beasts-upcoming") {
      return "World Boss: Seven Beasts";
    }
    if (id.startsWith("yy-")) {
      return "Battlefield: Yin-Yang";
    }
    if (id === "server-reset") {
      return "Daily Server Reset";
    }
    if (id === "maintenance") {
      return "Maintenance";
    }
    if (id.startsWith("tip-")) {
      return "Tip";
    }
    return "Announcement";
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
      {/* ── HEADER ── */}
      <div className="deck-header">
        <span className="deck-terminal-id">Shinobi Telemetry</span>
      </div>

      {/* ── UPTIME ── */}
      <div className="deck-chrono-section">
        <div className="chrono-section-bar">
          <span className="chrono-label">Platform Uptime</span>
          <span className="chrono-sub-tag">Since Feb 01, 2019</span>
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
            <div className="chrono-loading">Loading uptime...</div>
          )}
        </div>
      </div>

      {/* ── SEPARATOR ── */}
      <div className="deck-seam-divider" />

      {/* ── DIALOGUE ── */}
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
          </div>
        </div>

        {/* Transmission Speech Frame */}
        <div className="deck-speech-box">
          <div className="speech-meta-bar">
            <span
              className="speech-category-chip"
              style={{
                borderColor: activeDialogue.color !== "#ffffff" ? `${activeDialogue.color}55` : undefined,
                color: activeDialogue.color !== "#ffffff" ? activeDialogue.color : undefined,
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
                {dialogues.map((d, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`deck-dot ${idx === currentIndex ? "active" : ""}`}
                    onClick={() => setCurrentIndex(idx)}
                    style={
                      idx === currentIndex && d.color !== "#ffffff"
                        ? { background: d.color }
                        : undefined
                    }
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
              }}
            >
              {typedText}
              <span className="speech-blinking-caret">_</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
