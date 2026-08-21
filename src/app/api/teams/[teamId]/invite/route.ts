import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendAcademicEmail } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { teamId } = params;
    const body = await request.json();
    const { targetUserId } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: "Please specify the student to invite." }, { status: 400 });
    }

    // 1. Verify team and permission
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        creator: true,
        members: true,
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    if (team.creatorId !== session.id) {
      return NextResponse.json(
        { error: "Only the team creator can send project invitations." },
        { status: 403 }
      );
    }

    // 2. Check if student already in team
    const isAlreadyMember = team.members.some((m) => m.userId === targetUserId);
    if (isAlreadyMember) {
      return NextResponse.json(
        { error: "This student is already a member of the team." },
        { status: 400 }
      );
    }

    // 3. Check if invitation already exists
    const existingInvite = await prisma.teamInvitation.findFirst({
      where: {
        teamId: team.id,
        receiverId: targetUserId,
        status: "PENDING",
      },
    });

    if (existingInvite) {
      return NextResponse.json(
        { error: "A pending team invitation has already been sent to this student." },
        { status: 400 }
      );
    }

    // 4. Fetch target student
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { studentProfile: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Target student not found" }, { status: 404 });
    }

    // 5. Create TeamInvitation record in database
    const invitation = await prisma.teamInvitation.create({
      data: {
        teamId: team.id,
        senderId: session.id,
        receiverId: targetUser.id,
        semester: team.semester,
        status: "PENDING",
      },
    });

    // 6. Create Notification in database for invited student
    await prisma.notification.create({
      data: {
        userId: targetUser.id,
        type: "TEAM_INVITE",
        title: `Team Invitation from ${session.name}`,
        message: `${session.name} wants to add you to their project team "${team.teamName}" for Semester ${team.semester}.`,
        link: "/student",
        metadata: JSON.stringify({
          invitationId: invitation.id,
          teamId: team.id,
          teamName: team.teamName,
          senderName: session.name,
          semester: team.semester,
        }),
      },
    });

    // 7. Dispatch notification email to student's college email
    await sendAcademicEmail({
      recipientId: targetUser.id,
      toEmail: targetUser.email,
      studentName: targetUser.name,
      inviterName: session.name,
      teamName: team.teamName,
      semester: team.semester,
      subject: `Project Team Invitation: "${team.teamName}" from ${session.name}`,
      emailType: "TEAM_INVITATION",
    });

    return NextResponse.json({
      success: true,
      message: `Invitation successfully sent to ${targetUser.name}!`,
      invitation: {
        id: invitation.id,
        receiverId: targetUser.id,
        receiverName: targetUser.name,
        receiverEmail: targetUser.email,
        receiverRoll: targetUser.studentProfile?.rollNumber || "N/A",
        skills: JSON.parse(targetUser.studentProfile?.skills || "[]"),
        status: "PENDING",
      },
    });
  } catch (error: any) {
    console.error("Team invite error:", error);
    return NextResponse.json({ error: error.message || "Failed to send invitation" }, { status: 500 });
  }
}
