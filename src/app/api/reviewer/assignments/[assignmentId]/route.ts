import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET evaluation for a specific assignment
export async function GET(req: Request, { params }: { params: { assignmentId: string } }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "REVIEWER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (params.assignmentId === "a1" || params.assignmentId === "a2") {
      const isProj123 = params.assignmentId === "a1";
      return NextResponse.json({
        assignment: {
          id: params.assignmentId,
          projectId: isProj123 ? "proj_12345" : "proj_67890",
          teamId: "TEAM_1",
          reviewerId: user.id,
          status: isProj123 ? "PENDING" : "SUBMITTED",
          reviewDeadline: new Date(Date.now() + 86400000 * 2).toISOString(),
          evaluation: isProj123 ? null : {
            id: "eval_1",
            isDraft: false,
            criteriaMarks: JSON.stringify({
              projectQuality: 18,
              technicalDepth: 22,
              documentation: 19,
              presentation: 18,
              problemStatement: 14,
            }),
            totalMarks: 91,
            maxTotalMarks: 100,
          },
          project: {
            id: isProj123 ? "proj_12345" : "proj_67890",
            projectTitle: isProj123 ? "AI Traffic Optimization System" : "Blockchain Credential Verification",
            domain: isProj123 ? "Artificial Intelligence" : "Cybersecurity",
            problemStatement: isProj123 ? "Traffic congestion causes major delays in urban areas." : "Fake credentials in the job market are a major issue.",
            description: isProj123 ? "Using CV and ML to optimize traffic lights in real-time based on camera feeds." : "A decentralized app to issue, verify, and revoke academic credentials on the blockchain.",
            status: "APPROVED",
            createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
            technologies: JSON.stringify(isProj123 ? ["Python", "TensorFlow", "OpenCV", "FastAPI"] : ["Solidity", "Next.js", "Ethereum", "Web3.js"]),
            team: {
              id: "TEAM_1",
              teamName: isProj123 ? "TrafficAI" : "CryptoSec",
              members: [
                {
                  role: "Team Leader",
                  user: { name: "Alice Smith", studentProfile: { rollNumber: "1MS21CS001", department: "Computer Science" } }
                },
                {
                  role: "Member",
                  user: { name: "Bob Jones", studentProfile: { rollNumber: "1MS21CS002", department: "Computer Science" } }
                }
              ]
            },
            guideRequests: [
              {
                status: "ACCEPTED",
                teacher: { user: { name: isProj123 ? "Dr. Smith" : "Prof. Alan", email: "mentor@college.edu" } }
              }
            ]
          }
        }
      });
    }

    const assignment = await prisma.reviewAssignment.findUnique({
      where: { id: params.assignmentId },
      include: {
        evaluation: { include: { auditLogs: true } },
        project: {
          include: {
            team: {
              include: {
                members: {
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
    });

    if (!assignment || assignment.reviewerId !== user.id) {
      return NextResponse.json({ error: "Assignment not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({ assignment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST – create or update evaluation (draft or submit)
export async function POST(req: Request, { params }: { params: { assignmentId: string } }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "REVIEWER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assignment = await prisma.reviewAssignment.findUnique({
      where: { id: params.assignmentId },
      include: { evaluation: true },
    });

    if (!assignment || assignment.reviewerId !== user.id) {
      return NextResponse.json({ error: "Assignment not found or access denied" }, { status: 404 });
    }

    // Prevent re-submission if already submitted (not a draft)
    if (assignment.evaluation && !assignment.evaluation.isDraft) {
      return NextResponse.json({ error: "Evaluation already submitted. Contact coordinator for corrections." }, { status: 409 });
    }

    const body = await req.json();
    const { criteriaMarks, totalMarks, maxTotalMarks, isDraft } = body;

    const now = new Date();
    const submittedAt = isDraft ? null : now;

    let evaluation;
    if (assignment.evaluation) {
      // Update existing draft
      evaluation = await prisma.reviewerEvaluation.update({
        where: { id: assignment.evaluation.id },
        data: {
          criteriaMarks: JSON.stringify(criteriaMarks),
          totalMarks,
          maxTotalMarks,
          isDraft,
          submittedAt,
          updatedAt: now,
        },
      });
    } else {
      // Create new evaluation
      evaluation = await prisma.reviewerEvaluation.create({
        data: {
          assignmentId: assignment.id,
          reviewerId: user.id,
          projectId: assignment.projectId,
          teamId: assignment.teamId,
          criteriaMarks: JSON.stringify(criteriaMarks),
          totalMarks,
          maxTotalMarks,
          isDraft,
          submittedAt,
        },
      });
    }

    // Update assignment status
    const newStatus = isDraft ? "IN_PROGRESS" : "SUBMITTED";
    await prisma.reviewAssignment.update({
      where: { id: assignment.id },
      data: { status: newStatus, updatedAt: now },
    });

    // On final submission: notify coordinator(s)
    if (!isDraft) {
      const project = await prisma.project.findUnique({
        where: { id: assignment.projectId },
        include: { team: true },
      });

      const coordinators = await prisma.user.findMany({ where: { role: "COORDINATOR" } });
      for (const coord of coordinators) {
        await prisma.notification.create({
          data: {
            userId: coord.id,
            type: "REVIEW_SUBMITTED",
            title: "Evaluation Submitted",
            message: `Reviewer ${user.name} has submitted marks for project "${project?.projectTitle}" (Team: ${project?.team?.teamName}).`,
            link: "/coordinator?tab=marks",
          },
        });
      }

      // Notify reviewer of successful submission
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: "REVIEW_SUBMITTED",
          title: "Evaluation Submitted Successfully",
          message: `Your marks evaluation for "${project?.projectTitle}" has been recorded and sent to the coordinator.`,
          link: "/reviewer?tab=history",
        },
      });
    }

    return NextResponse.json({ evaluation, status: newStatus });
  } catch (error: any) {
    console.error("Error saving evaluation:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
