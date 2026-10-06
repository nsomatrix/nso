"use client";

import React from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Home() {
  return (
    <div className="page-layout">
      <Header />

      <main className="main-content">
        <div className="hello-card">
          <h1 className="hello-title">Hello World</h1>
          <p className="hello-subtitle">
            An industry standard Next.js web app built with Vanilla CSS, auto dark/light mode, and fluid responsive design for phone and desktop.
          </p>

          <div className="toggle-wrapper">
            <ThemeToggle />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
