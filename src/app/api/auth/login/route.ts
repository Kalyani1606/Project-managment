import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please enter your college email and password." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 1. Find user by email
    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
      include: {
        studentProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid college email or password. Please verify your credentials." },
        { status: 401 }
      );
    }

    // 2. Validate password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid college email or password. Please verify your credentials." },
        { status: 401 }
      );
    }

    // 3. Ensure role is STUDENT (Phase 1 rule)
    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "This portal is currently dedicated for student access. Faculty portal will be enabled in Phase 2." },
        { status: 403 }
      );
    }

    // 4. Generate JWT
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // 5. Build response with HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentProfile: user.studentProfile
          ? {
              ...user.studentProfile,
              skills: JSON.parse(user.studentProfile.skills || "[]"),
            }
          : null,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login. Please try again." },
      { status: 500 }
    );
  }
}
