"use client";

import React from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ShinobiTelemetryDeck } from "../components/home/ShinobiTelemetryDeck";

export default function Home() {
  return (
    <div className="page-layout">
      <Header />

      <main className="main-content section-container home-main-content">
        <div className="hero-block-wrapper">
          <ShinobiTelemetryDeck />
        </div>
      </main>

      <Footer />
    </div>
  );
}
