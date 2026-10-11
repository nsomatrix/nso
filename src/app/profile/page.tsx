"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  LogOut,
  Edit2,
  Save,
  Send,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    loading,
    signOutUser,
    sendVerificationEmail,
    updateDisplayName,
  } = useAuth();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [updatingName, setUpdatingName] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="page-layout">
        <Header />
        <main className="main-content section-container auth-page-container">
          <div className="auth-loading-card">
            <Loader2 size={36} className="spin-icon" />
            <p>Verifying secure session...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCopyUid = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setUpdatingName(true);
    setStatusMessage(null);
    try {
      await updateDisplayName(newName.trim());
      setIsEditingName(false);
      setStatusMessage({
        type: "success",
        text: "Display name updated successfully.",
      });
    } catch (e: unknown) {
      const err = e as Error;
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to update display name.",
      });
    } finally {
      setUpdatingName(false);
    }
  };

  const handleSendVerification = async () => {
    setSendingVerification(true);
    setStatusMessage(null);
    try {
      await sendVerificationEmail();
      setStatusMessage({
        type: "success",
        text: "Verification email sent! Please check your inbox and junk folders.",
      });
    } catch (e: unknown) {
      const err = e as Error;
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to send verification email.",
      });
    } finally {
      setSendingVerification(false);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
  };

  const initials = user.displayName
    ? user.displayName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user.email?.[0] || "U").toUpperCase();

  return (
    <div className="page-layout">
      <Header />
      <main className="main-content section-container profile-container">
        {/* Profile Card Header */}
        <div className="profile-header-card">
          <div className="profile-avatar-container">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || "Avatar"}
                width={88}
                height={88}
                className="profile-avatar-large"
                unoptimized
              />
            ) : (
              <div className="profile-avatar-fallback">{initials}</div>
            )}
          </div>

          <div className="profile-identity">
            <div className="profile-name-row">
              {isEditingName ? (
                <div className="profile-edit-name-form">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="profile-name-input"
                    placeholder="Your Name"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="profile-save-btn"
                    onClick={handleSaveName}
                    disabled={updatingName}
                  >
                    {updatingName ? (
                      <Loader2 size={16} className="spin-icon" />
                    ) : (
                      <Save size={16} />
                    )}
                    <span>Save</span>
                  </button>
                  <button
                    type="button"
                    className="profile-cancel-btn"
                    onClick={() => {
                      setIsEditingName(false);
                      setNewName(user.displayName || "");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="profile-name">
                    {user.displayName || "Anonymous User"}
                  </h1>
                  <button
                    type="button"
                    className="profile-edit-trigger"
                    onClick={() => {
                      setNewName(user.displayName || "");
                      setIsEditingName(true);
                    }}
                    aria-label="Edit display name"
                  >
                    <Edit2 size={16} />
                  </button>
                </>
              )}
            </div>

            <div className="profile-email-badge">
              <Mail size={16} />
              <span>{user.email}</span>
            </div>

            <div className="profile-badges-row">
              {user.emailVerified ? (
                <span className="profile-badge verified">
                  <CheckCircle2 size={14} /> Email Verified
                </span>
              ) : (
                <span className="profile-badge unverified">
                  <AlertCircle size={14} /> Email Unverified
                </span>
              )}
              <span className="profile-badge provider">
                Provider: {user.providerId === "google.com" ? "Google" : "Email"}
              </span>
            </div>
          </div>

          <div className="profile-actions-top">
            <button
              type="button"
              className="profile-signout-btn"
              onClick={handleSignOut}
              id="profile-signout-btn"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div
            className={`auth-alert ${statusMessage.type === "success" ? "success" : "error"}`}
            role="alert"
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Verification banner if not verified */}
        {!user.emailVerified && (
          <div className="profile-verify-alert">
            <div className="verify-alert-content">
              <AlertCircle size={20} className="verify-icon" />
              <div>
                <strong>Verify your email address</strong>
                <p>
                  To secure your account and unlock all features, please verify your email.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="verify-action-btn"
              onClick={handleSendVerification}
              disabled={sendingVerification}
            >
              {sendingVerification ? (
                <Loader2 size={16} className="spin-icon" />
              ) : (
                <Send size={16} />
              )}
              <span>{sendingVerification ? "Sending..." : "Send Verification Link"}</span>
            </button>
          </div>
        )}

        {/* Information Grid */}
        <div className="profile-grid">
          {/* Security Card */}
          <div className="profile-info-card">
            <div className="info-card-header">
              <ShieldCheck size={20} className="info-icon" />
              <h2>Security & Session</h2>
            </div>
            <div className="info-card-body">
              <div className="info-item">
                <span className="info-label">Session Status</span>
                <span className="info-value">Encrypted & Active</span>
              </div>
              <div className="info-item">
                <span className="info-label">Session Security</span>
                <span className="info-value">Secure HTTP-Only Cookie</span>
              </div>
              <div className="info-item">
                <span className="info-label">Token Refresh</span>
                <span className="info-value">Automatic</span>
              </div>
            </div>
          </div>

          {/* Account Details Card */}
          <div className="profile-info-card">
            <div className="info-card-header">
              <KeyRound size={20} className="info-icon" />
              <h2>Account Details</h2>
            </div>
            <div className="info-card-body">
              <div className="info-item">
                <span className="info-label">Account ID</span>
                <div className="info-uid-row">
                  <code className="info-uid-code">{user.uid}</code>
                  <button
                    type="button"
                    className="info-copy-btn"
                    onClick={handleCopyUid}
                    aria-label="Copy Account ID"
                  >
                    {copiedUid ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <div className="info-item">
                <span className="info-label">Sign-in Method</span>
                <span className="info-value">
                  {user.providerId === "google.com" ? "Google Account" : "Email & Password"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Account Verification</span>
                <span className="info-value">
                  {user.emailVerified ? "Verified" : "Pending Verification"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
