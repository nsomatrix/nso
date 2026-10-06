"use client";

import React, { useState, useEffect, useRef } from "react";
import { GitHubRelease } from "../app/emulators/page";

interface CustomVersionSelectProps {
  releases: GitHubRelease[];
  currentUrl: string | null;
  onSelect: (url: string) => void;
}

export function CustomVersionSelect({
  releases,
  currentUrl,
  onSelect,
}: CustomVersionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find active selected release
  const activeRelease =
    releases.find((r) => r.assets?.[0]?.browser_download_url === currentUrl) ||
    releases[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!releases || releases.length === 0) {
    return <span className="font-mono text-muted text-xs">Fetching Versions</span>;
  }

  return (
    <div className="custom-select-wrapper" ref={containerRef}>
      <button
        type="button"
        className={`custom-select-trigger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="select-val-text">
          {activeRelease ? activeRelease.tag_name : "Select version"}
        </span>
        <svg
          className={`select-chevron ${isOpen ? "rotate" : ""}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="custom-select-dropdown">
          {releases.map((release, idx) => {
            const downloadUrl = release.assets?.[0]?.browser_download_url;
            if (!downloadUrl) return null;
            const isSelected = downloadUrl === currentUrl;

            return (
              <button
                key={release.tag_name}
                type="button"
                className={`custom-option-item ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  onSelect(downloadUrl);
                  setIsOpen(false);
                }}
              >
                <span>{release.tag_name}</span>
                {idx === 0 && <span className="latest-tag">Latest</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
