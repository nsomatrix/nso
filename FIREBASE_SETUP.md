# Firebase Authentication Setup Guide

This guide walks you through setting up Firebase Authentication for Matrix using industry-standard Next.js App Router patterns (client-side SDK + secure HTTP-only session cookies via Firebase Admin).

---

## 1. Create a Firebase Project

1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or select an existing Google Cloud project).
3. Name your project (e.g. `matrix-app`) and complete the creation wizard.

---

## 2. Enable Authentication Providers

1. In your Firebase Project overview, open **Build** &rarr; **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab:
   - **Email/Password**: Click **Email/Password**, toggle **Enable**, and click **Save**.
   - **Google**: Click **Google**, toggle **Enable**, set your Project support email, and click **Save**.
4. In **Authentication** &rarr; **Settings** &rarr; **Authorized domains**:
   - Ensure `localhost` is listed for local development.
   - Add your production Vercel or custom domain (e.g. `matrix.vercel.app`).

---

## 3. Register Web App & Get Client Keys

1. In the Firebase Console, click the **Settings gear** &rarr; **Project settings**.
2. Under the **General** tab, scroll down to **Your apps** and click the **Web icon (`</>`)**.
3. Register your app name (e.g. `Matrix Web`) and click **Register app**.
4. Copy the `firebaseConfig` keys into your `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="matrix-app.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="matrix-app"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="matrix-app.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:abcdef..."
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"
```

---

## 4. Generate Service Account Key (Firebase Admin)

For server-side session management (HTTP-only cookies and protected Server Components):

1. In **Project settings**, go to the **Service accounts** tab.
2. Select **Firebase Admin SDK (Node.js)**.
3. Click **Generate new private key** and confirm. A JSON file will download.
4. From the JSON file, copy the following into `.env.local`:

```env
FIREBASE_PROJECT_ID="matrix-app"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@matrix-app.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASC...\n-----END PRIVATE KEY-----\n"
```

> **Note on Private Key Newlines:** If copying the private key into Vercel or `.env.local`, keep the literal `\n` characters or wrap the key in double quotes. The admin initialization module automatically normalizes escaped newlines (`\n`).

---

## 5. Architecture Overview

```
Browser (Client)
  │
  ├─► [useAuth() / AuthContext]  ◄── Firebase Client SDK
  │      ├─ Google Sign-In
  │      ├─ Email/Password (Sign In & Sign Up)
  │      └─ Password Reset & Verification Email
  │
  ├─► onIdTokenChanged (Auto-token sync)
  │      │
  │      ▼
  ├─► POST /api/auth/session  ──►  Firebase Admin SDK
  │                                     │
  │                                     ▼
  │                         Sets HTTP-Only "session" Cookie
  │                         (5 days maxAge, SameSite=Lax, Secure)
  │
Next.js Server & Edge
  ├─► middleware.ts             ──► Checks session cookie for protected paths (/profile)
  └─► getServerSessionUser()    ──► Verifies cookie cryptographically in RSC / APIs
```

---

## 6. How to Test

1. Start development server:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:3000`.
3. If keys are not set, a clean setup guide will appear with quick copy helpers.
4. Once keys are configured, click **Sign In** in the header.
5. Create an account with Email/Password or use **Continue with Google**.
6. You will be redirected to the `/profile` dashboard with:
   - Verified session status
   - User credentials, provider badge, UID
   - Option to edit display name, verify email, or sign out.
