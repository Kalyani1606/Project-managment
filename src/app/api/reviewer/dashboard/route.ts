import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET reviewer dashboard stats
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "REVIEWER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalAssigned, submitted, inProgress, upcomingDeadlines, recentEvaluations, notifications] = await Promise.all([
      prisma.reviewAssignment.count({ where: { reviewerId: user.id } }),
      prisma.reviewAssignment.count({ where: { reviewerId: user.id, status: "SUBMITTED" } }),
      prisma.reviewAssignment.count({ where: { reviewerId: user.id, status: "IN_PROGRESS" } }),
      // Upcoming deadlines: PENDING or IN_PROGRESS assignments with deadline within next 7 days
      prisma.reviewAssignment.findMany({
        where: {
          reviewerId: user.id,
          status: { in: ["PENDING", "IN_PROGRESS"] },
          reviewDeadline: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
        include: { project: true },
        orderBy: { reviewDeadline: "asc" },
        take: 5,
      }),
      // Recently submitted
      prisma.reviewerEvaluation.findMany({
        where: { reviewerId: user.id, isDraft: false },
        orderBy: { submittedAt: "desc" },
        take: 5,
        include: {
          assignment: {
            include: {
              project: { include: { team: true } },
            },
          },
        },
      }),
      // Recent unread notifications
      prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const pending = totalAssigned - submitted - inProgress;

    // Recently assigned (last 5)
    const recentAssignments = await prisma.reviewAssignment.findMany({
      where: { reviewerId: user.id },
      orderBy: { assignedAt: "desc" },
      take: 5,
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
          },
        },
        evaluation: true,
      },
    });

    return NextResponse.json({
      stats: { totalAssigned, submitted, inProgress, pending },
      upcomingDeadlines,
      recentEvaluations,
      recentAssignments,
      notifications,
    });
  } catch (error: any) {
    console.error("Reviewer dashboard stats error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
