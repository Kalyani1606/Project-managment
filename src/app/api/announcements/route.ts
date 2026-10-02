import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      where: { type: "ANNOUNCEMENT" },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true, role: true }
        }
      }
    });

    const emailLogs = await prisma.emailLog.findMany({
      orderBy: { sentAt: "desc" },
      take: 20
    });

    return NextResponse.json({ notifications, emailLogs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, message, recipients, sendEmail = true, sendInApp = true, scheduledAt } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required." }, { status: 400 });
    }

    // Determine target users based on recipients criteria
    let userWhere: any = {};

    if (recipients === "STUDENTS") {
      userWhere = { role: "STUDENT" };
    } else if (recipients === "MENTORS") {
      userWhere = { role: { in: ["TEACHER", "HOD", "MENTOR"] } };
    } else if (recipients === "SEM_6") {
      userWhere = {
        role: "STUDENT",
        studentProfile: { semester: 6 }
      };
    } else if (recipients === "SEM_7") {
      userWhere = {
        role: "STUDENT",
        studentProfile: { semester: 7 }
      };
    } else if (recipients === "SEM_8") {
      userWhere = {
        role: "STUDENT",
        studentProfile: { semester: 8 }
      };
    }

    const targetUsers = await prisma.user.findMany({
      where: userWhere,
      select: { id: true, email: true, name: true }
    });

    let notificationCount = 0;
    let emailCount = 0;

    // 1. Create In-App Notifications
    if (sendInApp && targetUsers.length > 0) {
      const notificationsData = targetUsers.map((u) => ({
        userId: u.id,
        type: "ANNOUNCEMENT",
        title: `📢 ${title}`,
        message,
        link: "/student/events",
        read: false,
      }));

      await prisma.notification.createMany({
        data: notificationsData,
      });
      notificationCount = notificationsData.length;
    }

    // 2. Create Email Logs
    if (sendEmail && targetUsers.length > 0) {
      const emailLogsData = targetUsers.map((u) => ({
        recipientId: u.id,
        toEmail: u.email,
        subject: `[PROJECT HUB ANNOUNCEMENT] ${title}`,
        htmlBody: `<div style="font-family: sans-serif; padding: 20px; background: #FAF2EC;"><h2 style="color: #FF5F38;">${title}</h2><p style="color: #111827;">${message}</p><hr/><p style="font-size: 12px; color: #666;">Project Hub Academic Coordinator</p></div>`,
        textBody: `${title}\n\n${message}\n\nProject Hub Academic Coordinator`,
      }));

      await prisma.emailLog.createMany({
        data: emailLogsData,
      });
      emailCount = emailLogsData.length;
    }

    return NextResponse.json({
      success: true,
      message: `Announcement broadcast successfully to ${targetUsers.length} recipients.`,
      stats: {
        targetUsersCount: targetUsers.length,
        notificationCount,
        emailCount,
        scheduledAt: scheduledAt || "Immediate",
      },
    });
  } catch (error: any) {
    console.error("Announcement error:", error);
    return NextResponse.json({ error: error.message || "Failed to broadcast announcement" }, { status: 500 });
  }
}
