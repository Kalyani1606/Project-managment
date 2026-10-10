import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, selectedRole } = body;

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
        teacherProfile: true,
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

    // 3. Validate against selectedRole if provided
    if (selectedRole === "STUDENT" && user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "This email is registered as a Faculty/Coordinator account. Please select your role above to sign in." },
        { status: 400 }
      );
    }

    if ((selectedRole === "MENTOR" || selectedRole === "TEACHER") && user.role === "STUDENT") {
      return NextResponse.json(
        { error: "This email is registered as a Student account. Please select 'Student' above to sign in." },
        { status: 400 }
      );
    }

    if (selectedRole === "COORDINATOR" && user.role === "STUDENT") {
      return NextResponse.json(
        { error: "This email is registered as a Student account. Please select 'Student' above to sign in." },
        { status: 400 }
      );
    }

    if (selectedRole === "REVIEWER" && user.role !== "REVIEWER") {
      return NextResponse.json(
        { error: "This email is not registered as a Reviewer account. Please select your correct role." },
        { status: 400 }
      );
    }

    if (user.role === "REVIEWER" && selectedRole && selectedRole !== "REVIEWER") {
      return NextResponse.json(
        { error: "This email is registered as a Reviewer account. Please select 'Reviewer' above to sign in." },
        { status: 400 }
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
        teacherProfile: user.teacherProfile
          ? {
              ...user.teacherProfile,
              areasOfExpertise: JSON.parse(user.teacherProfile.areasOfExpertise || "[]"),
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
