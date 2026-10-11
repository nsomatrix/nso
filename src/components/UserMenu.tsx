"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User as UserIcon, LogOut, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";

export function UserMenu() {
  const { user, loading, signOutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on click outside or Esc key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      setLoggingOut(true);
      await signOutUser();
      setIsOpen(false);
      router.push("/");
    } catch (e) {
      console.error("Sign out error:", e);
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="user-menu-loading" aria-label="Loading authentication state">
        <div className="skeleton-avatar" />
      </div>
    );
  }

  if (!user) {
    return (
      <Link href="/login" className="auth-signin-btn" id="header-signin-btn">
        <UserIcon size={16} />
        <span>Sign In</span>
      </Link>
    );
  }

  const initials = user.displayName
    ? user.displayName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user.email?.[0] || "U").toUpperCase();

  return (
    <div className="user-menu-wrapper" ref={menuRef}>
      <button
        type="button"
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User account menu"
      >
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.displayName || "User avatar"}
            width={32}
            height={32}
            className="user-avatar-img"
            unoptimized
          />
        ) : (
          <div className="user-avatar-fallback">{initials}</div>
        )}
        <span className="user-name-label">{user.displayName || user.email?.split("@")[0]}</span>
        <ChevronDown size={14} className={`dropdown-chevron ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <div className="user-dropdown-card" role="menu">
          <div className="user-dropdown-header">
            <div className="dropdown-user-name">{user.displayName || "User"}</div>
            <div className="dropdown-user-email">{user.email}</div>
            <div className="dropdown-verified-status">
              {user.emailVerified ? (
                <span className="badge-verified">
                  <CheckCircle2 size={12} /> Verified
                </span>
              ) : (
                <span className="badge-unverified">
                  <AlertCircle size={12} /> Unverified
                </span>
              )}
            </div>
          </div>

          <div className="user-dropdown-divider" />

          <div className="user-dropdown-links">
            <Link
              href="/profile"
              className="user-dropdown-item"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <UserIcon size={16} />
              <span>Profile & Security</span>
            </Link>
          </div>

          <div className="user-dropdown-divider" />

          <button
            type="button"
            className="user-dropdown-item user-dropdown-logout"
            role="menuitem"
            onClick={handleSignOut}
            disabled={loggingOut}
          >
            <LogOut size={16} />
            <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
