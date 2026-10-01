import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalStudents,
      totalMentors,
      totalTeams,
      totalProjects,
      studentsBySem,
      projectsByStatus,
      recentNotifications,
      teams
    ] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: { in: ["TEACHER", "HOD", "MENTOR"] } } }),
      prisma.team.count(),
      prisma.project.count(),
      prisma.studentProfile.groupBy({
        by: ["semester"],
        _count: { id: true },
      }),
      prisma.project.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.notification.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, role: true, email: true } },
        },
      }),
      prisma.team.findMany({
        include: {
          members: {
            include: {
              user: {
                include: { studentProfile: true },
              },
            },
          },
          projects: {
            include: {
              guideRequests: {
                include: {
                  teacher: {
                    include: { user: true },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    const semDistribution = {
      sem6: studentsBySem.find((s) => s.semester === 6)?._count.id || 0,
      sem7: studentsBySem.find((s) => s.semester === 7)?._count.id || 0,
      sem8: studentsBySem.find((s) => s.semester === 8)?._count.id || 0,
    };

    const projectStats = {
      inProgress: projectsByStatus.filter((p) => p.status === "IN_DEVELOPMENT" || p.status === "PROGRESS_REVIEW").reduce((acc, curr) => acc + curr._count.id, 0),
      completed: projectsByStatus.filter((p) => p.status === "COMPLETED").reduce((acc, curr) => acc + curr._count.id, 0),
      pendingReview: projectsByStatus.filter((p) => p.status === "UNDER_REVIEW" || p.status === "PROPOSAL_SUBMITTED" || p.status === "PROJECT_CREATED").reduce((acc, curr) => acc + curr._count.id, 0),
    };

    return NextResponse.json({
      totalStudents,
      totalMentors,
      totalTeams,
      totalProjects,
      semDistribution,
      projectStats,
      recentNotifications,
      teams,
    });
  } catch (error: any) {
    console.error("Error fetching coordinator stats:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch stats" }, { status: 500 });
  }
}
