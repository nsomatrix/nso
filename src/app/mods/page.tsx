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

export interface ArchiveFile {
  name: string;
  size?: number | string;
}

export interface ArchiveResponse {
  files?: ArchiveFile[];
}

const ARCHIVE_ITEM_ID = "nsomods";
const ARCHIVE_BASE_URL = `https://archive.org/download/${ARCHIVE_ITEM_ID}/`;
const ARCHIVE_METADATA_URL = `https://archive.org/metadata/${ARCHIVE_ITEM_ID}`;

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

  useEffect(() => {
    let ignore = false;

    async function loadMods() {
      try {
        const res = await fetch(ARCHIVE_METADATA_URL);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: ArchiveResponse = await res.json();
        if (!data.files || data.files.length === 0) {
          throw new Error("No files found in the archive repository.");
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
              downloadUrl: `${ARCHIVE_BASE_URL}${file.name}`,
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
          console.error("Error fetching MODs from Database:", err);
          setError("Failed to load MODs from Database. Please try again.");
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

      <main className="main-content section-container">
        <div className="page-glass-wall">
          <div className="page-header">
            <h1 className="page-title">MODs</h1>
            <p className="page-subtitle">
              Browse and download Ninja School Online mods dynamically fetched from Database.
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

          {/* MODs List */}
          <div className="mod-list-container">
            {loading ? (
              <div className="mod-loading-state">
                <SpinnerIcon size={28} className="mod-loading-spinner" />
                <p>Fetching latest MODs from Database</p>
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

                    {/* Desktop metadata column: format badge & file size neatly aligned on the right before download */}
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
