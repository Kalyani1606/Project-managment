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

    // Find all teams where user is either creator or a member
    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { creatorId: session.id },
          { members: { some: { userId: session.id } } },
        ],
        ...(semester ? { semester } : {}),
      },
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
        invitations: {
          include: {
            receiver: {
              include: { studentProfile: true },
            },
          },
        },
        projects: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = teams.map((team) => ({
      id: team.id,
      teamName: team.teamName,
      semester: team.semester,
      creatorId: team.creatorId,
      creatorName: team.creator.name,
      createdAt: team.createdAt.toISOString(),
      projects: team.projects,
      members: team.members.map((m) => ({
        id: m.id,
        userId: m.userId,
        name: m.user.name,
        email: m.user.email,
        rollNumber: m.user.studentProfile?.rollNumber || "N/A",
        semester: m.user.studentProfile?.semester || team.semester,
        department: m.user.studentProfile?.department || "CSE",
        role: m.role,
        status: m.status,
        skills: JSON.parse(m.user.studentProfile?.skills || "[]"),
        github: m.user.studentProfile?.github || null,
        linkedin: m.user.studentProfile?.linkedin || null,
        profilePicture: m.user.studentProfile?.profilePicture || null,
      })),
      pendingInvitations: team.invitations
        .filter((inv) => inv.status === "PENDING")
        .map((inv) => ({
          id: inv.id,
          receiverId: inv.receiverId,
          receiverName: inv.receiver.name,
          receiverEmail: inv.receiver.email,
          receiverRoll: inv.receiver.studentProfile?.rollNumber || "N/A",
          skills: JSON.parse(inv.receiver.studentProfile?.skills || "[]"),
          github: inv.receiver.studentProfile?.github || null,
          linkedin: inv.receiver.studentProfile?.linkedin || null,
          status: inv.status,
        })),
    }));

    return NextResponse.json({ teams: formatted });
  } catch (error: any) {
    console.error("Teams GET error:", error);
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { teamName, semester } = body;

    if (!teamName || !semester) {
      return NextResponse.json(
        { error: "Please provide team name and semester." },
        { status: 400 }
      );
    }

    const parsedSemester = parseInt(semester, 10);

    // Create team and add creator as Team Creator
    const team = await prisma.team.create({
      data: {
        teamName: teamName.trim(),
        semester: parsedSemester,
        creatorId: session.id,
        members: {
          create: {
            userId: session.id,
            role: "Team Creator",
            status: "ACCEPTED",
          },
        },
      },
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
    });

    return NextResponse.json({
      success: true,
      message: `Team "${team.teamName}" created for Semester ${parsedSemester}.`,
      team: {
        id: team.id,
        teamName: team.teamName,
        semester: team.semester,
        creatorId: team.creatorId,
        members: team.members.map((m) => ({
          id: m.id,
          userId: m.userId,
          name: m.user.name,
          email: m.user.email,
          rollNumber: m.user.studentProfile?.rollNumber || "N/A",
          semester: m.user.studentProfile?.semester || team.semester,
          department: m.user.studentProfile?.department || "CSE",
          role: m.role,
          status: m.status,
          skills: JSON.parse(m.user.studentProfile?.skills || "[]"),
          github: m.user.studentProfile?.github || null,
          linkedin: m.user.studentProfile?.linkedin || null,
        })),
      },
    });
  } catch (error: any) {
    console.error("Team POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create team" }, { status: 500 });
  }
}
