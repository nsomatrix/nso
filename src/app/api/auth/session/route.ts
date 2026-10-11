import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

const SESSION_EXPIRATION_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const idToken = body?.idToken;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "Invalid request: idToken is required." },
        { status: 400 }
      );
    }

    if (!adminAuth) {
      // Firebase Admin is not configured yet (e.g. initial setup before service account added)
      return NextResponse.json(
        {
          status: "notice",
          message: "Firebase Admin is not configured. Server cookie not set, but client auth proceeds.",
        },
        { status: 200 }
      );
    }

    // Verify the ID token and create a session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRATION_MS,
    });

    const response = NextResponse.json({ status: "success" }, { status: 200 });

    response.cookies.set("session", sessionCookie, {
      maxAge: SESSION_EXPIRATION_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Error creating Firebase session cookie:", error);
    return NextResponse.json(
      { error: "Failed to create session cookie." },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ status: "success" }, { status: 200 });

    response.cookies.set("session", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Error clearing Firebase session cookie:", error);
    return NextResponse.json(
      { error: "Failed to clear session." },
      { status: 500 }
    );
  }
}
