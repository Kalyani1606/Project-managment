import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.toLowerCase().trim();

    const emails = await prisma.emailLog.findMany({
      where: email ? { toEmail: email } : undefined,
      orderBy: { sentAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      emails: emails.map((e) => ({
        id: e.id,
        toEmail: e.toEmail,
        subject: e.subject,
        htmlBody: e.htmlBody,
        textBody: e.textBody,
        sentAt: e.sentAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error("Email log GET error:", error);
    return NextResponse.json({ error: "Failed to fetch email logs" }, { status: 500 });
  }
}
