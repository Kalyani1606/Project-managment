import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/coordinator/reviewers/assign
// Assign a reviewer to a team/project with strict mentor-reviewer conflict prevention
export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "COORDINATOR" && session.role !== "HOD")) {
      return NextResponse.json({ error: "Unauthorized. Coordinator or HOD access required." }, { status: 401 });
    }

    const body = await req.json();
    const { teamId, projectId, reviewerId, reviewDeadline } = body;

    if (!teamId || !reviewerId) {
      return NextResponse.json({ error: "teamId and reviewerId are required." }, { status: 400 });
    }

    // 1. Fetch reviewer
    const reviewer = await prisma.user.findUnique({
      where: { id: reviewerId },
      include: { reviewerProfile: true },
    });

    if (!reviewer || reviewer.role !== "REVIEWER") {
      return NextResponse.json({ error: "Selected user is not a valid reviewer." }, { status: 404 });
    }

    // 2. Fetch team & its project + mentor details
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        projects: {
          include: {
            guideRequests: {
              where: { status: "ACCEPTED" },
              include: {
                teacher: {
                  include: { user: true },
                },
              },
            },
            reviewAssignments: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }

    // Determine target project
    const project = projectId
      ? team.projects.find((p) => p.id === projectId)
      : team.projects[0];

    if (!project) {
      return NextResponse.json({ error: "No active project found for this team." }, { status: 404 });
    }

    // =========================================================================
    // 3. STRICT CONFLICT OF INTEREST CHECK
    // A mentor cannot be assigned as the reviewer for their own team!
    // =========================================================================
    const acceptedGuide = project.guideRequests.find((gr) => gr.status === "ACCEPTED");
    const mentorUser = acceptedGuide?.teacher?.user;

    if (mentorUser) {
      const normalize = (s: string) => (s || "").replace(/^(dr\.|prof\.|mr\.|ms\.|mrs\.)\s+/i, "").trim().toLowerCase();
      const isSameUser = mentorUser.id === reviewer.id;
      const isSameEmail = mentorUser.email.trim().toLowerCase() === reviewer.email.trim().toLowerCase();
      const isSameName = mentorUser.name.trim().toLowerCase() === reviewer.name.trim().toLowerCase();
      const isNormalizedSame = normalize(mentorUser.name).length > 3 && normalize(mentorUser.name) === normalize(reviewer.name);

      if (isSameUser || isSameEmail || isSameName || isNormalizedSame) {
        return NextResponse.json(
          {
            error: `Conflict of Interest: ${reviewer.name} is already the assigned faculty mentor for this team (${team.teamName}). Academic integrity rules strictly prohibit a mentor from serving as their own team's evaluator.`,
            conflict: true,
            mentorName: mentorUser.name,
            reviewerName: reviewer.name,
          },
          { status: 400 }
        );
      }
    }

    // 4. Remove any existing reviewer assignment on this project if replacing
    const existingAssignment = await prisma.reviewAssignment.findFirst({
      where: { projectId: project.id },
    });

    let assignment;
    if (existingAssignment) {
      assignment = await prisma.reviewAssignment.update({
        where: { id: existingAssignment.id },
        data: {
          reviewerId: reviewer.id,
          reviewDeadline: reviewDeadline ? new Date(reviewDeadline) : null,
          assignedById: session.id,
          status: "PENDING",
        },
        include: {
          reviewer: { include: { reviewerProfile: true } },
          project: { include: { team: true } },
        },
      });
    } else {
      assignment = await prisma.reviewAssignment.create({
        data: {
          reviewerId: reviewer.id,
          projectId: project.id,
          teamId: team.id,
          assignedById: session.id,
          reviewDeadline: reviewDeadline ? new Date(reviewDeadline) : null,
          status: "PENDING",
        },
        include: {
          reviewer: { include: { reviewerProfile: true } },
          project: { include: { team: true } },
        },
      });
    }

    // 5. Send Notification to Reviewer
    try {
      await prisma.notification.create({
        data: {
          userId: reviewer.id,
          type: "REVIEWER_ASSIGNMENT",
          title: "New Team Assigned for Evaluation",
          message: `Coordinator ${session.name} assigned you to review project "${project.projectTitle}" (Team: ${team.teamName}, ${team.semester}th Sem).`,
          link: "/reviewer?tab=assignments",
        },
      });
    } catch (e) {
      console.warn("Could not create notification for reviewer:", e);
    }

    // 6. Send Notification to Team Creator
    if (team.creatorId) {
      try {
        await prisma.notification.create({
          data: {
            userId: team.creatorId,
            type: "REVIEWER_ASSIGNED",
            title: "Reviewer Assigned for Evaluation",
            message: `${reviewer.name} has been assigned as your project reviewer for "${project.projectTitle}".`,
            link: "/student/projects",
          },
        });
      } catch (e) {
        console.warn("Could not create notification for team creator:", e);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Reviewer ${reviewer.name} successfully assigned to ${team.teamName}.`,
      assignment: {
        id: assignment.id,
        reviewerId: reviewer.id,
        reviewerName: reviewer.name,
        reviewerEmail: reviewer.email,
        reviewDeadline: assignment.reviewDeadline,
        status: assignment.status,
      },
    });
  } catch (error: any) {
    console.error("Error in assign reviewer route:", error);
    return NextResponse.json({ error: error.message || "Failed to assign reviewer." }, { status: 500 });
  }
}

// DELETE /api/coordinator/reviewers/assign
// Unassign a reviewer from a team
export async function DELETE(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "COORDINATOR" && session.role !== "HOD")) {
      return NextResponse.json({ error: "Unauthorized. Coordinator or HOD access required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const assignmentId = searchParams.get("assignmentId");
    const teamId = searchParams.get("teamId");

    if (!assignmentId && !teamId) {
      return NextResponse.json({ error: "assignmentId or teamId required." }, { status: 400 });
    }

    let targetId = assignmentId;
    if (!targetId && teamId) {
      const existing = await prisma.reviewAssignment.findFirst({
        where: { teamId },
      });
      targetId = existing?.id;
    }

    if (!targetId) {
      return NextResponse.json({ error: "Assignment not found." }, { status: 404 });
    }

    await prisma.reviewAssignment.delete({
      where: { id: targetId },
    });

    return NextResponse.json({
      success: true,
      message: "Reviewer unassigned successfully.",
    });
  } catch (error: any) {
    console.error("Error unassigning reviewer:", error);
    return NextResponse.json({ error: error.message || "Failed to unassign reviewer." }, { status: 500 });
  }
}
