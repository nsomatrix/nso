import { cookies } from "next/headers";
import { adminAuth } from "./admin";
import type { DecodedIdToken } from "firebase-admin/auth";

export interface ServerUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
}

/**
 * Validates the session cookie in Server Components, Server Actions, or Route Handlers.
 * Returns the decoded Firebase user payload or null if unauthenticated.
 */
export async function getServerSessionUser(): Promise<ServerUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie || !adminAuth) {
      return null;
    }

    const decodedToken: DecodedIdToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
      photoURL: decodedToken.picture,
      emailVerified: decodedToken.email_verified,
    };
  } catch {
    // Expired or revoked session cookie
    return null;
  }
}
