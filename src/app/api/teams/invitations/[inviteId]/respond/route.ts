import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { inviteId: string } }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { inviteId } = params;
    const body = await request.json();
    const { action } = body; // "ACCEPT" | "REJECT"

    if (!action || !["ACCEPT", "REJECT"].includes(action)) {
      return NextResponse.json({ error: "Invalid action. Must be ACCEPT or REJECT." }, { status: 400 });
    }

    // 1. Fetch invitation
    const invitation = await prisma.teamInvitation.findUnique({
      where: { id: inviteId },
      include: {
        team: true,
        sender: true,
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (invitation.receiverId !== session.id) {
      return NextResponse.json({ error: "You are not authorized to respond to this invitation." }, { status: 403 });
    }

    if (invitation.status !== "PENDING") {
      return NextResponse.json(
        { error: `This invitation has already been ${invitation.status.toLowerCase()}.` },
        { status: 400 }
      );
    }

    if (action === "ACCEPT") {
      // Update invitation status
      await prisma.teamInvitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED" },
      });

      // Add student to TeamMember table
      await prisma.teamMember.upsert({
        where: {
          teamId_userId: {
            teamId: invitation.teamId,
            userId: session.id,
          },
        },
        update: {
          status: "ACCEPTED",
          role: "Team Member",
        },
        create: {
          teamId: invitation.teamId,
          userId: session.id,
          role: "Team Member",
          status: "ACCEPTED",
        },
      });

      // Notify team creator
      await prisma.notification.create({
        data: {
          userId: invitation.senderId,
          type: "INVITE_ACCEPTED",
          title: "Team Invitation Accepted!",
          message: `${session.name} accepted your invitation to join team "${invitation.team.teamName}".`,
          link: "/student/projects",
        },
      });

      return NextResponse.json({
        success: true,
        message: `You have successfully joined "${invitation.team.teamName}"!`,
      });
    } else {
      // Update invitation status to REJECTED
      await prisma.teamInvitation.update({
        where: { id: invitation.id },
        data: { status: "REJECTED" },
      });

      // Notify team creator
      await prisma.notification.create({
        data: {
          userId: invitation.senderId,
          type: "INVITE_REJECTED",
          title: "Team Invitation Declined",
          message: `${session.name} declined the invitation to join team "${invitation.team.teamName}".`,
          link: "/student/projects",
        },
      });

      return NextResponse.json({
        success: true,
        message: `You declined the invitation to join "${invitation.team.teamName}".`,
      });
    }
  } catch (error: any) {
    console.error("Invite response error:", error);
    return NextResponse.json({ error: error.message || "Failed to respond to invitation" }, { status: 500 });
  }
}
