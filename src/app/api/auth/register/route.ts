import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateSecureStudentPassword } from "@/lib/auth";
import { validateCollegeEmail } from "@/lib/collegeEmailValidator";
import { sendAcademicEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, rollNumber, semester, collegeEmail, department, designation, password, role } = body;
    const isCoordinator = role === "COORDINATOR";
    const isMentor = role === "MENTOR" || role === "TEACHER";
    const isReviewer = role === "REVIEWER";

    const trimmedEmail = (collegeEmail || "").trim().toLowerCase();

    // 0a. Reviewer Registration Flow
    if (isReviewer) {
      if (!name || !collegeEmail) {
        return NextResponse.json(
          { error: "Please provide your Name and College Email." },
          { status: 400 }
        );
      }

      const emailValidation = validateCollegeEmail(trimmedEmail);
      if (!emailValidation.isValid) {
        return NextResponse.json(
          { error: emailValidation.error || "Invalid reviewer email address." },
          { status: 400 }
        );
      }

      const existingEmail = await prisma.user.findUnique({ where: { email: trimmedEmail } });
      if (existingEmail) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please log in instead." },
          { status: 409 }
        );
      }

      const rawGeneratedPassword = password || generateSecureStudentPassword();
      const passwordHash = await hashPassword(rawGeneratedPassword);

      const user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: trimmedEmail,
          passwordHash,
          role: "REVIEWER",
          reviewerProfile: {
            create: {
              department: department?.trim() || "Computer Science & Engineering",
              designation: designation?.trim() || "External Reviewer",
              areasOfExpertise: JSON.stringify(["Project Evaluation", "Software Engineering"]),
            },
          },
        },
        include: { reviewerProfile: true },
      });

      await prisma.notification.create({
        data: {
          userId: user.id,
          type: "SYSTEM",
          title: "Welcome to Project Hub!",
          message: `Your Reviewer account is active. You will be notified when projects are assigned for evaluation.`,
          link: "/reviewer",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Reviewer account created successfully! You can now sign in.",
        email: user.email,
        role: "REVIEWER",
        generatedPassword: rawGeneratedPassword,
      });
    }

    // 0b. Coordinator Registration Flow
    if (isCoordinator) {
      if (!name || !collegeEmail) {
        return NextResponse.json(
          { error: "Please provide your Name and College Email." },
          { status: 400 }
        );
      }

      const emailValidation = validateCollegeEmail(trimmedEmail);
      if (!emailValidation.isValid) {
        return NextResponse.json(
          { error: emailValidation.error || "Invalid coordinator email address." },
          { status: 400 }
        );
      }

      const existingEmail = await prisma.user.findUnique({
        where: { email: trimmedEmail },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please log in instead." },
          { status: 409 }
        );
      }

      const rawGeneratedPassword = password || generateSecureStudentPassword();
      const passwordHash = await hashPassword(rawGeneratedPassword);

      const user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: trimmedEmail,
          passwordHash,
          role: "COORDINATOR",
          teacherProfile: {
            create: {
              department: department?.trim() || "Computer Science & Engineering",
              designation: designation?.trim() || "Head of Department & Project Coordinator",
              areasOfExpertise: JSON.stringify(["Academic Administration", "Project Monitoring", "Quality Assurance"]),
              maxProjects: 10,
            },
          },
        },
        include: {
          teacherProfile: true,
        },
      });

      await prisma.notification.create({
        data: {
          userId: user.id,
          type: "SYSTEM",
          title: "Welcome to Project Hub!",
          message: `Your Academic Coordinator account is active. Manage students, mentors, reviews, and project progress.`,
          link: "/coordinator",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Coordinator account created successfully! You can now sign in.",
        email: user.email,
        role: "COORDINATOR",
        generatedPassword: rawGeneratedPassword,
      });
    }

    // 1. Mentor Registration Flow
    if (isMentor) {
      if (!name || !collegeEmail) {
        return NextResponse.json(
          { error: "Please provide your Name and College Email." },
          { status: 400 }
        );
      }

      const emailValidation = validateCollegeEmail(trimmedEmail);
      if (!emailValidation.isValid) {
        return NextResponse.json(
          { error: emailValidation.error || "Invalid faculty email address." },
          { status: 400 }
        );
      }

      const existingEmail = await prisma.user.findUnique({
        where: { email: trimmedEmail },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please log in instead." },
          { status: 409 }
        );
      }

      const rawGeneratedPassword = password || generateSecureStudentPassword();
      const passwordHash = await hashPassword(rawGeneratedPassword);

      const user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: trimmedEmail,
          passwordHash,
          role: "TEACHER",
          teacherProfile: {
            create: {
              department: department?.trim() || "Computer Science & Engineering",
              designation: designation?.trim() || "Assistant Professor",
              areasOfExpertise: JSON.stringify(["Project Mentorship", "Software Engineering", "AI/ML Systems"]),
              maxProjects: 4,
            },
          },
        },
        include: {
          teacherProfile: true,
        },
      });

      await prisma.notification.create({
        data: {
          userId: user.id,
          type: "SYSTEM",
          title: "Welcome to Project Hub!",
          message: `Your Faculty Mentor account is ready. Review assigned student teams and manage project evaluations.`,
          link: "/mentor",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Faculty Mentor account created successfully! You can now sign in.",
        email: user.email,
        role: "TEACHER",
        generatedPassword: rawGeneratedPassword,
      });
    }

    // 2. Student Registration Flow
    if (!name || !rollNumber || !semester || !collegeEmail) {
      return NextResponse.json(
        { error: "Please provide all required fields: Name, Roll Number/USN, Semester, and College Email." },
        { status: 400 }
      );
    }

    const trimmedRoll = rollNumber.trim().toUpperCase();
    const parsedSemester = parseInt(semester, 10);

    if (isNaN(parsedSemester) || parsedSemester < 1 || parsedSemester > 8) {
      return NextResponse.json(
        { error: "Semester must be a valid academic semester between 1 and 8." },
        { status: 400 }
      );
    }

    // Validate college email
    const emailValidation = validateCollegeEmail(trimmedEmail);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.error || "Invalid college email address." },
        { status: 400 }
      );
    }

    // Check for duplicates
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
