const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning all existing data from SQLite database...");

  // 1. Wipe all existing data in correct dependency order
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

  console.log("Database wiped clean.");
  console.log("Seeding fresh Faculty Mentors, Engineering Students, Teams, Projects, and Guide Allocations...");

  // Universal Password for all demo accounts
  const passwordHash = await bcrypt.hash("Password123", 10);

  // 2. Create Faculty Mentors (Teachers) & Coordinator
  const coordinatorUser = await prisma.user.create({
    data: {
      name: "Dr. Marcus Sterling",
      email: "coordinator@college.edu",
      passwordHash,
      role: "COORDINATOR",
      teacherProfile: {
        create: {
          department: "Computer Science & Engineering",
          designation: "Head of Department & Project Coordinator",
          areasOfExpertise: JSON.stringify(["Academic Administration", "Project Monitoring", "Quality Assurance"]),
          maxProjects: 10,
        },
      },
    },
  });

  const teachersData = [
    {
      name: "Kalyani",
      email: "kalyanivilas990@gcu.edu.in",
      department: "Computer Science & Engineering",
      designation: "Assistant Professor",
      areasOfExpertise: JSON.stringify(["Project Mentorship", "Software Engineering", "Web Technologies", "Database Systems"]),
      maxProjects: 5,
    },
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
  ];

  const createdTeachersMap = {};
  for (const t of teachersData) {
    const user = await prisma.user.create({
      data: {
        name: t.name,
        email: t.email,
        passwordHash,
        role: "TEACHER",
        teacherProfile: {
          create: {
            department: t.department,
            designation: t.designation,
            areasOfExpertise: t.areasOfExpertise,
            maxProjects: t.maxProjects,
          },
        },
      },
      include: {
        teacherProfile: true,
      },
    });
    createdTeachersMap[t.email] = user;
  }

  // 3. Create Students
  const studentsData = [
    {
      name: "Kalyani",
      email: "24btice186@gcu.edu.in",
      rollNumber: "24BTCE186",
      semester: 6,
      department: "Computer Science & Engineering",
      bio: "Computer Science engineering student focused on full-stack web applications and AI tools.",
      skills: JSON.stringify(["React", "Next.js", "Python", "TypeScript", "TailwindCSS"]),
    },
    {
      name: "Aman Verma",
      email: "aman.verma@engg.college.edu",
      rollNumber: "1MS21CS012",
      semester: 6,
      department: "Computer Science & Engineering",
      bio: "Full Stack enthusiast with keen interest in cloud architecture, Next.js, and scalable web solutions.",
      skills: JSON.stringify(["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "Docker"]),
    },
    {
      name: "Priya Patel",
      email: "priya.patel@engg.college.edu",
      rollNumber: "1MS21CS045",
      semester: 6,
      department: "Computer Science & Engineering",
      bio: "AI/ML researcher and data specialist. Passionate about computer vision and applied healthcare AI.",
      skills: JSON.stringify(["Python", "PyTorch", "TensorFlow", "FastAPI", "OpenCV"]),
    },
    {
      name: "Rahul Sharma",
      email: "rahul.sharma@engg.college.edu",
      rollNumber: "1MS21CS078",
      semester: 6,
      department: "Computer Science & Engineering",
      bio: "Backend developer specializing in distributed systems, Rust, and container orchestration.",
      skills: JSON.stringify(["Go", "Rust", "Docker", "Kubernetes", "Redis", "Linux"]),
    },
    {
      name: "Sneha Rao",
      email: "sneha.rao@engg.college.edu",
      rollNumber: "1MS21CS099",
      semester: 6,
      department: "Computer Science & Engineering",
      bio: "IoT hardware hacker and robotics lover. Building smart sensors and edge AI models.",
      skills: JSON.stringify(["Embedded C", "C++", "MQTT", "ESP32", "TensorFlow Lite"]),
    },
    {
      name: "Kiran Kumar",
      email: "kiran.kumar@engg.college.edu",
      rollNumber: "1MS21IS034",
      semester: 6,
      department: "Information Science & Engineering",
      bio: "Cybersecurity analyst and ethical penetration tester. Focused on Zero-Trust security.",
      skills: JSON.stringify(["Wireshark", "Network Security", "Metasploit", "Python", "Cryptography"]),
    },
  ];

  const createdStudentsMap = {};
  for (const s of studentsData) {
    const studentUser = await prisma.user.create({
      data: {
        name: s.name,
        email: s.email,
        passwordHash,
        role: "STUDENT",
        studentProfile: {
          create: {
            rollNumber: s.rollNumber,
            semester: s.semester,
            department: s.department,
            bio: s.bio,
            skills: s.skills,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });
    createdStudentsMap[s.email] = studentUser;
  }

  const studentKalyani = createdStudentsMap["24btice186@gcu.edu.in"];
  const priya = createdStudentsMap["priya.patel@engg.college.edu"];
  const aman = createdStudentsMap["aman.verma@engg.college.edu"];
  const rahul = createdStudentsMap["rahul.sharma@engg.college.edu"];
  const sneha = createdStudentsMap["sneha.rao@engg.college.edu"];
  const kiran = createdStudentsMap["kiran.kumar@engg.college.edu"];

  const teacherKalyani = createdTeachersMap["kalyanivilas990@gcu.edu.in"];
  const drAris = createdTeachersMap["dr.aris@engg.college.edu"];
  const profSunita = createdTeachersMap["prof.sunita@engg.college.edu"];
  const drRajesh = createdTeachersMap["dr.rajesh@engg.college.edu"];
  const profDevika = createdTeachersMap["prof.devika@engg.college.edu"];

  // --- TEAM 1: Guided by Mentor Kalyani ---
  const team1 = await prisma.team.create({
    data: {
      teamName: "InnovateX Team",
      semester: 6,
      creatorId: studentKalyani.id,
      members: {
        create: [
          { userId: studentKalyani.id, role: "Team Creator", status: "ACCEPTED" },
          { userId: priya.id, role: "Team Member", status: "ACCEPTED" },
        ],
      },
    },
  });

  const project1 = await prisma.project.create({
    data: {
      teamId: team1.id,
      semester: 6,
      projectTitle: "Smart Academic & Project Management Hub",
      problemStatement: "Manual management of engineering projects leads to submission delays and lack of guide visibility.",
      description: "An integrated web portal for automated team formation, project tracking, and mentor evaluations.",
      domain: "Web Applications & Cloud Platforms",
      technologies: JSON.stringify(["Next.js", "React", "TypeScript", "SQLite", "Prisma", "TailwindCSS"]),
      status: "IN_DEVELOPMENT",
    },
  });

  if (teacherKalyani.teacherProfile) {
    await prisma.guideRequest.create({
      data: {
        projectId: project1.id,
        teacherId: teacherKalyani.teacherProfile.id,
        requestedById: studentKalyani.id,
        roleType: "Lead Guide",
        status: "ACCEPTED",
      },
    });
  }

  // --- TEAM 2: Guided by Dr. Aris Thorne ---
  const team2 = await prisma.team.create({
    data: {
      teamName: "Neural Vision Squad",
      semester: 6,
      creatorId: priya.id,
      members: {
        create: [
          { userId: priya.id, role: "Team Creator", status: "ACCEPTED" },
          { userId: aman.id, role: "Team Member", status: "ACCEPTED" },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      teamId: team2.id,
      semester: 6,
      projectTitle: "Autonomous Drone Defect Detection",
      problemStatement: "Inspecting solar panel arrays manually on large solar farms is hazardous and time-consuming.",
      description: "Computer vision pipeline deployed on autonomous drones for thermal anomaly identification.",
      domain: "Computer Vision & Autonomous Systems",
      technologies: JSON.stringify(["Python", "PyTorch", "YOLOv8", "OpenCV", "ROS"]),
      status: "IN_DEVELOPMENT",
    },
  });

  if (drAris.teacherProfile) {
    await prisma.guideRequest.create({
      data: {
        projectId: project2.id,
        teacherId: drAris.teacherProfile.id,
        requestedById: priya.id,
        roleType: "Lead Guide",
        status: "ACCEPTED",
      },
    });
  }

  // --- TEAM 3: Guided by Prof. Sunita Menon ---
  const team3 = await prisma.team.create({
    data: {
      teamName: "CodeCrafters Alpha",
      semester: 5,
      creatorId: aman.id,
      members: {
        create: [
          { userId: aman.id, role: "Team Creator", status: "ACCEPTED" },
          { userId: rahul.id, role: "Team Member", status: "ACCEPTED" },
        ],
      },
    },
  });

  const project3 = await prisma.project.create({
    data: {
      teamId: team3.id,
      semester: 5,
      projectTitle: "MedScan AI: Automated Radiology Triage System",
      problemStatement: "Radiologists in district hospitals face diagnostic fatigue with over 300+ X-rays per shift.",
      description: "Deep-learning based chest radiograph analysis platform that highlights anomalies in under 2 seconds.",
      domain: "AI / Healthcare",
      technologies: JSON.stringify(["Python", "PyTorch", "FastAPI", "React", "Docker"]),
      status: "COMPLETED",
    },
  });

  if (profSunita.teacherProfile) {
    await prisma.guideRequest.create({
      data: {
        projectId: project3.id,
        teacherId: profSunita.teacherProfile.id,
        requestedById: aman.id,
        roleType: "Lead Guide",
        status: "ACCEPTED",
      },
    });
  }

  // --- TEAM 4: Guided by Dr. Rajesh Iyer ---
  const team4 = await prisma.team.create({
    data: {
      teamName: "EdgeRobotics Lab",
      semester: 6,
      creatorId: sneha.id,
      members: {
        create: [
          { userId: sneha.id, role: "Team Creator", status: "ACCEPTED" },
          { userId: kiran.id, role: "Team Member", status: "ACCEPTED" },
        ],
      },
    },
  });

  const project4 = await prisma.project.create({
    data: {
      teamId: team4.id,
      semester: 6,
      projectTitle: "Smart Agriculture Edge Sensor Network",
      problemStatement: "Small-scale farmers lack real-time soil moisture and automated drip irrigation scheduling.",
      description: "LoRaWAN-based wireless sensor network with predictive solar-powered node controller.",
      domain: "Internet of Things & Edge Computing",
      technologies: JSON.stringify(["Embedded C", "LoRaWAN", "MQTT", "Python", "Raspberry Pi"]),
      status: "IN_DEVELOPMENT",
    },
  });

  if (drRajesh.teacherProfile) {
    await prisma.guideRequest.create({
      data: {
        projectId: project4.id,
        teacherId: drRajesh.teacherProfile.id,
        requestedById: sneha.id,
        roleType: "Lead Guide",
        status: "ACCEPTED",
      },
    });
  }

  // --- TEAM 5: Guided by Prof. Devika Nair ---
  const team5 = await prisma.team.create({
    data: {
      teamName: "CyberVanguard",
      semester: 6,
      creatorId: kiran.id,
      members: {
        create: [
          { userId: kiran.id, role: "Team Creator", status: "ACCEPTED" },
          { userId: rahul.id, role: "Team Member", status: "ACCEPTED" },
        ],
      },
    },
  });

  const project5 = await prisma.project.create({
    data: {
      teamId: team5.id,
      semester: 6,
      projectTitle: "Zero-Trust IoT Device Authentication Protocol",
      problemStatement: "IoT edge nodes are vulnerable to spoofing and unauthorized network access.",
      description: "A lightweight cryptographic protocol for embedded device identity verification using hardware keys.",
      domain: "Cybersecurity & Embedded Systems",
      technologies: JSON.stringify(["C++", "Python", "MQTT", "Cryptography", "ESP32"]),
      status: "IN_DEVELOPMENT",
    },
  });

  if (profDevika.teacherProfile) {
    await prisma.guideRequest.create({
      data: {
        projectId: project5.id,
        teacherId: profDevika.teacherProfile.id,
        requestedById: kiran.id,
        roleType: "Lead Guide",
        status: "ACCEPTED",
      },
    });
  }

  console.log("Database successfully populated with clean seed data for all 5 faculty mentors!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
