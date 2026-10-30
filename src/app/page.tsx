"use client";

import React from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { HomeHero } from "../components/home/HomeHero";
import { HomeStats } from "../components/home/HomeStats";
import { HomePortalGrid } from "../components/home/HomePortalGrid";

export default function Home() {
  return (
    <div className="page-layout">
      <Header />

      <main className="main-content section-container home-main-content">
        <HomeHero />
        <HomeStats />
        <HomePortalGrid />
      </main>

      <Footer />
    </div>
  );
}
