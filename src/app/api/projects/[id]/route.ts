import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            creator: {
              include: {
                studentProfile: true,
              },
            },
            members: {
              include: {
                user: {
                  include: {
                    studentProfile: true,
                  },
                },
              },
            },
          },
        },
        guideRequests: {
          include: {
            teacher: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    let parsedTech: string[] = [];
    try {
      parsedTech = JSON.parse(project.technologies);
    } catch {
      parsedTech = [project.technologies];
    }

    const formattedProject = {
      id: project.id,
      semester: project.semester,
      projectTitle: project.projectTitle,
      problemStatement: project.problemStatement,
      description: project.description,
      domain: project.domain,
      technologies: parsedTech,
      status: project.status,
      teamId: project.teamId,
      teamName: project.team.teamName,
      createdAt: project.createdAt.toISOString(),
      members: project.team.members.map((m) => {
        let skills: string[] = [];
        try {
          skills = m.user.studentProfile?.skills
            ? JSON.parse(m.user.studentProfile.skills)
            : [];
        } catch {
          skills = [];
        }
        return {
          id: m.userId,
          name: m.user.name,
          email: m.user.email,
          role: m.role,
          rollNumber: m.user.studentProfile?.rollNumber || "1MS21CS001",
          semester: m.user.studentProfile?.semester || project.semester,
          department: m.user.studentProfile?.department || "Computer Science",
          github: m.user.studentProfile?.github,
          linkedin: m.user.studentProfile?.linkedin,
          skills,
        };
      }),
      guideRequests: project.guideRequests.map((g) => ({
        id: g.id,
        teacherId: g.teacherId,
        teacherName: g.teacher.user.name,
        designation: g.teacher.designation || "Faculty Mentor",
        department: g.teacher.department || "Computer Science",
        roleType: g.roleType,
        status: g.status,
      })),
    };

    return NextResponse.json({ project: formattedProject });
  } catch (error: any) {
    console.error("Fetch project details error:", error);
    return NextResponse.json({ error: "Failed to fetch project details" }, { status: 500 });
  }
}
