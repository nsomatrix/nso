"use client";

import React from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function Home() {
  const upcomingFeatures = [
    "Networking and Client APIs",
    "NinjaDEX",
    "Storage and Auth",
    "Connect",
  ];

  return (
    <div className="page-layout">
      <Header />

      <main className="main-content section-container">
        <div className="hello-card">
          <h1 className="hello-title">Matrix</h1>
          <div className="coming-soon-badge">Coming Soon</div>

          <div className="upcoming-features-list">
            {upcomingFeatures.map((feature) => (
              <div key={feature} className="upcoming-feature-item">
                <span className="feature-dot"></span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
