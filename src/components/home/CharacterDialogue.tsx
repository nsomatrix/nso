"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getAssetUrl } from "../../utils/assetPath";
import { generateDialogues, DialogueItem } from "../../utils/nsoEvents";

export function CharacterDialogue() {
  const [dialogues, setDialogues] = useState<DialogueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Initialize and refresh dialogues periodically to keep timers accurate
  useEffect(() => {
    setDialogues(generateDialogues());

    const refreshInterval = setInterval(() => {
      setDialogues(generateDialogues());
    }, 30000); // 30s timer refresh

    return () => clearInterval(refreshInterval);
  }, []);

  const activeDialogue = dialogues[currentIndex] || {
    id: "default",
    text: "Welcome to Matrix™",
    color: "#ffffff" as const,
  };

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
    }, 38);

    return () => clearInterval(typingTimer);
  }, [currentIndex, dialogues]);

  // Pause after finishing a sentence, then advance to next
  useEffect(() => {
    if (isTyping || !dialogues.length) return;

    const pauseTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % dialogues.length);
    }, 3200);

    return () => clearTimeout(pauseTimer);
  }, [isTyping, dialogues.length]);

  return (
    <div id="rpg-dialogue-box" className="rpg-pixel-dialogue-card">
      {/* Pixel Character Avatar */}
      <div className="dialogue-avatar-stage">
        <Image
          src={getAssetUrl("/Pictures/char.gif")}
          alt="Ninja Character"
          width={64}
          height={64}
          unoptimized
          className="dialogue-pixel-sprite"
        />
        <span className="avatar-status-pip" />
      </div>

      {/* Speech Content */}
      <div className="dialogue-speech-frame">
        <div className="dialogue-speech-header">
          <span className="speech-speaker-tag">SHINOBI TELEMETRY</span>
          <div className="dialogue-stepper">
            {dialogues.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`stepper-dot ${idx === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Jump to dispatch ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="dialogue-text-body">
          <p
            className="dialogue-message"
            style={{ color: activeDialogue.color }}
          >
            {typedText}
            <span className="dialogue-caret">|</span>
          </p>
        </div>
      </div>
    </div>
  );
}
