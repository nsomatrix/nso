"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

type AuthMode = "signin" | "signup" | "forgot";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/profile";

  const {
    user,
    loading: authLoading,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    isConfigured,
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push(redirectTarget);
    }
  }, [user, authLoading, router, redirectTarget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (mode === "forgot") {
      setSubmitting(true);
      try {
        await sendPasswordReset(email);
        setSuccessMessage(
          "Password reset link has been dispatched to your email. Check your inbox!"
        );
      } catch (err: unknown) {
        const error = err as Error;
        setErrorMessage(error.message);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    if (mode === "signup") {
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }

      setSubmitting(true);
      try {
        await signUpWithEmail(email, password, displayName);
        router.push(redirectTarget);
      } catch (err: unknown) {
        const error = err as Error;
        setErrorMessage(error.message);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Sign in
    setSubmitting(true);
    try {
      await signInWithEmail(email, password);
      router.push(redirectTarget);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <h1 className="auth-card-title">
          {mode === "signin" && "Sign In to Matrix"}
          {mode === "signup" && "Create an Account"}
          {mode === "forgot" && "Reset Password"}
        </h1>
        <p className="auth-card-subtitle">
          {mode === "signin" && "Access your emulators, mods, and cloud settings"}
          {mode === "signup" && "Join the Matrix community to manage your assets"}
          {mode === "forgot" && "Enter your email to receive recovery instructions"}
        </p>
      </div>

      {/* Mode navigation tabs */}
      {mode !== "forgot" && (
        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signin"}
            className={`auth-tab ${mode === "signin" ? "active" : ""}`}
            onClick={() => {
              setMode("signin");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => {
              setMode("signup");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
          >
            Sign Up
          </button>
        </div>
      )}

      {/* Alert Banners */}
      {errorMessage && (
        <div className="auth-alert error" role="alert">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="auth-alert success" role="alert">
          <CheckCircle size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {mode === "signup" && (
          <div className="auth-input-group">
            <label htmlFor="auth-name" className="auth-label">
              Full Name
            </label>
            <div className="auth-input-wrapper">
              <User size={18} className="auth-input-icon" />
              <input
                id="auth-name"
                type="text"
                className="auth-input"
                placeholder="Agent Neo"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="name"
              />
            </div>
          </div>
        )}

        <div className="auth-input-group">
          <label htmlFor="auth-email" className="auth-label">
            Email Address
          </label>
          <div className="auth-input-wrapper">
            <Mail size={18} className="auth-input-icon" />
            <input
              id="auth-email"
              type="email"
              className="auth-input"
              placeholder="neo@matrix.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        </div>

        {mode !== "forgot" && (
          <div className="auth-input-group">
            <div className="auth-label-row">
              <label htmlFor="auth-password" className="auth-label">
                Password
              </label>
              {mode === "signin" && (
                <button
                  type="button"
                  className="auth-forgot-link"
                  onClick={() => {
                    setMode("forgot");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                className="auth-input auth-password-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        )}

        {mode === "signup" && (
          <div className="auth-input-group">
            <label htmlFor="auth-confirm-password" className="auth-label">
              Confirm Password
            </label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                id="auth-confirm-password"
                type={showPassword ? "text" : "password"}
                className="auth-input auth-password-input"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={submitting || !isConfigured}
          id="auth-submit-btn"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="spin-icon" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>
                {mode === "signin" && "Sign In"}
                {mode === "signup" && "Create Account"}
                {mode === "forgot" && "Send Reset Link"}
              </span>
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {mode === "forgot" && (
          <div className="auth-back-row">
            <button
              type="button"
              className="auth-forgot-link"
              onClick={() => {
                setMode("signin");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
            >
              &larr; Back to Sign In
            </button>
          </div>
        )}
      </form>

      <div className="auth-card-footer">
        <p>
          By accessing Matrix, you agree to our{" "}
          <Link href="/terms" className="auth-link-text">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="auth-link-text">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="page-layout">
      <Header />
      <main className="main-content section-container auth-page-container">
        <Suspense
          fallback={
            <div className="auth-loading-card">
              <Loader2 size={32} className="spin-icon" />
              <p>Loading authentication...</p>
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
