"use client";

import React, { useState } from "react";
import { CopyIcon, CheckIcon, CodeIcon } from "./Icons";

export function CodeSnippet() {
  const [activeTab, setActiveTab] = useState<"css" | "context">("css");
  const [copied, setCopied] = useState(false);

  const cssSnippet = `/* Vanilla CSS Token System with Auto Dark Mode Support */
:root {
  --bg-primary: #f8fafc;
  --bg-surface: #ffffff;
  --text-primary: #0f172a;
  --brand-primary: #6366f1;
}

/* Dark Mode Tokens (User Override) */
:root[data-theme="dark"] {
  --bg-primary: #0b0f17;
  --bg-surface: #131b2e;
  --text-primary: #f8fafc;
  --brand-primary: #818cf8;
}

/* System Preference (Auto Mode) */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg-primary: #0b0f17;
    --bg-surface: #131b2e;
    --text-primary: #f8fafc;
    --brand-primary: #818cf8;
  }
}`;

  const contextSnippet = `// Next.js App Router Inline Theme Script (Prevents FOUC)
export function ThemeScript() {
  const code = \`
    (function() {
      try {
        var theme = localStorage.getItem('app-theme') || 'system';
        if (theme !== 'system') {
          document.documentElement.setAttribute('data-theme', theme);
        }
      } catch (e) {}
    })();
  \`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}`;

  const currentCode = activeTab === "css" ? cssSnippet : contextSnippet;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="code" className="code-section section">
      <div className="container">
        <div className="section-header center">
          <div className="section-pill">
            <CodeIcon size={14} />
            <span>Developer Blueprint</span>
          </div>
          <h2 className="section-title">
            Clean <span className="gradient-text">Implementation Code</span>
          </h2>
          <p className="section-subtitle">
            Inspect the lightweight CSS variable engine and SSR-safe Next.js theme initializer.
          </p>
        </div>

        <div className="code-box-container">
          <div className="code-box-header">
            <div className="code-tabs">
              <button
                className={`code-tab ${activeTab === "css" ? "active" : ""}`}
                onClick={() => setActiveTab("css")}
              >
                globals.css (Theme Variables)
              </button>
              <button
                className={`code-tab ${activeTab === "context" ? "active" : ""}`}
                onClick={() => setActiveTab("context")}
              >
                ThemeScript.tsx (Anti-FOUC)
              </button>
            </div>

            <button className="copy-btn" onClick={handleCopy} title="Copy code">
              {copied ? <CheckIcon size={16} className="text-emerald" /> : <CopyIcon size={16} />}
              <span>{copied ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>

          <div className="code-box-body">
            <pre className="code-content">
              <code>{currentCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
