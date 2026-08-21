import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch incoming invitations for this student
    const incoming = await prisma.teamInvitation.findMany({
      where: {
        receiverId: session.id,
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
        sender: {
          include: { studentProfile: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Fetch outgoing invitations sent by this student
    const outgoing = await prisma.teamInvitation.findMany({
      where: {
        senderId: session.id,
      },
      include: {
        team: true,
        receiver: {
          include: { studentProfile: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedIncoming = incoming.map((inv) => ({
      id: inv.id,
      teamId: inv.teamId,
      teamName: inv.team.teamName,
      semester: inv.semester,
      senderId: inv.senderId,
      senderName: inv.sender.name,
      senderEmail: inv.sender.email,
      senderRoll: inv.sender.studentProfile?.rollNumber || "N/A",
      senderSkills: JSON.parse(inv.sender.studentProfile?.skills || "[]"),
      status: inv.status,
      createdAt: inv.createdAt.toISOString(),
      currentMembersCount: inv.team.members.length,
    }));

    const formattedOutgoing = outgoing.map((inv) => ({
      id: inv.id,
      teamId: inv.teamId,
      teamName: inv.team.teamName,
      semester: inv.semester,
      receiverId: inv.receiverId,
      receiverName: inv.receiver.name,
      receiverEmail: inv.receiver.email,
      receiverRoll: inv.receiver.studentProfile?.rollNumber || "N/A",
      receiverSkills: JSON.parse(inv.receiver.studentProfile?.skills || "[]"),
      status: inv.status,
      createdAt: inv.createdAt.toISOString(),
    }));

    return NextResponse.json({
      incoming: formattedIncoming,
      outgoing: formattedOutgoing,
    });
  } catch (error: any) {
    console.error("Invitations GET error:", error);
    return NextResponse.json({ error: "Failed to fetch invitations" }, { status: 500 });
  }
}
