import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        studentProfile: true,
      },
    });

    if (!user || !user.studentProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentProfile: {
        ...user.studentProfile,
        skills: JSON.parse(user.studentProfile.skills || "[]"),
      },
    });
  } catch (error: any) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, semester, department, bio, github, linkedin, skills, profilePicture } = body;

    // Update User and StudentProfile
    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        studentProfile: {
          update: {
            semester: semester !== undefined ? parseInt(semester, 10) : undefined,
            department: department !== undefined ? department.trim() : undefined,
            bio: bio !== undefined ? bio.trim() : undefined,
            github: github !== undefined ? github.trim() : undefined,
            linkedin: linkedin !== undefined ? linkedin.trim() : undefined,
            skills: Array.isArray(skills) ? JSON.stringify(skills) : undefined,
            profilePicture: profilePicture !== undefined ? profilePicture : undefined,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        studentProfile: updatedUser.studentProfile
          ? {
              ...updatedUser.studentProfile,
              skills: JSON.parse(updatedUser.studentProfile.skills || "[]"),
            }
          : null,
      },
    });
  } catch (error: any) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
