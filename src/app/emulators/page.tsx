"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { CustomVersionSelect } from "../../components/CustomVersionSelect";
import { DownloadButton } from "../../components/DownloadButton";
import { SmartphoneIcon, MonitorIcon } from "../../components/Icons";

export interface EmulatorItem {
  name: string;
  version: string;
  size: string;
  platform: "mobile" | "desktop";
  icon: string;
  downloadUrl: string | null;
  githubRepo: string | null;
  hasVersions: boolean;
}

export interface GitHubReleaseAsset {
  name: string;
  browser_download_url: string;
}

export interface GitHubRelease {
  tag_name: string;
  name?: string;
  assets?: GitHubReleaseAsset[];
}

const INITIAL_EMULATORS: EmulatorItem[] = [
  {
    name: "CoffeeVM",
    version: "v1.4.7",
    size: "3.56 MB",
    platform: "mobile",
    icon: "/Pictures/coffeevm.webp",
    downloadUrl: "/EMU/Android/CoffeeVM.apk",
    githubRepo: null,
    hasVersions: false,
  },
  {
    name: "J2ME Loader",
    version: "Latest",
    size: "Variable",
    platform: "mobile",
    icon: "/Pictures/j2meloader.png",
    downloadUrl: null,
    githubRepo: "nikita36078/J2ME-Loader",
    hasVersions: true,
  },
  {
    name: "PhoneME",
    version: "v1.0.0",
    size: "3.7 MB",
    platform: "mobile",
    icon: "/Pictures/phoneme.png",
    downloadUrl: "/EMU/Android/PhoneME.apk",
    githubRepo: null,
    hasVersions: false,
  },
  {
    name: "JLMod",
    version: "Latest",
    size: "Variable",
    platform: "mobile",
    icon: "/Pictures/jlmod.png",
    downloadUrl: null,
    githubRepo: "woesss/JL-Mod",
    hasVersions: true,
  },
  {
    name: "NetMite",
    version: "v2.0.3.7",
    size: "809 KB",
    platform: "mobile",
    icon: "/Pictures/netmite.png",
    downloadUrl: "/EMU/Android/NetMite.apk",
    githubRepo: null,
    hasVersions: false,
  },
  {
    name: "Microemulator",
    version: "v2.0.4",
    size: "629 KB",
    platform: "desktop",
    icon: "/Pictures/microemulator.png",
    downloadUrl: "/EMU/Desktop/microemulator.jar",
    githubRepo: null,
    hasVersions: false,
  },
  {
    name: "KEmulator",
    version: "v0.9.8",
    size: "2.51 MB",
    platform: "desktop",
    icon: "/Pictures/kemulator.png",
    downloadUrl: "/EMU/Desktop/KEmulatorLite.exe",
    githubRepo: null,
    hasVersions: false,
  },
  {
    name: "AngelChip",
    version: "v1.0.0",
    size: "479 KB",
    platform: "desktop",
    icon: "/Pictures/angelchip.png",
    downloadUrl: "/EMU/Desktop/AngelChipEmulator.jar",
    githubRepo: null,
    hasVersions: false,
  },
  {
    name: "Neutron",
    version: "v1.1.0",
    size: "1.64 MB",
    platform: "desktop",
    icon: "/Pictures/ntn.png",
    downloadUrl: "/EMU/Desktop/neutron-1.1.0.jar",
    githubRepo: null,
    hasVersions: false,
  },
  {
    name: "Neutron Core",
    version: "v1.1.0",
    size: "501 KB",
    platform: "desktop",
    icon: "/Pictures/ntn.png",
    downloadUrl: "/EMU/Desktop/neutron-core-1.1.0.jar",
    githubRepo: null,
    hasVersions: false,
  },
];

