import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const semesterParam = searchParams.get("semester");
    const semester = semesterParam ? parseInt(semesterParam, 10) : undefined;

    // Fetch all projects where current user is a team member
    const projects = await prisma.project.findMany({
      where: {
        team: {
          members: {
            some: {
              userId: session.id,
            },
          },
        },
        ...(semester ? { semester } : {}),
      },
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
      orderBy: [{ semester: "desc" }, { createdAt: "desc" }],
    });

    const formatted = projects.map((p) => ({
      id: p.id,
      teamId: p.teamId,
      teamName: p.team.teamName,
      semester: p.semester,
      projectTitle: p.projectTitle,
      problemStatement: p.problemStatement,
      description: p.description,
      domain: p.domain,
      technologies: JSON.parse(p.technologies || "[]"),
      status: p.status,
      createdAt: p.createdAt.toISOString(),
      creatorName: p.team.creator.name,
      members: p.team.members.map((m) => ({
        id: m.id,
        userId: m.userId,
        name: m.user.name,
        email: m.user.email,
        rollNumber: m.user.studentProfile?.rollNumber || "N/A",
        semester: m.user.studentProfile?.semester || p.semester,
        department: m.user.studentProfile?.department || "CSE",
        role: m.role,
        status: m.status,
        skills: JSON.parse(m.user.studentProfile?.skills || "[]"),
        github: m.user.studentProfile?.github || null,
        linkedin: m.user.studentProfile?.linkedin || null,
        profilePicture: m.user.studentProfile?.profilePicture || null,
      })),
      guideRequests: p.guideRequests.map((g) => ({
        id: g.id,
        teacherId: g.teacherId,
        teacherName: g.teacher.user.name,
        department: g.teacher.department,
        designation: g.teacher.designation,
        roleType: g.roleType,
        status: g.status,
      })),
    }));

    return NextResponse.json({ projects: formatted });
  } catch (error: any) {
    console.error("Projects GET error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      teamId,
      semester,
      projectTitle,
      problemStatement,
      description,
      domain,
      technologies,
      leadGuideId,
      coGuideId,
    } = body;

    if (!teamId || !semester || !projectTitle || !problemStatement || !description || !domain) {
      return NextResponse.json(
        { error: "Please fill in all mandatory project details (Team, Semester, Title, Problem Statement, Description, and Domain)." },
        { status: 400 }
      );
    }

    const parsedSemester = parseInt(semester, 10);

    // 1. Verify team membership
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: true,
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const isMember = team.members.some((m) => m.userId === session.id);
    if (!isMember) {
      return NextResponse.json({ error: "You must be a member of this team to submit a project." }, { status: 403 });
    }

    // 2. Check if this team already has a project for this semester
    const existingProject = await prisma.project.findFirst({
      where: {
        teamId: team.id,
        semester: parsedSemester,
      },
    });

    if (existingProject) {
      return NextResponse.json(
        { error: `Team "${team.teamName}" already registered a project for Semester ${parsedSemester}.` },
        { status: 400 }
      );
    }

    // 3. Create Project in Database
    const project = await prisma.project.create({
      data: {
        teamId: team.id,
        semester: parsedSemester,
        projectTitle: projectTitle.trim(),
        problemStatement: problemStatement.trim(),
        description: description.trim(),
        domain: domain.trim(),
        technologies: Array.isArray(technologies) ? JSON.stringify(technologies) : JSON.stringify([]),
        status: "PROJECT_CREATED",
      },
    });

    // 4. Create Guide Requests if guides are specified
    if (leadGuideId) {
      await prisma.guideRequest.create({
        data: {
          projectId: project.id,
          teacherId: leadGuideId,
          requestedById: session.id,
          roleType: "Lead Guide",
          status: "PENDING",
        },
      });
    }

    if (coGuideId && coGuideId !== leadGuideId) {
      await prisma.guideRequest.create({
        data: {
          projectId: project.id,
          teacherId: coGuideId,
          requestedById: session.id,
          roleType: "Co-Guide",
          status: "PENDING",
        },
      });
    }

    // 5. Notify all team members about project creation
    for (const member of team.members) {
      await prisma.notification.create({
        data: {
          userId: member.userId,
          type: "PROJECT_CREATED",
          title: `Project Registered: ${project.projectTitle}`,
          message: `${session.name} registered the project "${project.projectTitle}" for team "${team.teamName}" (Semester ${parsedSemester}).`,
          link: `/student/projects/${project.id}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Project "${project.projectTitle}" created successfully for Semester ${parsedSemester}!`,
      projectId: project.id,
      project,
    });
  } catch (error: any) {
    console.error("Project POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 });
  }
}
