"use client";

import React, { useState } from "react";
import { DownloadIcon, CheckIcon, SpinnerIcon } from "./Icons";
import { getAssetUrl } from "../utils/assetPath";

interface DownloadButtonProps {
  url: string;
  filename?: string;
  disabled?: boolean;
  iconOnly?: boolean;
}

export function DownloadButton({ url, filename, disabled, iconOnly = false }: DownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "downloading" | "completed">("idle");

  const handleClick = () => {
    if (status !== "idle") return;

    setStatus("downloading");

    setTimeout(() => {
      setStatus("completed");
    }, 1000);

    setTimeout(() => {
      setStatus("idle");
    }, 3500);
  };

  if (disabled || !url) {
    return (
      <span
        className={`btn-disabled ${iconOnly ? "btn-download-icon-only disabled" : ""}`}
        title="Unavailable"
      >
        {iconOnly ? "—" : "Unavailable"}
      </span>
    );
  }

  const finalUrl = getAssetUrl(url);

  const buttonTitle =
    status === "completed"
      ? "Downloaded"
      : status === "downloading"
      ? "Downloading"
      : filename
      ? `Download ${filename}`
      : "Download";

  return (
    <a
      href={finalUrl}
      download={filename}
      onClick={handleClick}
      className={`btn-download ${iconOnly ? "btn-download-icon-only" : ""} status-${status}`}
      title={buttonTitle}
      aria-label={buttonTitle}
    >
      {status === "idle" && (
        <>
          <DownloadIcon size={iconOnly ? 16 : 14} />
          {!iconOnly && <span>Download</span>}
        </>
      )}

      {status === "downloading" && <SpinnerIcon size={16} />}

      {status === "completed" && <CheckIcon size={16} />}
    </a>
  );
}