export default function EmulatorsPage() {
  const [platformFilter, setPlatformFilter] = useState<"all" | "mobile" | "desktop">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [githubReleases, setGithubReleases] = useState<Record<string, GitHubRelease[]>>({});
  const [selectedUrls, setSelectedUrls] = useState<Record<string, string>>({});

  // Fetch GitHub releases dynamically
  useEffect(() => {
    async function fetchReleases() {
      const repos = INITIAL_EMULATORS.filter((emu) => emu.githubRepo).map((emu) => emu.githubRepo!);
      
      const releaseMap: Record<string, GitHubRelease[]> = {};
      const initialUrlMap: Record<string, string> = {};

      for (const repo of repos) {
        try {
          let page = 1;
          let allReleases: GitHubRelease[] = [];

          while (true) {
            const res = await fetch(
              `https://api.github.com/repos/${repo}/releases?per_page=100&page=${page}`
            );
            if (!res.ok) break;
            const data: GitHubRelease[] = await res.json();
            if (!Array.isArray(data) || data.length === 0) break;

            const validReleases = data.filter((r) => r.assets && r.assets.length > 0);
            allReleases = allReleases.concat(validReleases);

            if (data.length < 100) break;
            page++;
          }

          releaseMap[repo] = allReleases;

          const emu = INITIAL_EMULATORS.find((e) => e.githubRepo === repo);
          if (emu && allReleases.length > 0 && allReleases[0].assets?.[0]) {
            initialUrlMap[emu.name] = allReleases[0].assets[0].browser_download_url;
          }
        } catch (e) {
          console.warn("Failed to fetch releases for", repo, e);
        }
      }

      setGithubReleases(releaseMap);
      setSelectedUrls((prev) => ({ ...initialUrlMap, ...prev }));
    }

    fetchReleases();
  }, []);

  const filteredEmulators = INITIAL_EMULATORS.filter((emu) => {
    const matchesPlatform = platformFilter === "all" || emu.platform === platformFilter;
    const matchesSearch = emu.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
    return matchesPlatform && matchesSearch;
  });

  const desktopCount = INITIAL_EMULATORS.filter((e) => e.platform === "desktop").length;
  const mobileCount = INITIAL_EMULATORS.filter((e) => e.platform === "mobile").length;

  return (
    <div className="page-layout">
      <Header />

      <main className="main-content section-container">
        <div className="page-glass-wall">
          <div className="page-header">
            <h1 className="page-title">Emulators</h1>
            <p className="page-subtitle">
              Download verified J2ME and Java Emulators for Android and Desktop platforms. Select versions directly from GitHub.
            </p>
          </div>

          {/* Filter Controls & Search */}
          <div className="controls-row">
            <div className="filter-tabs">
              <button
                className={`filter-btn ${platformFilter === "all" ? "active" : ""}`}
                onClick={() => setPlatformFilter("all")}
              >
                All ({INITIAL_EMULATORS.length})
              </button>
              <button
                className={`filter-btn ${platformFilter === "mobile" ? "active" : ""}`}
                onClick={() => setPlatformFilter("mobile")}
              >
                Phone ({mobileCount})
              </button>
              <button
                className={`filter-btn ${platformFilter === "desktop" ? "active" : ""}`}
                onClick={() => setPlatformFilter("desktop")}
              >
                Desktop ({desktopCount})
              </button>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search Emulators"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Emulators Data Table */}
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Emulator</th>
                  <th>Version</th>
                  <th>Size</th>
                  <th>Platform</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmulators.map((emu) => {
                  const releases = emu.githubRepo ? githubReleases[emu.githubRepo] || [] : [];
                  const currentDownloadUrl = selectedUrls[emu.name] || emu.downloadUrl;

                  return (
                    <tr key={emu.name}>
                      <td className="col-name">
                        <div className="emulator-item-info">
                          <Image
                            src={emu.icon}
                            alt={emu.name}
                            width={32}
                            height={32}
                            className="emulator-icon"
                            unoptimized
                          />
                          <span className="emulator-name">{emu.name}</span>
                        </div>
                      </td>
                      <td className="col-version">
                        <span className="mobile-label">Version</span>
                        {emu.hasVersions ? (
                          <CustomVersionSelect
                            releases={releases}
                            currentUrl={currentDownloadUrl}
                            onSelect={(url) =>
                              setSelectedUrls((prev) => ({
                                ...prev,
                                [emu.name]: url,
                              }))
                            }
                          />
                        ) : (
                          <span className="font-mono text-muted">{emu.version}</span>
                        )}
                      </td>
                      <td className="col-size">
                        <span className="mobile-label">Size</span>
                        <span className="font-mono text-muted">{emu.size}</span>
                      </td>
                      <td className="col-platform">
                        <span className="mobile-label">Platform</span>
                        <span
                          className={`platform-tag-icon ${emu.platform}`}
                          title={emu.platform === "desktop" ? "Desktop Platform" : "Phone / Mobile Platform"}
                          aria-label={emu.platform === "desktop" ? "Desktop" : "Phone"}
                        >
                          {emu.platform === "desktop" ? (
                            <MonitorIcon size={18} />
                          ) : (
                            <SmartphoneIcon size={18} />
                          )}
                        </span>
                      </td>
                      <td className="col-action">
                        <DownloadButton url={currentDownloadUrl || ""} filename={emu.name} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredEmulators.length === 0 && (
              <div className="empty-state">
                <p>No emulators found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
