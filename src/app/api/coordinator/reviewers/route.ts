import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/coordinator/reviewers
// Returns all reviewers with their assignments, and all teams with projects, mentors, and reviewer assignments
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== "COORDINATOR" && user.role !== "HOD")) {
      return NextResponse.json({ error: "Unauthorized. Coordinator or HOD access required." }, { status: 401 });
    }

    // 1. Fetch all reviewers
    const reviewers = await prisma.user.findMany({
      where: { role: "REVIEWER" },
      orderBy: { name: "asc" },
      include: {
        reviewerProfile: true,
        reviewAssignments: {
          include: {
            project: {
              include: {
                team: true,
              },
            },
            evaluation: true,
          },
        },
      },
    });

    // 2. Fetch all teams with projects, members, mentors and review assignments
    const teams = await prisma.team.findMany({
      orderBy: [{ semester: "asc" }, { teamName: "asc" }],
      include: {
        members: {
          where: { status: "ACCEPTED" },
          include: {
            user: {
              include: { studentProfile: true },
            },
          },
        },
        projects: {
          include: {
            guideRequests: {
              where: { status: "ACCEPTED" },
              include: {
                teacher: {
                  include: {
                    user: true,
                  },
                },
              },
            },
            reviewAssignments: {
              include: {
                reviewer: {
                  include: {
                    reviewerProfile: true,
                  },
                },
                evaluation: true,
              },
            },
          },
        },
      },
    });

    // 3. Transform data for easy client consumption
    const formattedTeams = teams.map((t) => {
      const project = t.projects[0] || null;
      const mentorGuideRequest = project?.guideRequests?.find((gr) => gr.status === "ACCEPTED") || null;
      const mentorUser = mentorGuideRequest?.teacher?.user || null;
      const assignment = project?.reviewAssignments?.[0] || null;
      const reviewerUser = assignment?.reviewer || null;

      return {
        teamId: t.id,
        teamName: t.teamName,
        semester: t.semester,
        creatorId: t.creatorId,
        members: t.members.map((m) => ({
          userId: m.userId,
          name: m.user.name,
          email: m.user.email,
          role: m.role,
          rollNumber: m.user.studentProfile?.rollNumber || "N/A",
        })),
        project: project
          ? {
              id: project.id,
              title: project.projectTitle,
              problemStatement: project.problemStatement,
              domain: project.domain,
              status: project.status,
            }
          : null,
        mentor: mentorUser
          ? {
              id: mentorUser.id,
              name: mentorUser.name,
              email: mentorUser.email,
              designation: mentorGuideRequest?.teacher?.designation || "Faculty Mentor",
              department: mentorGuideRequest?.teacher?.department || "CSE",
            }
          : null,
        assignment: assignment
          ? {
              id: assignment.id,
              reviewerId: assignment.reviewerId,
              reviewerName: reviewerUser?.name || "Assigned Reviewer",
              reviewerEmail: reviewerUser?.email || "",
              reviewerDepartment: reviewerUser?.reviewerProfile?.department || "External Panel",
              reviewDeadline: assignment.reviewDeadline,
              status: assignment.status,
              evaluationSubmitted: !!assignment.evaluation,
            }
          : null,
      };
    });

    const formattedReviewers = reviewers.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      department: r.reviewerProfile?.department || "Academic Panel",
      designation: r.reviewerProfile?.designation || "External Reviewer",
      staffId: r.reviewerProfile?.staffId || "",
      contactNumber: r.reviewerProfile?.contactNumber || "",
      assignedCount: r.reviewAssignments.length,
      assignedTeams: r.reviewAssignments.map((ra) => ({
        assignmentId: ra.id,
        teamId: ra.teamId,
        teamName: ra.project?.team?.teamName || "Team",
        projectTitle: ra.project?.projectTitle || "Project",
        status: ra.status,
      })),
    }));

    return NextResponse.json({
      success: true,
      reviewers: formattedReviewers,
      teams: formattedTeams,
    });
  } catch (error: any) {
    console.error("Error fetching coordinator reviewers:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch reviewers." }, { status: 500 });
  }
}
