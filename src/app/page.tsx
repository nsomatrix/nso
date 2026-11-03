"use client";

import React from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AnimatedLogoCard } from "../components/home/AnimatedLogoCard";
import { ClanStatus } from "../components/home/ClanStatus";

export default function Home() {
  return (
    <div className="page-layout">
      <Header />

      <main className="main-content section-container home-main-content">
        <div className="hero-block-wrapper">
          <AnimatedLogoCard />
          <ClanStatus />
        </div>
      </main>

      <Footer />
    </div>
  );
}
