"use client";

import React from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

export default function WallPage() {
  return (
    <div className="page-layout">
      <Header />

      <main className="main-content section-container">
        <div className="page-glass-wall">
          <div className="hello-card">
            <h1 className="hello-title">Wall</h1>
            <p className="hello-subtitle">
              Coming Soon
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
