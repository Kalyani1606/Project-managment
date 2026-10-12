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
    const { title, message, recipients, sendEmail = true, sendInApp = true, scheduledAt, files = [] } = body;

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
      const filesNote = files && files.length > 0
        ? `\n\n📎 Attached: ${files.map((f: any) => f.name).join(", ")}`
        : "";

      const notificationsData = targetUsers.map((u) => ({
        userId: u.id,
        type: "ANNOUNCEMENT",
        title: `📢 ${title}`,
        message: `${message}${filesNote}`,
        link: "/student/events",
        metadata: files && files.length > 0 ? JSON.stringify({ files }) : null,
        read: false,
      }));

      await prisma.notification.createMany({
        data: notificationsData,
      });
      notificationCount = notificationsData.length;
    }

    // 2. Create Email Logs
    if (sendEmail && targetUsers.length > 0) {
      const filesHtml = files && files.length > 0
        ? `<div style="margin-top: 16px; padding: 14px; background: #FAF2EC; border-radius: 10px; border: 1px solid #EADBD0;">
             <strong style="color: #FF5F38; font-size: 13px;">📎 Attached Document(s):</strong>
             <ul style="margin: 8px 0 0 16px; padding: 0; font-size: 12px; color: #111827;">
               ${files.map((f: any) => `<li><strong>${f.name}</strong> ${f.sizeFormatted ? `<span style="color: #718096;">(${f.sizeFormatted})</span>` : ""}${f.dataUrl ? ` &mdash; <a href="${f.dataUrl}" download="${f.name}" style="color: #FF5F38; text-decoration: none; font-weight: bold;">Download Attachment</a>` : ""}</li>`).join("")}
             </ul>
           </div>`
        : "";

      const filesText = files && files.length > 0
        ? `\n\nAttached Document(s):\n${files.map((f: any) => `- ${f.name} ${f.sizeFormatted ? `(${f.sizeFormatted})` : ""}`).join("\n")}`
        : "";

      const emailLogsData = targetUsers.map((u) => ({
        recipientId: u.id,
        toEmail: u.email,
        subject: `[PROJECT HUB ANNOUNCEMENT] ${title}`,
        htmlBody: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; background: #FAF2EC;"><div style="background: #ffffff; padding: 24px; border-radius: 16px; border: 1px solid #EADBD0; box-shadow: 0 4px 12px rgba(0,0,0,0.04);"><h2 style="color: #FF5F38; margin-top: 0; font-size: 18px;">${title}</h2><p style="color: #111827; font-size: 13px; line-height: 1.6; white-space: pre-wrap;">${message}</p>${filesHtml}<hr style="margin: 20px 0; border: none; border-top: 1px solid #EADBD0;"/><p style="font-size: 11px; color: #718096; margin-bottom: 0;">Project Hub Academic Coordinator &bull; Automated Broadcast</p></div></div>`,
        textBody: `${title}\n\n${message}${filesText}\n\nProject Hub Academic Coordinator`,
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
        attachmentsCount: files.length,
        scheduledAt: scheduledAt || "Immediate",
      },
    });
  } catch (error: any) {
    console.error("Announcement error:", error);
    return NextResponse.json({ error: error.message || "Failed to broadcast announcement" }, { status: 500 });
  }
}
