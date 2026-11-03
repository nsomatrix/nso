"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getAssetUrl } from "../../utils/assetPath";
import { SparklesIcon, DownloadIcon } from "../Icons";
import { ClanStatus } from "./ClanStatus";

export function HomeHero() {
  return (
    <section className="nso-hero-container">
      {/* 1. Brand Logo */}
      <div className="hero-logo-wrapper">
        <Image
          src={getAssetUrl("/mtx.png")}
          alt="Matrix Logo"
          width={180}
          height={180}
          className="hero-logo-img"
          priority
        />
      </div>

      {/* 2. Welcome Headline with Neon Lightning X */}
      <h1 className="hero-headline">
        Welcome to <span className="matri-text">Matri</span>
        <span className="x-text">X</span>
      </h1>
      <p className="hero-tagline">
        Ninja grid streamlined • The definitive Ninja School Online ecosystem
      </p>

      {/* 3. Integrated Clan Status */}
      <div className="hero-block-wrapper">
        <ClanStatus />
      </div>

      {/* 5. Quick Launch Actions */}
      <div className="hero-cta-group">
        <Link href="/mods" className="hero-btn hero-btn-primary">
          <SparklesIcon size={16} />
          <span>Browse MODs</span>
        </Link>

        <Link href="/emulators" className="hero-btn hero-btn-secondary">
          <DownloadIcon size={16} />
          <span>Download Emulators</span>
        </Link>
      </div>
    </section>
  );
}
