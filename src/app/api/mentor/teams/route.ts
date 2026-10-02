import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/mentor/teams - Get all student teams and guide requests for logged-in teacher
export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized. Teacher access required." }, { status: 401 });
    }

    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId: session.id },
    });

    if (!teacherProfile) {
      return NextResponse.json({ error: "Teacher profile not found." }, { status: 404 });
    }

    // Fetch all guide requests for this teacher
    const guideRequests = await prisma.guideRequest.findMany({
      where: {
        teacherId: teacherProfile.id,
      },
      include: {
        project: {
          include: {
            team: {
              include: {
                creator: {
                  include: { studentProfile: true },
                },
                members: {
                  include: {
                    user: {
                      include: { studentProfile: true },
                    },
                  },
                },
              },
            },
          },
        },
        requestedBy: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const teams = guideRequests.map((gr) => ({
      requestId: gr.id,
      roleType: gr.roleType,
      mentorStatus: gr.status,
      projectId: gr.project.id,
      projectTitle: gr.project.projectTitle,
      problemStatement: gr.project.problemStatement,
      description: gr.project.description,
      domain: gr.project.domain,
      technologies: JSON.parse(gr.project.technologies || "[]"),
      projectStatus: gr.project.status,
      semester: gr.project.semester,
      createdAt: gr.createdAt.toISOString(),
      team: {
        id: gr.project.team.id,
        teamName: gr.project.team.teamName,
        creatorName: gr.project.team.creator.name,
        creatorEmail: gr.project.team.creator.email,
        members: gr.project.team.members.map((m) => ({
          id: m.id,
          userId: m.userId,
          name: m.user.name,
          email: m.user.email,
          rollNumber: m.user.studentProfile?.rollNumber || "N/A",
          semester: m.user.studentProfile?.semester || gr.project.semester,
          department: m.user.studentProfile?.department || "CSE",
          role: m.role,
        })),
      },
    }));

    return NextResponse.json({
      teacher: {
        id: teacherProfile.id,
        name: session.name,
        email: session.email,
        department: teacherProfile.department,
        designation: teacherProfile.designation,
      },
      assignedTeams: teams.filter((t) => t.mentorStatus === "ACCEPTED"),
      pendingRequests: teams.filter((t) => t.mentorStatus === "PENDING"),
      allRequests: teams,
    });
  } catch (error: any) {
    console.error("Mentor teams GET error:", error);
    return NextResponse.json({ error: "Failed to fetch mentor teams" }, { status: 500 });
  }
}

// POST /api/mentor/teams - Accept or Reject a guide request
export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized. Teacher access required." }, { status: 401 });
    }

    const body = await request.json();
    const { requestId, action } = body; // action: "ACCEPT" | "REJECT"

    if (!requestId || !["ACCEPT", "REJECT"].includes(action)) {
      return NextResponse.json({ error: "Invalid request parameters." }, { status: 400 });
    }

    const newStatus = action === "ACCEPT" ? "ACCEPTED" : "REJECTED";

    const updatedRequest = await prisma.guideRequest.update({
      where: { id: requestId },
      data: { status: newStatus },
      include: {
        project: {
          include: {
            team: {
              include: {
                members: true,
              },
            },
          },
        },
      },
    });

    // Send notifications to team members
    for (const member of updatedRequest.project.team.members) {
      await prisma.notification.create({
        data: {
          userId: member.userId,
          type: "GUIDE_REQUEST",
          title: `Guide Request ${action === "ACCEPT" ? "Accepted" : "Declined"}`,
          message: `${session.name} ${action === "ACCEPT" ? "accepted" : "declined"} the request to guide project "${updatedRequest.project.projectTitle}".`,
          link: `/student/projects/${updatedRequest.project.id}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Guide request ${action === "ACCEPT" ? "accepted" : "rejected"} successfully.`,
      request: updatedRequest,
    });
  } catch (error: any) {
    console.error("Mentor teams POST error:", error);
    return NextResponse.json({ error: "Failed to respond to guide request" }, { status: 500 });
  }
}
