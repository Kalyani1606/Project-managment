const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with engineering students, faculty guides, and sample projects...");

  // Clean existing data
  await prisma.emailLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.guideRequest.deleteMany();
  await prisma.project.deleteMany();
  await prisma.teamInvitation.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.teacherProfile.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash("Acad#Demo2026!", 10);

  // 1. Create Faculty Guides
  const guidesData = [
    {
      name: "Dr. Aris Thorne",
      email: "dr.aris@engg.college.edu",
      department: "Computer Science & Engineering",
      designation: "Professor & Head of AI Lab",
      areasOfExpertise: JSON.stringify(["Artificial Intelligence", "Deep Learning", "Computer Vision", "Neural Networks"]),
      maxProjects: 4,
    },
    {
      name: "Prof. Sunita Menon",
      email: "prof.sunita@engg.college.edu",
      department: "Computer Science & Engineering",
      designation: "Associate Professor",
      areasOfExpertise: JSON.stringify(["Full Stack Web Systems", "Cloud Computing", "Distributed Systems", "Microservices"]),
      maxProjects: 5,
    },
    {
      name: "Dr. Rajesh Iyer",
      email: "dr.rajesh@engg.college.edu",
      department: "Information Science & Engineering",
      designation: "Professor",
      areasOfExpertise: JSON.stringify(["Internet of Things (IoT)", "Embedded Systems", "Edge Computing", "Smart Sensors"]),
      maxProjects: 4,
    },
    {
      name: "Prof. Devika Nair",
      email: "prof.devika@engg.college.edu",
      department: "Cybersecurity & Systems",
      designation: "Assistant Professor",
      areasOfExpertise: JSON.stringify(["Network Security", "Blockchain", "Cryptography", "Ethical Hacking"]),
      maxProjects: 5,
    },
    {
      name: "Dr. Vikramaditya Rao",
      email: "dr.vikram@engg.college.edu",
      department: "Data Science & AI",
      designation: "Associate Professor",
      areasOfExpertise: JSON.stringify(["Big Data Analytics", "Natural Language Processing (NLP)", "Reinforcement Learning"]),
      maxProjects: 3,
    },
  ];

  const createdTeachers = [];
  for (const g of guidesData) {
    const user = await prisma.user.create({
      data: {
        name: g.name,
        email: g.email,
        passwordHash: defaultPasswordHash,
        role: "TEACHER",
        teacherProfile: {
          create: {
            department: g.department,
            designation: g.designation,
            areasOfExpertise: g.areasOfExpertise,
            maxProjects: g.maxProjects,
          },
        },
      },
      include: {
        teacherProfile: true,
      },
    });
    createdTeachers.push(user);
  }

  // 2. Create Students
  const studentsData = [
    {
      name: "Aman Verma",
      email: "aman.verma@engg.college.edu",
      rollNumber: "1MS21CS012",
      semester: 6,
      department: "Computer Science & Engineering",
      bio: "Full Stack enthusiast with keen interest in cloud architecture, Next.js, and scalable web solutions.",
      github: "https://github.com/amanverma",
      linkedin: "https://linkedin.com/in/amanverma",
      skills: JSON.stringify(["React", "Next.js", "Node.js", "TypeScript", "TailwindCSS", "PostgreSQL", "Docker"]),
      profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Priya Patel",
      email: "priya.patel@engg.college.edu",
      rollNumber: "1MS21CS045",
      semester: 6,
      department: "Computer Science & Engineering",
      bio: "AI/ML researcher and data specialist. Passionate about computer vision and applied healthcare AI.",
      github: "https://github.com/priyapatel",
      linkedin: "https://linkedin.com/in/priyapatel",
      skills: JSON.stringify(["Python", "PyTorch", "TensorFlow", "FastAPI", "OpenCV", "Scikit-Learn"]),
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Rahul Sharma",
      email: "rahul.sharma@engg.college.edu",
      rollNumber: "1MS21CS078",
      semester: 6,
      department: "Computer Science & Engineering",
      bio: "Backend developer specializing in distributed systems, Rust, and container orchestration.",
      github: "https://github.com/rahulsharma",
      linkedin: "https://linkedin.com/in/rahulsharma",
      skills: JSON.stringify(["Go", "Rust", "Docker", "Kubernetes", "Redis", "Kafka", "Linux"]),
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Sneha Rao",
      email: "sneha.rao@engg.college.edu",
      rollNumber: "1MS21CS099",
      semester: 6,
      department: "Computer Science & Engineering",
      bio: "IoT hardware hacker and robotics lover. Building smart sensors and edge AI models.",
      github: "https://github.com/sneharao",
      linkedin: "https://linkedin.com/in/sneharao",
      skills: JSON.stringify(["Embedded C", "C++", "MQTT", "ESP32", "Computer Vision", "TensorFlow Lite"]),
      profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Kiran Kumar",
      email: "kiran.kumar@engg.college.edu",
      rollNumber: "1MS21IS034",
      semester: 6,
      department: "Information Science & Engineering",
      bio: "Cybersecurity analyst and ethical penetration tester. Focused on Zero-Trust security.",
      github: "https://github.com/kirankumar",
      linkedin: "https://linkedin.com/in/kirankumar",
      skills: JSON.stringify(["Wireshark", "Network Security", "Metasploit", "Python", "Cryptography"]),
      profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Ananya Sen",
      email: "ananya.sen@engg.college.edu",
      rollNumber: "1MS20CS019",
      semester: 7,
      department: "Computer Science & Engineering",
      bio: "Senior undergraduate exploring generative AI, multimodal agents, and LLM reasoning frameworks.",
      github: "https://github.com/ananyasen",
      linkedin: "https://linkedin.com/in/ananyasen",
      skills: JSON.stringify(["LangChain", "LLMs", "Llama3", "Transformers", "Python", "RAG Systems"]),
      profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    },
  ];

  const createdStudents = [];
  for (const s of studentsData) {
    const studentUser = await prisma.user.create({
      data: {
        name: s.name,
        email: s.email,
        passwordHash: defaultPasswordHash,
        role: "STUDENT",
        studentProfile: {
          create: {
            rollNumber: s.rollNumber,
            semester: s.semester,
            department: s.department,
            bio: s.bio,
            github: s.github,
            linkedin: s.linkedin,
            skills: s.skills,
            profilePicture: s.profilePicture,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });
    createdStudents.push(studentUser);
  }

  // 3. Create Sample Completed Semester 5 Project for Aman Verma & Priya Patel
  const aman = createdStudents[0];
  const priya = createdStudents[1];
  const rahul = createdStudents[2];
  const sneha = createdStudents[3];
  const profSunita = createdTeachers[1];
  const drAris = createdTeachers[0];

  const sem5Team = await prisma.team.create({
    data: {
      teamName: "CodeCrafters Alpha",
      semester: 5,
      creatorId: aman.id,
      members: {
        create: [
          { userId: aman.id, role: "Team Creator", status: "ACCEPTED" },
          { userId: priya.id, role: "Team Member", status: "ACCEPTED" },
        ],
      },
    },
  });

  const sem5Project = await prisma.project.create({
    data: {
      teamId: sem5Team.id,
      semester: 5,
      projectTitle: "MedScan AI: Automated Radiology Triage System",
      problemStatement: "Radiologists in tier-2 district hospitals face extreme diagnostic fatigue with over 300+ X-rays per shift, leading to dangerous triage delays for critical pulmonary conditions.",
      description: "A deep-learning based chest radiograph analysis platform that highlights pneumothorax and acute consolidation anomalies in under 2 seconds with 94.2% sensitivity.",
      domain: "AI / Healthcare",
      technologies: JSON.stringify(["Python", "PyTorch", "FastAPI", "React", "Docker", "DICOM"]),
      status: "COMPLETED",
    },
  });

  if (profSunita.teacherProfile) {
    await prisma.guideRequest.create({
      data: {
        projectId: sem5Project.id,
        teacherId: profSunita.teacherProfile.id,
        requestedById: aman.id,
        roleType: "Lead Guide",
        status: "ACCEPTED",
      },
    });
  }

  // 4. Create an incoming Team Invitation for Priya Patel from Sneha Rao (for Semester 6)
  const snehaTeam = await prisma.team.create({
    data: {
      teamName: "EdgeRobotics Vanguard",
      semester: 6,
      creatorId: sneha.id,
      members: {
        create: [{ userId: sneha.id, role: "Team Creator", status: "ACCEPTED" }],
      },
    },
  });

  await prisma.teamInvitation.create({
    data: {
      teamId: snehaTeam.id,
      senderId: sneha.id,
      receiverId: priya.id,
      semester: 6,
      status: "PENDING",
    },
  });

  // Create corresponding notification for Priya
  await prisma.notification.create({
    data: {
      userId: priya.id,
      type: "TEAM_INVITE",
      title: "Team Invitation from Sneha Rao",
      message: 'Sneha Rao wants to add you to their project team "EdgeRobotics Vanguard" for Semester 6.',
      link: "/student",
      metadata: JSON.stringify({ teamId: snehaTeam.id }),
      read: false,
    },
  });

  // 5. Create System Notifications for Aman
  await prisma.notification.create({
    data: {
      userId: aman.id,
      type: "SYSTEM",
      title: "Welcome to Semester 6 Academic Projects",
      message: "Project registration for Semester 6 is now open. Form your team and submit your problem statement.",
      link: "/student/projects/new",
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: aman.id,
      type: "GUIDE_REQUEST",
      title: "Previous Guide Approved: MedScan AI",
      message: "Prof. Sunita Menon accepted your lead guide request for Semester 5 MedScan AI.",
      link: "/student/projects",
      read: true,
    },
  });

  // Seed sample Email Log
  await prisma.emailLog.create({
    data: {
      recipientId: aman.id,
      toEmail: aman.email,
      subject: "Welcome to NexusAcademic - Your Student Portal Credentials",
      htmlBody: `<p>Welcome Aman Verma! Your account has been provisioned.</p>`,
      textBody: `Welcome Aman Verma! Your account has been provisioned for USN 1MS21CS012.`,
    },
  });

  console.log("Database seeded successfully with realistic students, faculty mentors, and project records!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
