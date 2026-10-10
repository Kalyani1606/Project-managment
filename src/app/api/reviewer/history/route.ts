import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all reviewer evaluations (history page)
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "REVIEWER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const evaluations = await prisma.reviewerEvaluation.findMany({
      where: { reviewerId: user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        auditLogs: { orderBy: { changedAt: "desc" } },
        assignment: {
          include: {
            project: {
              include: {
                team: {
                  include: {
                    members: {
                      where: { status: "ACCEPTED" },
                      include: { user: { include: { studentProfile: true } } },
                    },
                  },
                },
                guideRequests: {
                  where: { status: "ACCEPTED" },
                  include: { teacher: { include: { user: true } } },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ evaluations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
