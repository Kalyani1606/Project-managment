import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET reviewer profile
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "REVIEWER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reviewerUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { reviewerProfile: true },
    });

    const totalAssigned = await prisma.reviewAssignment.count({ where: { reviewerId: user.id } });
    const submitted = await prisma.reviewAssignment.count({ where: { reviewerId: user.id, status: "SUBMITTED" } });

    return NextResponse.json({ user: reviewerUser, totalAssigned, submitted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH update reviewer profile
export async function PATCH(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "REVIEWER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { contactNumber, areasOfExpertise } = body;

    await prisma.reviewerProfile.update({
      where: { userId: user.id },
      data: {
        contactNumber,
        areasOfExpertise: JSON.stringify(areasOfExpertise || []),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
