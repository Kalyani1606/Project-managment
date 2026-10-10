import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all evaluations visible to coordinator
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== "COORDINATOR" && user.role !== "HOD")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const evaluations = await prisma.reviewerEvaluation.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        reviewer: { include: { reviewerProfile: true } },
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

    // Summary stats
    const totalReviewers = await prisma.user.count({ where: { role: "REVIEWER" } });
    const totalAssignments = await prisma.reviewAssignment.count();
    const totalSubmitted = await prisma.reviewAssignment.count({ where: { status: "SUBMITTED" } });
    const totalPending = await prisma.reviewAssignment.count({ where: { status: { in: ["PENDING", "IN_PROGRESS"] } } });

    return NextResponse.json({
      evaluations,
      summary: { totalReviewers, totalAssignments, totalSubmitted, totalPending },
    });
  } catch (error: any) {
    console.error("Error fetching coordinator marks:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
