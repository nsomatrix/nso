"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FirebaseConfigNotice } from "@/components/FirebaseConfigNotice";
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

function GoogleIcon() {
  return (
    <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/profile";

  const {
    user,
    loading: authLoading,
    signInWithGoogle,
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
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
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

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setGoogleSubmitting(true);
    try {
      await signInWithGoogle();
      router.push(redirectTarget);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message);
    } finally {
      setGoogleSubmitting(false);
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

      <FirebaseConfigNotice />

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

      {/* Social Logins */}
      {mode !== "forgot" && (
        <div className="auth-social-section">
          <button
            type="button"
            className="auth-google-btn"
            onClick={handleGoogleSignIn}
            disabled={googleSubmitting || submitting || !isConfigured}
            id="google-signin-btn"
          >
            {googleSubmitting ? (
              <Loader2 size={18} className="spin-icon" />
            ) : (
              <GoogleIcon />
            )}
            <span>
              {googleSubmitting ? "Connecting..." : "Continue with Google"}
            </span>
          </button>

          <div className="auth-divider">
            <span className="auth-divider-line" />
            <span className="auth-divider-text">OR EMAIL</span>
            <span className="auth-divider-line" />
          </div>
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
          disabled={submitting || googleSubmitting || !isConfigured}
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
