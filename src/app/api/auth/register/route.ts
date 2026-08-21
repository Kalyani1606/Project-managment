import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateSecureStudentPassword } from "@/lib/auth";
import { validateCollegeEmail } from "@/lib/collegeEmailValidator";
import { sendAcademicEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, rollNumber, semester, collegeEmail, department, password } = body;

    // 1. Basic validation
    if (!name || !rollNumber || !semester || !collegeEmail) {
      return NextResponse.json(
        { error: "Please provide all required fields: Name, Roll Number/USN, Semester, and College Email." },
        { status: 400 }
      );
    }

    const trimmedEmail = collegeEmail.trim().toLowerCase();
    const trimmedRoll = rollNumber.trim().toUpperCase();
    const parsedSemester = parseInt(semester, 10);

    if (isNaN(parsedSemester) || parsedSemester < 1 || parsedSemester > 8) {
      return NextResponse.json(
        { error: "Semester must be a valid academic semester between 1 and 8." },
        { status: 400 }
      );
    }

    // 2. Validate college email
    const emailValidation = validateCollegeEmail(trimmedEmail);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.error || "Invalid college email address." },
        { status: 400 }
      );
    }

    // 3. Check for duplicates
    const existingEmail = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this college email already exists. Please log in instead." },
        { status: 409 }
      );
    }

    const existingRoll = await prisma.studentProfile.findUnique({
      where: { rollNumber: trimmedRoll },
    });
    if (existingRoll) {
      return NextResponse.json(
        { error: `The Roll Number / USN "${trimmedRoll}" is already registered. If this is an error, please contact Academic Affairs.` },
        { status: 409 }
      );
    }

    // 4. Use provided password or generate secure student temporary password and hash it
    const rawGeneratedPassword = password || generateSecureStudentPassword();
    const passwordHash = await hashPassword(rawGeneratedPassword);

    // 5. Create User & StudentProfile in database
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: trimmedEmail,
        passwordHash,
        role: "STUDENT",
        studentProfile: {
          create: {
            rollNumber: trimmedRoll,
            semester: parsedSemester,
            department: department?.trim() || "Computer Science & Engineering",
            skills: JSON.stringify(["Python", "JavaScript", "React", "Git"]),
            bio: `Engineering student in Semester ${parsedSemester} eager to collaborate on high-impact projects.`,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    // 6. Dispatch official credentials email via backend email service
    await sendAcademicEmail({
      recipientId: user.id,
      toEmail: user.email,
      studentName: user.name,
      rollNumber: trimmedRoll,
      password: rawGeneratedPassword,
      subject: "Your NexusAcademic Project Portal Login Credentials",
      emailType: "REGISTRATION_CREDENTIALS",
    });

    // 7. Create welcome notification in student portal
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "SYSTEM",
        title: "Welcome to NexusAcademic!",
        message: `Your account for Semester ${parsedSemester} is active. Complete your profile and start creating your project team.`,
        link: "/student/profile",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Student account created successfully! Login credentials have been dispatched to your college email.",
      email: user.email,
      rollNumber: trimmedRoll,
      generatedPassword: rawGeneratedPassword, // Returned for convenient preview in demo / testing
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register student account. Please try again." },
      { status: 500 }
    );
  }
}
