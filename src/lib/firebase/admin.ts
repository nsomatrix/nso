import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
const privateKey = rawPrivateKey ? rawPrivateKey.replace(/\\n/g, "\n") : undefined;

export const isFirebaseAdminConfigured = Boolean(
  (projectId && clientEmail && privateKey) || process.env.FIREBASE_SERVICE_ACCOUNT_KEY
);

function getAdminApp(): App | null {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }

  // 1. Try individual credentials
  if (projectId && clientEmail && privateKey) {
    try {
      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (error) {
      console.error("Failed to initialize Firebase Admin with individual credentials:", error);
    }
  }

  // 2. Try JSON service account string
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      return initializeApp({
        credential: cert(parsed),
      });
    } catch (error) {
      console.error("Failed to initialize Firebase Admin with service account JSON:", error);
    }
  }

  return null;
}

const adminApp = getAdminApp();
export const adminAuth: Auth | null = adminApp ? getAuth(adminApp) : null;
