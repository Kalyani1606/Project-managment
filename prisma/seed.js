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

  // 2b. Create Demo Reviewers
  const reviewersData = [
    {
      name: "kal",
      email: "455btit@gcu.edu.in",
      department: "Computer Science & Engineering",
      designation: "External Reviewer",
      areasOfExpertise: JSON.stringify(["Final Year Project Evaluation", "Software Engineering", "AI/ML", "System Design"]),
    },
    {
      name: "Dr. Nalini Patil",
      email: "reviewer@college.edu",
      department: "Computer Science & Engineering",
      designation: "External Reviewer",
      areasOfExpertise: JSON.stringify(["Final Year Project Evaluation", "Software Engineering", "AI/ML", "System Design"]),
    },
    {
      name: "Prof. Robert Langford",
      email: "robert.langford@review.college.edu",
      department: "Information Technology",
      designation: "Senior Reviewer",
      areasOfExpertise: JSON.stringify(["IoT", "Embedded Systems", "Cloud Computing", "Project Evaluation"]),
    },
  ];

  for (const r of reviewersData) {
    await prisma.user.create({
      data: {
        name: r.name,
        email: r.email,
        passwordHash,
        role: "REVIEWER",
        reviewerProfile: {
          create: {
            department: r.department,
            designation: r.designation,
            areasOfExpertise: r.areasOfExpertise,
          },
        },
      },
    });
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

  // ---- 8TH SEMESTER TEAMS & PROJECTS + REVIEWER ASSIGNMENTS ----
  // Fetch created reviewers
  const reviewer1 = await prisma.user.findUnique({ where: { email: "reviewer@college.edu" } });
  const reviewer2 = await prisma.user.findUnique({ where: { email: "robert.langford@review.college.edu" } });

  const now = new Date();
  const deadlineIn7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const deadlineIn4 = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
  const deadlineIn2 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const past2Days = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const past5Days = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

  // 8th Sem Team 1 (Pending Review)
  const team8A = await prisma.team.create({
    data: {
      teamName: "Neural Vision Squad",
      semester: 8,
      creatorId: studentKalyani.id,
      members: {
        create: [
          { userId: studentKalyani.id, role: "Team Creator", status: "ACCEPTED" },
          { userId: aman.id, role: "Team Member", status: "ACCEPTED" },
        ],
      },
    },
  });

  const project8A = await prisma.project.create({
    data: {
      teamId: team8A.id,
      semester: 8,
      projectTitle: "Autonomous Drone Defect Detection using YOLOv9",
      problemStatement: "Industrial inspection of wind turbines and solar panels requires costly manual labor; an autonomous aerial defect detection system would significantly reduce costs and inspection time.",
      description: "A real-time defect detection system using YOLOv9 deployed on an autonomous drone with sub-2-second inference and adaptive flight path planning.",
      domain: "Computer Vision & Edge AI",
      technologies: JSON.stringify(["Python", "YOLOv9", "PyTorch", "OpenCV", "ROS2", "Raspberry Pi"]),
      status: "FINAL_REVIEW",
    },
  });

  if (drAris.teacherProfile) {
    await prisma.guideRequest.create({
      data: {
        projectId: project8A.id,
        teacherId: drAris.teacherProfile.id,
        requestedById: studentKalyani.id,
        roleType: "Lead Guide",
        status: "ACCEPTED",
      },
    });
  }

  // 8th Sem Team 2 (In-Progress Draft Evaluation)
  const team8B = await prisma.team.create({
    data: {
      teamName: "CyberTrust Protocols",
      semester: 8,
      creatorId: rahul.id,
      members: {
        create: [
          { userId: rahul.id, role: "Team Creator", status: "ACCEPTED" },
          { userId: priya.id, role: "Team Member", status: "ACCEPTED" },
        ],
      },
    },
  });

  const project8B = await prisma.project.create({
    data: {
      teamId: team8B.id,
      semester: 8,
      projectTitle: "Decentralized Verifiable Credentials for Academic Records",
      problemStatement: "Academic credential forgery causes significant verification delays; a tamper-proof blockchain system provides instant verification.",
      description: "Zero-knowledge proof-based academic transcript verification built on Polygon ID with low gas overhead and instant employer validation.",
      domain: "Blockchain & Cybersecurity",
      technologies: JSON.stringify(["Solidity", "Polygon ID", "Next.js", "Ethers.js", "ZKP", "Node.js"]),
      status: "FINAL_REVIEW",
    },
  });

  if (profSunita.teacherProfile) {
    await prisma.guideRequest.create({
      data: {
        projectId: project8B.id,
        teacherId: profSunita.teacherProfile.id,
        requestedById: rahul.id,
        roleType: "Lead Guide",
        status: "ACCEPTED",
      },
    });
  }

  // 8th Sem Team 3 (Submitted Evaluation)
  const team8C = await prisma.team.create({
    data: {
      teamName: "Quantum Shield",
      semester: 8,
      creatorId: sneha.id,
      members: {
        create: [
          { userId: sneha.id, role: "Team Creator", status: "ACCEPTED" },
          { userId: kiran.id, role: "Team Member", status: "ACCEPTED" },
        ],
      },
    },
  });

  const project8C = await prisma.project.create({
    data: {
      teamId: team8C.id,
      semester: 8,
      projectTitle: "Quantum-Safe Hybrid Encryption Suite for Enterprise Healthcare",
      problemStatement: "Harvest-now-decrypt-later attacks threaten long-term patient medical record privacy against future quantum computers.",
      description: "Post-quantum cryptographic library combining Kyber-1024 and AES-256-GCM for HIPAA-compliant medical record storage and transport.",
      domain: "Cybersecurity & Post-Quantum Cryptography",
      technologies: JSON.stringify(["C++20", "Python", "Kyber-1024", "OpenSSL", "Rust", "FastAPI"]),
      status: "COMPLETED",
    },
  });

  if (drAris.teacherProfile) {
    await prisma.guideRequest.create({
      data: {
        projectId: project8C.id,
        teacherId: drAris.teacherProfile.id,
        requestedById: sneha.id,
        roleType: "Lead Guide",
        status: "ACCEPTED",
      },
    });
  }

  // 8th Sem Team 4 (Submitted Evaluation with Audit Trail)
  const team8D = await prisma.team.create({
    data: {
      teamName: "GridPulse AI",
      semester: 8,
      creatorId: studentKalyani.id,
      members: {
        create: [
          { userId: studentKalyani.id, role: "Team Creator", status: "ACCEPTED" },
          { userId: priya.id, role: "Team Member", status: "ACCEPTED" },
        ],
      },
    },
  });

  const project8D = await prisma.project.create({
    data: {
      teamId: team8D.id,
      semester: 8,
      projectTitle: "Smart Micro-Grid Energy Load Forecasting using Graph Neural Networks",
      problemStatement: "Renewable energy volatility causes micro-grid instability; spatial-temporal forecasting reduces blackouts and energy loss.",
      description: "Graph Convolutional Network (GCN) coupled with LSTM to forecast neighborhood-level solar and wind power demand with 96.4% precision.",
      domain: "CleanTech & Spatial AI",
      technologies: JSON.stringify(["PyTorch Geometric", "Python", "InfluxDB", "Grafana", "Docker"]),
      status: "COMPLETED",
    },
  });

  // Create Reviewer Assignments & Evaluations for ALL REVIEWER users in the database
  const allReviewers = await prisma.user.findMany({ where: { role: "REVIEWER" } });

  for (const rev of allReviewers) {
    // 1. Pending Assignment (Drone Defect)
    const existingA = await prisma.reviewAssignment.findUnique({
      where: { reviewerId_projectId: { reviewerId: rev.id, projectId: project8A.id } },
    });
    if (!existingA) {
      await prisma.reviewAssignment.create({
        data: {
          reviewerId: rev.id,
          projectId: project8A.id,
          teamId: team8A.id,
          assignedById: coordinatorUser.id,
          reviewDeadline: deadlineIn7,
          status: "PENDING",
        },
      });
    }

    // 2. In-Progress Assignment with Draft Marks (CyberTrust)
    const existingB = await prisma.reviewAssignment.findUnique({
      where: { reviewerId_projectId: { reviewerId: rev.id, projectId: project8B.id } },
    });
    let assignB = existingB;
    if (!assignB) {
      assignB = await prisma.reviewAssignment.create({
        data: {
          reviewerId: rev.id,
          projectId: project8B.id,
          teamId: team8B.id,
          assignedById: coordinatorUser.id,
          reviewDeadline: deadlineIn4,
          status: "IN_PROGRESS",
        },
      });
    }

    const existingEvalB = await prisma.reviewerEvaluation.findUnique({
      where: { assignmentId: assignB.id },
    });
    if (!existingEvalB) {
      await prisma.reviewerEvaluation.create({
        data: {
          assignmentId: assignB.id,
          reviewerId: rev.id,
          projectId: project8B.id,
          teamId: team8B.id,
          criteriaMarks: JSON.stringify({
            projectQuality: 18,
            technicalDepth: 22,
            documentation: 17,
            presentation: 18,
            problemStatement: 14,
          }),
          totalMarks: 89,
          maxTotalMarks: 100,
          isDraft: true,
        },
      });
    }

    // 3. Submitted Assignment (Quantum Shield)
    const existingC = await prisma.reviewAssignment.findUnique({
      where: { reviewerId_projectId: { reviewerId: rev.id, projectId: project8C.id } },
    });
    let assignC = existingC;
    if (!assignC) {
      assignC = await prisma.reviewAssignment.create({
        data: {
          reviewerId: rev.id,
          projectId: project8C.id,
          teamId: team8C.id,
          assignedById: coordinatorUser.id,
          reviewDeadline: past2Days,
          status: "SUBMITTED",
        },
      });
    }

    const existingEvalC = await prisma.reviewerEvaluation.findUnique({
      where: { assignmentId: assignC.id },
    });
    if (!existingEvalC) {
      await prisma.reviewerEvaluation.create({
        data: {
          assignmentId: assignC.id,
          reviewerId: rev.id,
          projectId: project8C.id,
          teamId: team8C.id,
          criteriaMarks: JSON.stringify({
            projectQuality: 19,
            technicalDepth: 24,
            documentation: 18,
            presentation: 19,
            problemStatement: 14,
          }),
          totalMarks: 94,
          maxTotalMarks: 100,
          isDraft: false,
          submittedAt: past2Days,
        },
      });
    }

    // 4. Submitted Assignment with Audit Log (GridPulse AI)
    const existingD = await prisma.reviewAssignment.findUnique({
      where: { reviewerId_projectId: { reviewerId: rev.id, projectId: project8D.id } },
    });
    let assignD = existingD;
    if (!assignD) {
      assignD = await prisma.reviewAssignment.create({
        data: {
          reviewerId: rev.id,
          projectId: project8D.id,
          teamId: team8D.id,
          assignedById: coordinatorUser.id,
          reviewDeadline: past5Days,
          status: "SUBMITTED",
        },
      });
    }

    const existingEvalD = await prisma.reviewerEvaluation.findUnique({
      where: { assignmentId: assignD.id },
    });
    let evalD = existingEvalD;
    if (!evalD) {
      evalD = await prisma.reviewerEvaluation.create({
        data: {
          assignmentId: assignD.id,
          reviewerId: rev.id,
          projectId: project8D.id,
          teamId: team8D.id,
          criteriaMarks: JSON.stringify({
            projectQuality: 17,
            technicalDepth: 21,
            documentation: 16,
            presentation: 18,
            problemStatement: 14,
          }),
          totalMarks: 86,
          maxTotalMarks: 100,
          isDraft: false,
          submittedAt: past5Days,
        },
      });

      await prisma.evaluationAuditLog.create({
        data: {
          evaluationId: evalD.id,
          changedById: coordinatorUser.id,
          originalMarks: JSON.stringify({
            projectQuality: 17,
            technicalDepth: 21,
            documentation: 16,
            presentation: 16,
            problemStatement: 14,
          }),
          revisedMarks: JSON.stringify({
            projectQuality: 17,
            technicalDepth: 21,
            documentation: 16,
            presentation: 18,
            problemStatement: 14,
          }),
          changeReason: "Authorized +2 marks adjustment following presentation defense clarification",
        },
      });
    }

    // Reviewer Notifications
    await prisma.notification.createMany({
      data: [
        {
          userId: rev.id,
          type: "REVIEW_ASSIGNED",
          title: "New Project Assigned for Review",
          message: `You have been assigned to evaluate "${project8A.projectTitle}" by Team ${team8A.teamName}. Deadline: ${deadlineIn7.toLocaleDateString("en-IN")}.`,
          link: "/reviewer?tab=projects",
          read: false,
        },
        {
          userId: rev.id,
          type: "REVIEW_DEADLINE",
          title: "Upcoming Evaluation Deadline",
          message: `Reminder: Evaluation for "${project8B.projectTitle}" is due in 4 days (${deadlineIn4.toLocaleDateString("en-IN")}).`,
          link: "/reviewer?tab=evaluate",
          read: false,
        },
        {
          userId: rev.id,
          type: "REVIEW_SUBMITTED",
          title: "Evaluation Submitted",
          message: `Your evaluation for "${project8C.projectTitle}" (Total: 94/100) was successfully submitted to the Coordinator Portal.`,
          link: "/reviewer?tab=history",
          read: true,
        },
      ],
    });
  }

  console.log("Database successfully populated with rich seed data for Reviewer Portal & Coordinator evaluations!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
