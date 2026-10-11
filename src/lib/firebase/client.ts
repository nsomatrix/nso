import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { firebaseClientConfig, isFirebaseConfigured } from "./config";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseClientConfig);
    auth = getAuth(app);
  } catch (error) {
    console.error("Failed to initialize Firebase Client SDK:", error);
  }
}

export { app, auth, isFirebaseConfigured };
