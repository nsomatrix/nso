"use client";

import React, { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { DownloadButton } from "../../components/DownloadButton";

export interface ModItem {
  name: string;
  size: number;
  downloadUrl: string;
  type: "jar" | "zip";
}

export interface ArchiveFile {
  name: string;
  size?: number;
}

export interface ArchiveResponse {
  files?: ArchiveFile[];
}

const ARCHIVE_ITEM_ID = "nsomtx-active-mods";
const ARCHIVE_BASE_URL = "https://archive.org/download/";

function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return "Unknown";
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

  useEffect(() => {
    async function fetchMods() {
      try {
        setLoading(true);
        const res = await fetch(`https://archive.org/metadata/${ARCHIVE_ITEM_ID}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: ArchiveResponse = await res.json();
        if (!data.files) {
          throw new Error("No files found in archive");
        }

        const modFiles: ModItem[] = data.files
          .filter((file) => file.name.endsWith(".jar") || file.name.endsWith(".zip"))
          .map((file) => {
            const isJar = file.name.endsWith(".jar");
            const itemType: "jar" | "zip" = isJar ? "jar" : "zip";
            return {
              name: file.name,
              size: file.size || 0,
              downloadUrl: `${ARCHIVE_BASE_URL}${ARCHIVE_ITEM_ID}/${file.name}`,
              type: itemType,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        setMods(modFiles);
      } catch (err: unknown) {
        console.error("Error fetching MODs:", err);
        setError("Failed to load MODs from Internet Archive. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchMods();
  }, []);

  const filteredMods = mods.filter((mod) => {
    const matchesType = filterType === "all" || mod.type === filterType;
    const matchesSearch = mod.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
    return matchesType && matchesSearch;
  });

  const jarCount = mods.filter((m) => m.type === "jar").length;
  const zipCount = mods.filter((m) => m.type === "zip").length;

  return (
    <div className="page-layout">
      <Header />

      <main className="main-content section-container">
        <div className="page-glass-wall">
          <div className="page-header">
            <h1 className="page-title">MODs</h1>
            <p className="page-subtitle">
              Browse and Download Ninjamods dynamically synced from the database.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="controls-row">
            <div className="filter-tabs">
              <button
                className={`filter-btn ${filterType === "all" ? "active" : ""}`}
                onClick={() => setFilterType("all")}
              >
                All MODs ({mods.length})
              </button>
              <button
                className={`filter-btn ${filterType === "jar" ? "active" : ""}`}
                onClick={() => setFilterType("jar")}
              >
                .JAR ({jarCount})
              </button>
              <button
                className={`filter-btn ${filterType === "zip" ? "active" : ""}`}
                onClick={() => setFilterType("zip")}
              >
                .ZIP ({zipCount})
              </button>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search MODs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* MODs Data Table */}
          <div className="table-wrapper">
            {loading ? (
              <div className="loading-state">
                <p>Fetching MODs</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>MOD File Name</th>
                    <th>Format</th>
                    <th>Size</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMods.map((mod) => (
                    <tr key={mod.name}>
                      <td className="col-name">
                        <span className="mod-file-name">{mod.name}</span>
                      </td>
                      <td className="col-format">
                        <span className="mobile-label">Format</span>
                        <span className={`format-tag ${mod.type}`}>
                          .{mod.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="col-size">
                        <span className="mobile-label">Size</span>
                        <span className="font-mono text-muted">{formatFileSize(mod.size)}</span>
                      </td>
                      <td className="col-action">
                        <DownloadButton url={mod.downloadUrl} filename={mod.name} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!loading && !error && filteredMods.length === 0 && (
              <div className="empty-state">
                <p>No MODs found matching your search term.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
