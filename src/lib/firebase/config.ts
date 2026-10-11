// Firebase client-side configuration
// All variables prefixed with NEXT_PUBLIC_ are exposed to the browser

export const firebaseClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCRcXz3y7Xhfri1tJ30tA6Dbw2apXSZeF0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nsomatrixweb.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nsomatrixweb",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "nsomatrixweb.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "317179432783",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:317179432783:web:331a0a11a523564cef7f3a",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-E7D19L804K",
};

// Check whether Firebase credentials have been configured
export const isFirebaseConfigured = Boolean(
  firebaseClientConfig.apiKey &&
  firebaseClientConfig.apiKey !== "your_api_key_here" &&
  firebaseClientConfig.projectId &&
  firebaseClientConfig.authDomain
);
