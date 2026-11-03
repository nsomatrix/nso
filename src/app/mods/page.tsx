"use client";

import React, { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { DownloadButton } from "../../components/DownloadButton";
import { SearchIcon, FileIcon, CloseIcon, SpinnerIcon } from "../../components/Icons";

export interface ModItem {
  name: string;
  size: number;
  downloadUrl: string;
  type: "jar" | "zip";
}

export interface ModsApiResponse {
  files?: ModItem[];
  error?: string;
}

// Cloudflare Worker / R2 API endpoint
const MODS_API_URL = (
  process.env.NEXT_PUBLIC_MODS_API_URL || "https://nso-mods-api.nsomatrix.workers.dev"
).replace(/\/$/, "");
const MODS_ENDPOINT = `${MODS_API_URL}/api/mods`;

function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return "";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(1);
  return `${size} ${sizes[i]}`;
}

export default function ModsPage() {
  const [mods, setMods] = useState<ModItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "jar" | "zip">("all");
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    // Show disclaimer once on entry
    try {
      const dismissed = sessionStorage.getItem("matrix_mods_disclaimer_seen");
      if (!dismissed) {
        setShowDisclaimer(true);
      }
    } catch {
      setShowDisclaimer(true);
    }
  }, []);

  const handleDismissDisclaimer = () => {
    setShowDisclaimer(false);
    try {
      sessionStorage.setItem("matrix_mods_disclaimer_seen", "1");
    } catch {}
  };

  useEffect(() => {
    let ignore = false;

    async function loadMods() {
      try {
        const res = await fetch(MODS_ENDPOINT);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: ModsApiResponse = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }

        if (!data.files || data.files.length === 0) {
          throw new Error("No files found in R2 repository.");
        }

        const modFiles: ModItem[] = data.files
          .filter(
            (file) =>
              Boolean(file.name) &&
              (file.name.endsWith(".jar") || file.name.endsWith(".zip"))
          )
          .map((file) => {
            const isJar = file.name.endsWith(".jar");
            const itemType: "jar" | "zip" = isJar ? "jar" : "zip";
            const numSize =
              typeof file.size === "number"
                ? file.size
                : parseInt(String(file.size || "0"), 10) || 0;

            return {
              name: file.name,
              size: numSize,
              downloadUrl: file.downloadUrl,
              type: itemType,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

        if (!ignore) {
          setMods(modFiles);
          setError(null);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          console.error("Error fetching MODs from Cloudflare R2:", err);
          setError("Failed to load MODs. Please try again.");
          setLoading(false);
        }
      }
    }

    loadMods();

    return () => {
      ignore = true;
    };
  }, [fetchTrigger]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setFetchTrigger((prev) => prev + 1);
  };

  const jarCount = mods.filter((m) => m.type === "jar").length;
  const zipCount = mods.filter((m) => m.type === "zip").length;

  const filteredMods = mods.filter((mod) => {
    const matchesType = filterType === "all" || mod.type === filterType;
    const matchesSearch = mod.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
    return matchesType && matchesSearch;
  });

  return (
    <div className="page-layout">
      <Header />

      <main className="main-content section-container mods-page-container">
        {/* Modal Dialog */}
        {showDisclaimer && (
          <div className="mods-dialog-backdrop" onClick={handleDismissDisclaimer}>
            <div
              className="mods-dialog-card"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="mods-dialog-title"
            >
              <div className="mods-dialog-header">
                <span className="mods-dialog-tag">DISCLAIMER</span>
                <button
                  type="button"
                  onClick={handleDismissDisclaimer}
                  className="mods-dialog-close"
                  aria-label="Close"
                >
                  <CloseIcon size={14} />
                </button>
              </div>

              <div className="mods-dialog-content">
                <h3 id="mods-dialog-title" className="mods-dialog-title">
                  Community Uploaded MODs
                </h3>
                <p className="mods-dialog-text">
                  MODs here are user uploaded, use it at your own discretion.
                </p>
              </div>

              <div className="mods-dialog-actions">
                <button
                  type="button"
                  onClick={handleDismissDisclaimer}
                  className="mods-dialog-confirm"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mods-content-free">
          <div className="page-header">
            <h1 className="page-title">MODs</h1>
            <p className="page-subtitle">
              Browse and download Ninja School Online mods.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="mod-controls-row">
            <div className="mod-status-meta">
              <button
                type="button"
                className={`mod-count-badge ${filterType === "all" ? "active" : ""}`}
                onClick={() => setFilterType("all")}
                title="Show all MODs"
              >
                {loading
                  ? "Fetching"
                  : `${mods.length} ${mods.length === 1 ? "MOD" : "MODs"}`}
              </button>

              <button
                type="button"
                className={`mod-pill-btn ${filterType === "jar" ? "active" : ""}`}
                onClick={() => setFilterType(filterType === "jar" ? "all" : "jar")}
                title="Filter JAR files"
              >
                <span className="pill-label">JAR</span>
                {!loading && <span className="pill-count">{jarCount}</span>}
              </button>

              <button
                type="button"
                className={`mod-pill-btn ${filterType === "zip" ? "active" : ""}`}
                onClick={() => setFilterType(filterType === "zip" ? "all" : "zip")}
                title="Filter ZIP files"
              >
                <span className="pill-label">ZIP</span>
                {!loading && <span className="pill-count">{zipCount}</span>}
              </button>
            </div>

            <div className="mod-search-box">
              <SearchIcon size={16} className="mod-search-icon" />
              <input
                type="text"
                placeholder="Search MODs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mod-search-input"
                id="mod-search-input"
                autoComplete="off"
                spellCheck="false"
                disabled={loading}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="mod-search-clear"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <CloseIcon size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Free, Open MODs List */}
          <div className="mod-list-container">
            {loading ? (
              <div className="mod-loading-state">
                <SpinnerIcon size={28} className="mod-loading-spinner" />
                <p>Fetching latest MODs</p>
              </div>
            ) : error ? (
              <div className="mod-error-state">
                <p>{error}</p>
                <button type="button" className="mod-btn-reset" onClick={handleRetry}>
                  Retry
                </button>
              </div>
            ) : filteredMods.length > 0 ? (
              <div className="mod-list" role="list">
                {filteredMods.map((mod) => (
                  <div className="mod-list-row" key={mod.name} role="listitem">
                    <div className="mod-row-main">
                      <div className="mod-file-icon" aria-hidden="true">
                        <FileIcon size={18} />
                      </div>
                      <div className="mod-file-details">
                        <span className="mod-file-name" title={mod.name}>
                          {mod.name}
                        </span>
                        {/* Mobile metadata subline */}
                        <div className="mod-mobile-meta">
                          <span className={`mod-badge ${mod.type}`}>
                            {mod.type.toUpperCase()}
                          </span>
                          {mod.size > 0 && (
                            <>
                              <span className="meta-sep">•</span>
                              <span className="mod-file-size">
                                {formatFileSize(mod.size)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Desktop metadata column */}
                    <div className="mod-row-meta-desktop">
                      <span className={`mod-badge ${mod.type}`}>
                        {mod.type.toUpperCase()}
                      </span>
                      <span className="mod-file-size">
                        {mod.size > 0 ? formatFileSize(mod.size) : "—"}
                      </span>
                    </div>

                    <div className="mod-row-action">
                      <DownloadButton
                        url={mod.downloadUrl}
                        filename={mod.name}
                        iconOnly={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mod-empty-state">
                <p>No MODs found matching &ldquo;{searchTerm}&rdquo;</p>
                {(searchTerm || filterType !== "all") && (
                  <button
                    type="button"
                    className="mod-btn-reset"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterType("all");
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
