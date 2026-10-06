"use client";

import React, { useState } from "react";
import { DownloadIcon, CheckIcon, SpinnerIcon } from "./Icons";

interface DownloadButtonProps {
  url: string;
  filename?: string;
  disabled?: boolean;
}

export function DownloadButton({ url, filename, disabled }: DownloadButtonProps) {
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
    return <span className="btn-disabled">Unavailable</span>;
  }

  return (
    <a
      href={url}
      download={filename}
      onClick={handleClick}
      className={`btn-download status-${status}`}
      title={status === "completed" ? "Downloaded" : status === "downloading" ? "Downloading..." : "Download"}
    >
      {status === "idle" && (
        <>
          <DownloadIcon size={14} />
          <span>Download</span>
        </>
      )}

      {status === "downloading" && <SpinnerIcon size={16} />}

      {status === "completed" && <CheckIcon size={16} />}
    </a>
  );
}
