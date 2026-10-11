"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  onIdTokenChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase/client";
import { getFriendlyAuthErrorMessage } from "@/lib/firebase/auth-errors";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  providerId?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: User | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapFirebaseUser(user: User): UserProfile {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    providerId: user.providerData?.[0]?.providerId || "password",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  // Sync session cookie with server
  const syncServerSession = useCallback(async (token: string | null) => {
    try {
      if (token) {
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token }),
        });
      } else {
        await fetch("/api/auth/session", {
          method: "DELETE",
        });
      }
    } catch (err) {
      console.warn("Failed to synchronize session cookie with server:", err);
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      return;
    }

    const unsubscribe = onIdTokenChanged(
      auth,
      async (currentUser) => {
        if (currentUser) {
          setFirebaseUser(currentUser);
          setUser(mapFirebaseUser(currentUser));
          try {
            const token = await currentUser.getIdToken();
            await syncServerSession(token);
          } catch (e) {
            console.warn("Error obtaining ID token:", e);
          }
        } else {
          setFirebaseUser(null);
          setUser(null);
          await syncServerSession(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Auth state observer error:", err);
        const authErr = err as { code?: string };
        setError(getFriendlyAuthErrorMessage(authErr.code || ""));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [syncServerSession]);

  const clearError = useCallback(() => setError(null), []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    clearError();
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase Authentication is not configured in .env.local.");
    }
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      const token = await result.user.getIdToken();
      await syncServerSession(token);
    } catch (err: unknown) {
      const authErr = err as { code?: string; message?: string };
      const msg = getFriendlyAuthErrorMessage(authErr.code || "");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [clearError, syncServerSession]);

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName?: string) => {
      clearError();
      if (!isFirebaseConfigured || !auth) {
        throw new Error("Firebase Authentication is not configured in .env.local.");
      }
      setLoading(true);
      try {
        const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (displayName && displayName.trim()) {
          await updateProfile(result.user, { displayName: displayName.trim() });
        }
        const token = await result.user.getIdToken(true);
        await syncServerSession(token);
        // Refresh local user state with display name
        setUser(mapFirebaseUser(result.user));
      } catch (err: unknown) {
        const authErr = err as { code?: string; message?: string };
        const msg = getFriendlyAuthErrorMessage(authErr.code || "");
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [clearError, syncServerSession]
  );

  const sendPasswordReset = useCallback(async (email: string) => {
    clearError();
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase Authentication is not configured in .env.local.");
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: unknown) {
      const authErr = err as { code?: string; message?: string };
      const msg = getFriendlyAuthErrorMessage(authErr.code || "");
      setError(msg);
      throw new Error(msg);
    }
  }, [clearError]);

  const sendVerificationEmail = useCallback(async () => {
    clearError();
    if (!auth?.currentUser) {
      throw new Error("No user currently logged in.");
    }
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (err: unknown) {
      const authErr = err as { code?: string; message?: string };
      const msg = getFriendlyAuthErrorMessage(authErr.code || "");
      setError(msg);
      throw new Error(msg);
    }
  }, [clearError]);

  const updateDisplayName = useCallback(async (name: string) => {
    clearError();
    if (!auth?.currentUser) {
      throw new Error("No user currently logged in.");
    }
    try {
      await updateProfile(auth.currentUser, { displayName: name.trim() });
      if (auth.currentUser) {
        setUser(mapFirebaseUser(auth.currentUser));
      }
    } catch (err: unknown) {
      const authErr = err as { code?: string; message?: string };
      const msg = getFriendlyAuthErrorMessage(authErr.code || "");
      setError(msg);
      throw new Error(msg);
    }
  }, [clearError]);

  const signOutUser = useCallback(async () => {
    clearError();
    try {
      if (auth) {
        await fbSignOut(auth);
      }
      await syncServerSession(null);
      setUser(null);
      setFirebaseUser(null);
    } catch (err: unknown) {
      const authErr = err as { code?: string; message?: string };
      const msg = getFriendlyAuthErrorMessage(authErr.code || "");
      setError(msg);
      throw new Error(msg);
    }
  }, [clearError, syncServerSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        error,
        isConfigured: isFirebaseConfigured,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        sendVerificationEmail,
        updateDisplayName,
        signOutUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
