import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";

    const teachers = await prisma.user.findMany({
      where: {
        role: "TEACHER",
        teacherProfile: { isNot: null },
        ...(query
          ? {
              OR: [
                { name: { contains: query } },
                {
                  teacherProfile: {
                    department: { contains: query },
                  },
                },
                {
                  teacherProfile: {
                    areasOfExpertise: { contains: query },
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        teacherProfile: {
          include: {
            guideRequests: {
              where: { status: "ACCEPTED" },
            },
          },
        },
      },
    });

    const formatted = teachers
      .filter((t) => t.teacherProfile)
      .map((t) => ({
        id: t.teacherProfile!.id,
        userId: t.id,
        name: t.name,
        email: t.email,
        department: t.teacherProfile!.department,
        designation: t.teacherProfile!.designation,
        areasOfExpertise: JSON.parse(t.teacherProfile!.areasOfExpertise || "[]"),
        maxProjects: t.teacherProfile!.maxProjects,
        activeProjectsCount: t.teacherProfile!.guideRequests.length,
      }));

    return NextResponse.json({ staff: formatted });
  } catch (error: any) {
    console.error("Staff list error:", error);
    return NextResponse.json({ error: "Failed to fetch staff list" }, { status: 500 });
  }
}
