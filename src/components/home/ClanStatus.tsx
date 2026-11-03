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

// Registered Clan Avatars — all imported GIFs from downloads
export const CLAN_AVATARS: string[] = [
  "/Pictures/char.gif",
  "/Pictures/gifs/0377340532.gif",
  "/Pictures/gifs/1ninjalv39.gif",
  "/Pictures/gifs/2pup19.gif",
  "/Pictures/gifs/4xtamhuyet.gif",
  "/Pictures/gifs/anhthosuaongnuoc.gif",
  "/Pictures/gifs/Ghhgjytd.gif",
  "/Pictures/gifs/HeartNSO.gif",
  "/Pictures/gifs/Hochutich365.gif",
  "/Pictures/gifs/HUYSlUNHAN.gif",
  "/Pictures/gifs/i3boyngheo9x.gif",
  "/Pictures/gifs/Mrthayma.gif",
  "/Pictures/gifs/quydeptrai647.gif",
  "/Pictures/gifs/skigaidinhdn12.gif",
  "/Pictures/gifs/Thanhkennyboy.gif",
  "/Pictures/gifs/Upgame2020.gif",
  "/Pictures/gifs/V1pkecmah.gif",
  "/Pictures/gifs/vuafre222.gif",
  "/Pictures/gifs/zzahaiprozz.gif",
];

export interface ClanStatusProps {
  avatarSrc?: string;
  avatars?: string[];
}

export function ClanStatus({ avatarSrc, avatars = CLAN_AVATARS }: ClanStatusProps) {
  // 1. Chrono Uptime State
  const [uptime, setUptime] = useState<UptimeData | null>(null);

  useEffect(() => {
    setUptime(calculateUptime());
    const interval = setInterval(() => {
      setUptime(calculateUptime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Dialogues State
  const [dialogues, setDialogues] = useState<DialogueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // 3. Avatar Cycling State (deterministic initial value to prevent SSR hydration mismatch)
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [isVibrating, setIsVibrating] = useState(false);

  useEffect(() => {
    // Randomize initial avatar on client mount only
    if (avatars.length > 1) {
      setAvatarIndex(Math.floor(Math.random() * avatars.length));
    }
  }, [avatars.length]);

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

  // Active avatar resolution: prop override > dialogue specific avatar > cycle list
  const currentAvatar = useMemo(() => {
    if (avatarSrc) return avatarSrc;
    if (activeDialogue.avatar) return activeDialogue.avatar;
    if (avatars.length > 0) return avatars[avatarIndex % avatars.length];
    return "/Pictures/char.gif";
  }, [avatarSrc, activeDialogue.avatar, avatars, avatarIndex]);

  const handleAvatarClick = () => {
    // 1. Device Haptic Vibration (Phone haptics)
    if (
      typeof window !== "undefined" &&
      typeof navigator !== "undefined" &&
      "vibrate" in navigator
    ) {
      try {
        navigator.vibrate(35);
      } catch {
        // Fallback safely if browser blocks vibration
      }
    }

    // 2. Visual micro-vibration bounce feedback
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 200);

    // 3. Cycle to next avatar
    if (avatars.length > 1) {
      setAvatarIndex((prev) => (prev + 1) % avatars.length);
    }
  };

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
      return "Shinobi Tip";
    }
    return "Dispatch Notice";
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
    }, 30);

    return () => clearInterval(typingTimer);
  }, [currentIndex, dialogues, activeDialogue]);

  useEffect(() => {
    if (isTyping || !dialogues.length) return;

    const pauseTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % dialogues.length);
    }, 3600);

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
        { val: String(uptime.seconds).padStart(2, "0"), label: "SEC" },
      ]
    : [];

  return (
    <div className="clan-status-wrapper">
      {/* ── UPTIME MODULE ── */}
      <div className="clan-uptime-block">
        <div className="clan-uptime-header">
          <span className="clan-uptime-sub">Since Feb 01, 2019</span>
        </div>

        <div className="clan-uptime-grid">
          {uptime ? (
            units.map((unit) => (
              <div key={unit.label} className="clan-uptime-cell">
                <span className="clan-uptime-val">{unit.val}</span>
                <span className="clan-uptime-unit">{unit.label}</span>
              </div>
            ))
          ) : (
            <div className="clan-uptime-loading">Loading uptime...</div>
          )}
        </div>
      </div>

      {/* ── LIVE DISPATCH MODULE ── */}
      <div className="clan-dispatch-card">
        <div className="clan-dispatch-header">
          <div
            className="clan-category-chip"
            style={{
              borderColor:
                activeDialogue.color !== "#ffffff"
                  ? `${activeDialogue.color}66`
                  : undefined,
              color:
                activeDialogue.color !== "#ffffff"
                  ? activeDialogue.color
                  : undefined,
            }}
          >
            <span
              className="clan-chip-dot"
              style={{
                background:
                  activeDialogue.color !== "#ffffff"
                    ? activeDialogue.color
                    : "#ef4444",
              }}
            />
            {categoryTag}
          </div>

          <div className="clan-stepper">
            <button
              type="button"
              className="clan-nav-btn"
              onClick={handlePrev}
              aria-label="Previous Dispatch"
            >
              ‹
            </button>
            <button
              type="button"
              className="clan-nav-btn"
              onClick={handleNext}
              aria-label="Next Dispatch"
            >
              ›
            </button>
          </div>
        </div>

        <div className="clan-dispatch-body">
          <div
            className={`clan-avatar-box ${avatars.length > 1 ? "interactive" : ""} ${isVibrating ? "avatar-tap-vibrate" : ""}`}
            onClick={handleAvatarClick}
            title="Tap to change avatar"
          >
            <Image
              src={getAssetUrl(currentAvatar)}
              alt="Shinobi"
              width={72}
              height={72}
              unoptimized
              className="clan-pixel-sprite"
            />
          </div>

          <div className="clan-speech-bubble">
            <p
              className="clan-speech-text"
              style={{ color: activeDialogue.color }}
            >
              {typedText}
              <span className="clan-caret">_</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
