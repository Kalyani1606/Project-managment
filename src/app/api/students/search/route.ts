import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";
    const semesterParam = searchParams.get("semester");
    const targetSemester = semesterParam ? parseInt(semesterParam, 10) : undefined;

    // Search students where role is STUDENT and id != session.id
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        id: { not: session.id },
        ...(query
          ? {
              OR: [
                { name: { contains: query } },
                { email: { contains: query } },
                {
                  studentProfile: {
                    rollNumber: { contains: query },
                  },
                },
                {
                  studentProfile: {
                    skills: { contains: query },
                  },
                },
              ],
            }
          : {}),
        ...(targetSemester
          ? {
              studentProfile: {
                semester: targetSemester,
              },
            }
          : {}),
      },
      include: {
        studentProfile: true,
      },
      take: 20,
    });

    const formatted = students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      rollNumber: s.studentProfile?.rollNumber || "N/A",
      semester: s.studentProfile?.semester || 5,
      department: s.studentProfile?.department || "Computer Science",
      bio: s.studentProfile?.bio || "",
      github: s.studentProfile?.github || null,
      linkedin: s.studentProfile?.linkedin || null,
      skills: JSON.parse(s.studentProfile?.skills || "[]"),
      profilePicture: s.studentProfile?.profilePicture || null,
    }));

    return NextResponse.json({ students: formatted });
  } catch (error: any) {
    console.error("Student search error:", error);
    return NextResponse.json({ error: "Failed to search students" }, { status: 500 });
  }
}
