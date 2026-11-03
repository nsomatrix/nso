"use client";

import React from "react";
import Image from "next/image";
import { getAssetUrl } from "../../utils/assetPath";

export function AnimatedLogoCard() {
  return (
    <div className="home-logo-container">
      <div className="home-logo-wrap">
        <Image
          src={getAssetUrl("/mtx.png")}
          alt="Matrix"
          width={320}
          height={110}
          priority
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          className="home-logo-graphic nodownload"
        />
      </div>
    </div>
  );
}
