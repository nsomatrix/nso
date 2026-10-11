"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

export function FirebaseConfigNotice() {
  const { isConfigured } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isConfigured) {
    return null;
  }

  const envSnippet = `# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin Configuration (Optional for SSR session cookies)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="firebase-notice-container" role="region" aria-label="Firebase setup notification">
      <div className="firebase-notice-header">
        <div className="firebase-notice-title">
          <AlertCircle size={18} className="firebase-notice-icon" />
          <span>Firebase Setup Required</span>
        </div>
        <div className="firebase-notice-actions">
          <button
            type="button"
            className="firebase-notice-toggle"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide instructions" : "Setup guide"}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <p className="firebase-notice-desc">
        Authentication is fully wired up! To connect to your Firebase project, add your keys to{" "}
        <code>.env.local</code>.
      </p>

      {expanded && (
        <div className="firebase-notice-body">
          <div className="firebase-notice-code-header">
            <span>.env.local Template</span>
            <button
              type="button"
              className="firebase-copy-btn"
              onClick={copyToClipboard}
              aria-label="Copy environment template"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? "Copied!" : "Copy template"}</span>
            </button>
          </div>
          <pre className="firebase-notice-code">
            <code>{envSnippet}</code>
          </pre>
          <div className="firebase-notice-steps">
            <ol>
              <li>Create a project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
              <li>Go to <strong>Authentication &rarr; Sign-in method</strong> and enable <strong>Google</strong> and <strong>Email/Password</strong></li>
              <li>Under Project Settings, add a Web App to get your client config</li>
              <li>Paste the values into <code>.env.local</code> and restart the dev server</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
