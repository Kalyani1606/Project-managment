import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "REVIEWER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assignments = await prisma.reviewAssignment.findMany({
      where: { reviewerId: user.id },
      orderBy: { assignedAt: "desc" },
      include: {
        project: {
          include: {
            team: {
              include: {
                members: {
                  include: {
                    user: { include: { studentProfile: true } },
                  },
                },
              },
            },
            guideRequests: {
              where: { status: "ACCEPTED" },
              include: {
                teacher: { include: { user: true } },
              },
            },
          },
        },
        evaluation: true,
      },
    });

    return NextResponse.json({ assignments });
  } catch (error: any) {
    console.error("Error fetching reviewer assignments:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
