import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const initialData = {
  // Authentication state
  currentUser: null, // null when logged out, or user object when logged in
  activeRole: 'student', // 'student' | 'mentor' | 'reviewer' | 'coordinator'
  
  // User profiles per role
  studentProfile: {
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    fullName: 'Alex Vance',
    registerNo: '21BCA042',
    registerNoLocked: true,
    email: 'alex.vance@university.edu',
    phone: '+91 98765 43210',
    department: 'Department of Computer Applications',
    programme: 'B.C.A',
    course: 'Project Work & Viva-Voce',
    semester: '6th Semester',
    academicYear: '2025 - 2026',
    teamId: null
  },

  mentorProfile: {
    fullName: 'Dr. Sarah Jenkins',
    employeeId: 'EMP-8042',
    email: 's.jenkins@university.edu',
    phone: '+91 98450 12345',
    department: 'Department of Computer Science & Engineering',
    designation: 'Professor & Head of AI Supervision Lab',
    areaOfExpertise: 'Artificial Intelligence, Deep Learning, Computer Vision, Cloud Systems'
  },

  reviewerProfile: {
    fullName: 'Prof. Robert Langford',
    employeeId: 'EMP-7109',
    department: 'Department of Information Technology',
    designation: 'Senior Reviewer & Professor',
    email: 'r.langford@university.edu'
  },

  coordinatorProfile: {
    fullName: 'Dr. Marcus Sterling',
    employeeId: 'EMP-1001',
    email: 'm.sterling@university.edu',
    department: 'Department of Computer Applications',
    designation: 'Head of Department & Project Coordinator'
  },

  // Teams list
  teams: [
    {
      id: 'TEAM-01',
      teamNumber: '01',
      name: 'Neural Vision Squad',
      projectTitle: 'Autonomous Drone Defect Detection',
      problemStatement: 'Inspecting solar panel arrays manually on large solar farms is hazardous and time-consuming.',
      objectives: '1. Build autonomous drone path planning.\n2. Thermal camera anomaly inference.\n3. Real-time operator dashboard.',
      shortDescription: 'Computer vision pipeline deployed on autonomous drones for thermal anomaly identification.',
      domain: 'Computer Vision & Autonomous Systems',
      domainReason: 'Priya and Aman have published work on Object Detection models.',
      technologies: ['Python', 'PyTorch', 'YOLOv8', 'OpenCV', 'ROS'],
      expectedOutcome: 'Drone analytics dashboard with real-time thermal anomaly bounding boxes.',
      startDate: '2026-08-01',
      expectedCompletionDate: '2026-11-30',
      status: 'In Development',
      currentStage: 'Development',
      progress: 65,
      lastReviewDate: '2026-09-30',
      nextReviewDate: '2026-10-07',
      leaderEmail: 'priya.patel@engg.college.edu',
      mentorId: 'MENTOR-01',
      mentorName: 'Dr. Aris Thorne',
      mentorEmail: 'dr.aris@engg.college.edu',
      mentorStatus: 'Accepted',
      currentSemester: '6th Semester',
      members: [
        { name: 'Priya Patel', email: 'priya.patel@engg.college.edu', regNo: '1MS21CS045', role: 'Team Leader', status: 'Accepted', attendanceRate: '100%' },
        { name: 'Aman Verma', email: 'aman.verma@engg.college.edu', regNo: '1MS21CS012', role: 'Team Member', status: 'Accepted', attendanceRate: '100%' }
      ],
      tasks: [
        { id: 'TASK-101', description: 'Train YOLOv8 model on solar panel thermal dataset', assignedStudent: 'Priya Patel', dateAssigned: '2026-09-30', deadline: '2026-10-07', status: 'In Progress', mentorRemarks: 'Target mAP@0.5 above 90%.' },
        { id: 'TASK-102', description: 'Setup ROS2 node for drone telemetry streaming', assignedStudent: 'Aman Verma', dateAssigned: '2026-09-30', deadline: '2026-10-05', status: 'In Progress', mentorRemarks: 'Ensure low latency web socket stream.' }
      ],
      documents: [
        { id: 'DOC-01', title: 'Thermal Anomaly Detection System Architecture', type: 'SRS', date: '2026-08-20', size: '2.4 MB', url: '#', reviewId: 'Review 01' }
      ],
      invitations: [],
      researchPapers: [],
      marks: { cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 5, total: 25 }, endSem: { presentation: 18, finalReport: 22, total: 40 }, totalMarks: 65, status: 'Approved' }
    },
    {
      id: 'TEAM-02',
      teamNumber: '02',
      name: 'InnovateX Team',
      projectTitle: 'Smart Academic & Project Management Hub',
      problemStatement: 'Manual management of engineering projects leads to submission delays and lack of guide visibility.',
      objectives: '1. Build automated team registration.\n2. Faculty mentor approval workflow.\n3. Digital review diary logging.',
      shortDescription: 'An integrated web portal for automated team formation, project tracking, and mentor evaluations.',
      domain: 'Web Applications & Cloud Platforms',
      domainReason: 'Full-stack engineering expertise.',
      technologies: ['Next.js', 'React', 'TypeScript', 'SQLite', 'Prisma', 'TailwindCSS'],
      expectedOutcome: 'Fully functional academic project evaluation hub.',
      startDate: '2026-08-05',
      expectedCompletionDate: '2026-11-28',
      status: 'In Development',
      currentStage: 'Development',
      progress: 70,
      lastReviewDate: '2026-09-25',
      nextReviewDate: '2026-10-08',
      leaderEmail: '24btice186@gcu.edu.in',
      mentorId: 'MENTOR-02',
      mentorName: 'Kalyani',
      mentorEmail: 'kalyanivilas990@gcu.edu.in',
      mentorStatus: 'Accepted',
      currentSemester: '6th Semester',
      members: [
        { name: 'Kalyani', email: '24btice186@gcu.edu.in', regNo: '24BTCE186', role: 'Team Leader', status: 'Accepted', attendanceRate: '100%' },
        { name: 'Priya Patel', email: 'priya.patel@engg.college.edu', regNo: '1MS21CS045', role: 'Team Member', status: 'Accepted', attendanceRate: '100%' }
      ],
      tasks: [
        { id: 'TASK-201', description: 'Implement digital diary review modal UI', assignedStudent: 'Kalyani', dateAssigned: '2026-09-25', deadline: '2026-10-04', status: 'In Progress', mentorRemarks: 'Keep clean typography.' }
      ],
      documents: [
        { id: 'DOC-02', title: 'Project Management SRS Document', type: 'SRS', date: '2026-08-25', size: '1.8 MB', url: '#', reviewId: 'Review 01' }
      ],
      invitations: [],
      researchPapers: [],
      marks: { cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 5, total: 25 }, endSem: { presentation: 19, finalReport: 23, total: 42 }, totalMarks: 67, status: 'Approved' }
    },
    {
      id: 'TEAM-03',
      teamNumber: '03',
      name: 'CodeCrafters Alpha',
      projectTitle: 'MedScan AI: Automated Radiology Triage System',
      problemStatement: 'Radiologists in district hospitals face diagnostic fatigue with over 300+ X-rays per shift.',
      objectives: '1. Deep learning chest X-ray anomaly detection.\n2. Rapid 2-sec inference.\n3. Clinical UI.',
      shortDescription: 'Deep-learning based chest radiograph analysis platform that highlights anomalies in under 2 seconds.',
      domain: 'AI / Healthcare',
      domainReason: 'Healthcare AI specialization.',
      technologies: ['Python', 'PyTorch', 'FastAPI', 'React', 'Docker'],
      expectedOutcome: 'Clinical radiology triage application.',
      startDate: '2026-08-01',
      expectedCompletionDate: '2026-11-30',
      status: 'Completed',
      currentStage: 'Final Submission',
      progress: 100,
      lastReviewDate: '2026-09-28',
      nextReviewDate: '2026-10-10',
      leaderEmail: 'aman.verma@engg.college.edu',
      mentorId: 'MENTOR-03',
      mentorName: 'Prof. Sunita Menon',
      mentorEmail: 'prof.sunita@engg.college.edu',
      mentorStatus: 'Accepted',
      currentSemester: '6th Semester',
      members: [
        { name: 'Aman Verma', email: 'aman.verma@engg.college.edu', regNo: '1MS21CS012', role: 'Team Leader', status: 'Accepted', attendanceRate: '100%' },
        { name: 'Rahul Sharma', email: 'rahul.sharma@engg.college.edu', regNo: '1MS21CS078', role: 'Team Member', status: 'Accepted', attendanceRate: '100%' }
      ],
      tasks: [],
      documents: [],
      invitations: [],
      researchPapers: [],
      marks: { cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 5, total: 25 }, endSem: { presentation: 20, finalReport: 24, total: 44 }, totalMarks: 69, status: 'Approved' }
    },
    {
      id: 'TEAM-04',
      teamNumber: '04',
      name: 'EdgeRobotics Lab',
      projectTitle: 'Smart Agriculture Edge Sensor Network',
      problemStatement: 'Small-scale farmers lack real-time soil moisture and automated drip irrigation scheduling.',
      objectives: '1. LoRaWAN wireless sensor mesh.\n2. Solar powered node controller.\n3. Soil moisture predictor.',
      shortDescription: 'LoRaWAN-based wireless sensor network with predictive solar-powered node controller.',
      domain: 'Internet of Things & Edge Computing',
      domainReason: 'Embedded systems focus.',
      technologies: ['Embedded C', 'LoRaWAN', 'MQTT', 'Python', 'Raspberry Pi'],
      expectedOutcome: 'Solar-powered agricultural sensor network prototype.',
      startDate: '2026-08-10',
      expectedCompletionDate: '2026-11-29',
      status: 'In Development',
      currentStage: 'Prototype',
      progress: 55,
      lastReviewDate: '2026-09-20',
      nextReviewDate: '2026-10-09',
      leaderEmail: 'sneha.rao@engg.college.edu',
      mentorId: 'MENTOR-04',
      mentorName: 'Dr. Rajesh Iyer',
      mentorEmail: 'dr.rajesh@engg.college.edu',
      mentorStatus: 'Accepted',
      currentSemester: '6th Semester',
      members: [
        { name: 'Sneha Rao', email: 'sneha.rao@engg.college.edu', regNo: '1MS21CS099', role: 'Team Leader', status: 'Accepted', attendanceRate: '100%' },
        { name: 'Kiran Kumar', email: 'kiran.kumar@engg.college.edu', regNo: '1MS21IS034', role: 'Team Member', status: 'Accepted', attendanceRate: '100%' }
      ],
      tasks: [],
      documents: [],
      invitations: [],
      researchPapers: [],
      marks: { cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 4, total: 24 }, endSem: { presentation: 16, finalReport: 20, total: 36 }, totalMarks: 60, status: 'Draft' }
    },
    {
      id: 'TEAM-05',
      teamNumber: '05',
      name: 'CyberVanguard',
      projectTitle: 'Zero-Trust IoT Device Authentication Protocol',
      problemStatement: 'IoT edge nodes are vulnerable to spoofing and unauthorized network access.',
      objectives: '1. Lightweight cryptographic handshake.\n2. Hardware secure element key storage.\n3. Micro-segmentation.',
      shortDescription: 'A lightweight cryptographic protocol for embedded device identity verification using hardware keys.',
      domain: 'Cybersecurity & Embedded Systems',
      domainReason: 'Cryptography & cybersecurity specialization.',
      technologies: ['C++', 'Python', 'MQTT', 'Cryptography', 'ESP32'],
      expectedOutcome: 'Zero-trust authentication gateway daemon.',
      startDate: '2026-08-12',
      expectedCompletionDate: '2026-11-30',
      status: 'In Development',
      currentStage: 'Development',
      progress: 50,
      lastReviewDate: '2026-09-24',
      nextReviewDate: '2026-10-08',
      leaderEmail: 'kiran.kumar@engg.college.edu',
      mentorId: 'MENTOR-05',
      mentorName: 'Prof. Devika Nair',
      mentorEmail: 'prof.devika@engg.college.edu',
      mentorStatus: 'Accepted',
      currentSemester: '6th Semester',
      members: [
        { name: 'Kiran Kumar', email: 'kiran.kumar@engg.college.edu', regNo: '1MS21IS034', role: 'Team Leader', status: 'Accepted', attendanceRate: '100%' },
        { name: 'Rahul Sharma', email: 'rahul.sharma@engg.college.edu', regNo: '1MS21CS078', role: 'Team Member', status: 'Accepted', attendanceRate: '100%' }
      ],
      tasks: [],
      documents: [],
      invitations: [],
      researchPapers: [],
      marks: { cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 4, total: 24 }, endSem: { presentation: 17, finalReport: 21, total: 38 }, totalMarks: 62, status: 'Draft' }
    },
    {
      id: 'TEAM-06',
      teamNumber: '06',
      name: 'DataForge Alpha',
      projectTitle: 'Federated Learning for Hospital Data Privacy',
      problemStatement: 'Hospitals cannot share patient data due to privacy regulations, limiting ML model training.',
      objectives: '1. Implement federated averaging algorithm.\n2. Differential privacy noise injection.\n3. Secure aggregation server.',
      shortDescription: 'Privacy-preserving federated learning framework for multi-hospital collaborative model training.',
      domain: 'Machine Learning & Data Privacy',
      domainReason: 'Strong ML research background and prior internship in healthcare AI.',
      technologies: ['Python', 'TensorFlow Federated', 'PySyft', 'Flask', 'PostgreSQL'],
      expectedOutcome: 'Working federated model with differential privacy guarantees.',
      startDate: '2026-08-01',
      expectedCompletionDate: '2027-01-15',
      status: 'In Development',
      currentStage: 'Development',
      progress: 55,
      lastReviewDate: '2026-09-28',
      nextReviewDate: '2026-10-15',
      leaderEmail: 'arjun.mehta@engg.college.edu',
      mentorId: 'MENTOR-01',
      mentorName: 'Dr. Aris Thorne',
      mentorEmail: 'dr.aris@engg.college.edu',
      mentorStatus: 'Accepted',
      currentSemester: '7th Semester',
      members: [
        { name: 'Arjun Mehta', email: 'arjun.mehta@engg.college.edu', regNo: '1MS20CS011', role: 'Team Leader', status: 'Accepted', attendanceRate: '95%' },
        { name: 'Divya Sharma', email: 'divya.sharma@engg.college.edu', regNo: '1MS20CS022', role: 'Team Member', status: 'Accepted', attendanceRate: '92%' }
      ],
      tasks: [
        { id: 'TASK-601', description: 'Implement FedAvg aggregation server', assignedStudent: 'Arjun Mehta', dateAssigned: '2026-09-28', deadline: '2026-10-12', status: 'In Progress', mentorRemarks: 'Ensure secure HTTPS communication.' },
      ],
      documents: [],
      invitations: [],
      researchPapers: [],
      marks: { cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 5, total: 25 }, endSem: { presentation: 0, finalReport: 0, total: 0 }, totalMarks: 25, status: 'Draft' }
    },
    {
      id: 'TEAM-07',
      teamNumber: '07',
      name: 'CloudNative Squad',
      projectTitle: 'Kubernetes-Native CI/CD Pipeline with Auto-Rollback',
      problemStatement: 'Manual deployment pipelines cause 30% downtime in production releases.',
      objectives: '1. GitOps-driven deployment pipeline.\n2. Automated canary analysis.\n3. Instant rollback on failure.',
      shortDescription: 'GitOps-based CI/CD pipeline with automated canary releases and self-healing rollback using Kubernetes.',
      domain: 'Cloud Computing & DevOps',
      domainReason: 'Team has industry experience with AWS and Kubernetes.',
      technologies: ['Kubernetes', 'ArgoCD', 'Helm', 'Prometheus', 'Go'],
      expectedOutcome: 'Production-ready DevOps pipeline reducing deployment failures by 80%.',
      startDate: '2026-08-05',
      expectedCompletionDate: '2027-01-20',
      status: 'In Development',
      currentStage: 'Prototype',
      progress: 45,
      lastReviewDate: '2026-09-25',
      nextReviewDate: '2026-10-18',
      leaderEmail: 'preethi.k@engg.college.edu',
      mentorId: 'MENTOR-03',
      mentorName: 'Prof. Sunita Menon',
      mentorEmail: 'prof.sunita@engg.college.edu',
      mentorStatus: 'Accepted',
      currentSemester: '7th Semester',
      members: [
        { name: 'Preethi K', email: 'preethi.k@engg.college.edu', regNo: '1MS20CS041', role: 'Team Leader', status: 'Accepted', attendanceRate: '98%' },
        { name: 'Rohan Shetty', email: 'rohan.shetty@engg.college.edu', regNo: '1MS20IS018', role: 'Team Member', status: 'Accepted', attendanceRate: '90%' }
      ],
      tasks: [],
      documents: [],
      invitations: [],
      researchPapers: [],
      marks: { cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 4, researchReview: 4, total: 23 }, endSem: { presentation: 0, finalReport: 0, total: 0 }, totalMarks: 23, status: 'Draft' }
    },
    {
      id: 'TEAM-08',
      teamNumber: '08',
      name: 'BlockTrust Lab',
      projectTitle: 'Blockchain-Based Academic Credential Verification',
      problemStatement: 'Fake degrees and certificate fraud are rampant in the hiring ecosystem.',
      objectives: '1. Ethereum smart contract for credential storage.\n2. QR-code certificate verification portal.\n3. IPFS-backed document pinning.',
      shortDescription: 'Decentralized credential ledger using Ethereum smart contracts and IPFS for tamper-proof degree verification.',
      domain: 'Blockchain & Distributed Systems',
      domainReason: 'Interest in Web3 with two published research papers on blockchain.',
      technologies: ['Solidity', 'Ethereum', 'IPFS', 'React', 'Hardhat'],
      expectedOutcome: 'Live testnet DApp for academic credential minting and verification.',
      startDate: '2026-08-08',
      expectedCompletionDate: '2027-01-25',
      status: 'Approved',
      currentStage: 'Research & SRS',
      progress: 30,
      lastReviewDate: '2026-09-20',
      nextReviewDate: '2026-10-20',
      leaderEmail: 'nandini.p@engg.college.edu',
      mentorId: 'MENTOR-05',
      mentorName: 'Prof. Devika Nair',
      mentorEmail: 'prof.devika@engg.college.edu',
      mentorStatus: 'Accepted',
      currentSemester: '7th Semester',
      members: [
        { name: 'Nandini P', email: 'nandini.p@engg.college.edu', regNo: '1MS20CS055', role: 'Team Leader', status: 'Accepted', attendanceRate: '100%' },
        { name: 'Aditya Rao', email: 'aditya.rao@engg.college.edu', regNo: '1MS20CS062', role: 'Team Member', status: 'Accepted', attendanceRate: '96%' }
      ],
      tasks: [],
      documents: [],
      invitations: [],
      researchPapers: [],
      marks: { cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 5, total: 25 }, endSem: { presentation: 0, finalReport: 0, total: 0 }, totalMarks: 25, status: 'Draft' }
    },
    {
      id: 'TEAM-09',
      teamNumber: '09',
      name: 'GreenTech Pioneers',
      projectTitle: 'AI-Driven Carbon Footprint Analytics Platform',
      problemStatement: 'Organizations lack real-time visibility into their Scope 1 and Scope 2 emissions.',
      objectives: '1. Real-time energy consumption ingestion.\n2. ML prediction for carbon trend.\n3. ESG compliance report generator.',
      shortDescription: 'SaaS analytics platform that ingests energy data, predicts carbon emissions, and auto-generates ESG reports.',
      domain: 'AI & Sustainability',
      domainReason: 'Domain expertise in sustainability engineering and time-series forecasting.',
      technologies: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Prophet'],
      expectedOutcome: 'Carbon analytics SaaS with BRSR-compliant report generation.',
      startDate: '2026-08-12',
      expectedCompletionDate: '2027-01-30',
      status: 'In Development',
      currentStage: 'Development',
      progress: 60,
      lastReviewDate: '2026-09-27',
      nextReviewDate: '2026-10-22',
      leaderEmail: 'vikram.s@engg.college.edu',
      mentorId: 'MENTOR-04',
      mentorName: 'Dr. Rajesh Iyer',
      mentorEmail: 'dr.rajesh@engg.college.edu',
      mentorStatus: 'Accepted',
      currentSemester: '7th Semester',
      members: [
        { name: 'Vikram S', email: 'vikram.s@engg.college.edu', regNo: '1MS20CS071', role: 'Team Leader', status: 'Accepted', attendanceRate: '97%' },
        { name: 'Meera Joshi', email: 'meera.joshi@engg.college.edu', regNo: '1MS20IS029', role: 'Team Member', status: 'Accepted', attendanceRate: '93%' }
      ],
      tasks: [],
      documents: [],
      invitations: [],
      researchPapers: [],
      marks: { cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 4, total: 24 }, endSem: { presentation: 0, finalReport: 0, total: 0 }, totalMarks: 24, status: 'Draft' }
    },
    {
      id: 'TEAM-10',
      teamNumber: '10',
      name: 'FinalSprint Alpha',
      projectTitle: 'Real-Time Sign Language Interpreter for Accessibility',
      problemStatement: 'Deaf and hard-of-hearing individuals face communication barriers in public services.',
      objectives: '1. MediaPipe hand landmark extraction.\n2. LSTM gesture sequence classifier.\n3. Web overlay UI for live captioning.',
      shortDescription: 'Real-time ASL/ISL sign language recognition using MediaPipe hand landmarks and LSTM classification.',
      domain: 'Computer Vision & Accessibility',
      domainReason: 'Published research on gesture recognition with 96% accuracy benchmark.',
      technologies: ['Python', 'MediaPipe', 'TensorFlow', 'Next.js', 'WebRTC'],
      expectedOutcome: 'Browser-based live sign language to text captioning system.',
      startDate: '2025-08-01',
      expectedCompletionDate: '2026-04-30',
      status: 'Completed',
      currentStage: 'Final Submission',
      progress: 100,
      lastReviewDate: '2026-03-28',
      nextReviewDate: null,
      leaderEmail: 'sanjana.m@engg.college.edu',
      mentorId: 'MENTOR-02',
      mentorName: 'Kalyani',
      mentorEmail: 'kalyanivilas990@gcu.edu.in',
      mentorStatus: 'Accepted',
      currentSemester: '8th Semester',
      members: [
        { name: 'Sanjana M', email: 'sanjana.m@engg.college.edu', regNo: '1MS19CS080', role: 'Team Leader', status: 'Accepted', attendanceRate: '100%' },
        { name: 'Harish T', email: 'harish.t@engg.college.edu', regNo: '1MS19CS045', role: 'Team Member', status: 'Accepted', attendanceRate: '100%' }
      ],
      tasks: [],
      documents: [
        { id: 'DOC-10A', title: 'Final Thesis Report — Sign Language Interpreter', type: 'Thesis', date: '2026-04-01', size: '5.2 MB', url: '#', reviewId: 'Final Review' }
      ],
      invitations: [],
      researchPapers: [],
      marks: { cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 5, total: 25 }, endSem: { presentation: 22, finalReport: 28, total: 50 }, totalMarks: 75, status: 'Finalized' }
    },
    {
      id: 'TEAM-11',
      teamNumber: '11',
      name: 'NLPioneer Group',
      projectTitle: 'Multilingual Legal Document Summarizer',
      problemStatement: 'Legal documents are inaccessible to common citizens due to complexity and language barriers.',
      objectives: '1. Fine-tune mBART for Kannada/Hindi legal text.\n2. Abstractive summary pipeline.\n3. Web interface with PDF ingestion.',
      shortDescription: 'Transformer-based multilingual legal document summarizer supporting Kannada, Hindi, and English.',
      domain: 'Natural Language Processing',
      domainReason: 'NLP research internship at IISc and 2 conference papers on multilingual models.',
      technologies: ['Python', 'HuggingFace', 'mBART', 'FastAPI', 'React'],
      expectedOutcome: 'Legal-NLP SaaS with 80%+ ROUGE-L score on benchmark dataset.',
      startDate: '2025-08-05',
      expectedCompletionDate: '2026-04-28',
      status: 'In Development',
      currentStage: 'Development',
      progress: 80,
      lastReviewDate: '2026-03-20',
      nextReviewDate: '2026-04-10',
      leaderEmail: 'deepak.n@engg.college.edu',
      mentorId: 'MENTOR-01',
      mentorName: 'Dr. Aris Thorne',
      mentorEmail: 'dr.aris@engg.college.edu',
      mentorStatus: 'Accepted',
      currentSemester: '8th Semester',
      members: [
        { name: 'Deepak N', email: 'deepak.n@engg.college.edu', regNo: '1MS19CS019', role: 'Team Leader', status: 'Accepted', attendanceRate: '99%' },
        { name: 'Keerthi G', email: 'keerthi.g@engg.college.edu', regNo: '1MS19CS031', role: 'Team Member', status: 'Accepted', attendanceRate: '97%' }
      ],
      tasks: [
        { id: 'TASK-111', description: 'Fine-tune mBART on IndicNLP legal corpus', assignedStudent: 'Deepak N', dateAssigned: '2026-03-20', deadline: '2026-04-05', status: 'In Progress', mentorRemarks: 'Aim for ROUGE-L above 0.78.' }
      ],
      documents: [
        { id: 'DOC-11A', title: 'Thesis Draft v2 — Legal NLP Summarizer', type: 'Thesis Draft', date: '2026-03-15', size: '3.8 MB', url: '#', reviewId: 'Review 03' }
      ],
      invitations: [],
      researchPapers: [],
      marks: { cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 5, total: 25 }, endSem: { presentation: 19, finalReport: 24, total: 43 }, totalMarks: 68, status: 'Verified' }
    },
    {
      id: 'TEAM-12',
      teamNumber: '12',
      name: 'QuantumEdge Research',
      projectTitle: 'Quantum Circuit Simulation on Classical Hardware',
      problemStatement: 'Quantum computing education lacks accessible simulation environments for students.',
      objectives: '1. Implement Qiskit-based circuit simulator.\n2. Interactive gate-level debugger.\n3. Visual Bloch sphere rendering.',
      shortDescription: 'Educational quantum circuit simulator with visual Bloch sphere rendering and gate-level debugging.',
      domain: 'Quantum Computing',
      domainReason: 'Team attended IBM Quantum Summer School and has published on variational circuits.',
      technologies: ['Python', 'Qiskit', 'NumPy', 'Three.js', 'React'],
      expectedOutcome: 'Web-based quantum circuit IDE usable by undergraduates.',
      startDate: '2025-08-10',
      expectedCompletionDate: '2026-04-25',
      status: 'In Development',
      currentStage: 'Final Submission',
      progress: 90,
      lastReviewDate: '2026-04-01',
      nextReviewDate: '2026-04-15',
      leaderEmail: 'ananya.v@engg.college.edu',
      mentorId: 'MENTOR-03',
      mentorName: 'Prof. Sunita Menon',
      mentorEmail: 'prof.sunita@engg.college.edu',
      mentorStatus: 'Accepted',
      currentSemester: '8th Semester',
      members: [
        { name: 'Ananya V', email: 'ananya.v@engg.college.edu', regNo: '1MS19CS003', role: 'Team Leader', status: 'Accepted', attendanceRate: '100%' },
        { name: 'Suresh B', email: 'suresh.b@engg.college.edu', regNo: '1MS19IS014', role: 'Team Member', status: 'Accepted', attendanceRate: '98%' }
      ],
      tasks: [],
      documents: [
        { id: 'DOC-12A', title: 'Final Thesis — Quantum Circuit Simulator', type: 'Thesis', date: '2026-04-02', size: '6.1 MB', url: '#', reviewId: 'Final Review' }
      ],
      invitations: [],
      researchPapers: [],
      marks: { cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 5, total: 25 }, endSem: { presentation: 21, finalReport: 26, total: 47 }, totalMarks: 72, status: 'Verified' }
    }
  ],

  // Mentors list
  mentors: [
    { id: 'MENTOR-01', name: 'Dr. Aris Thorne', email: 'dr.aris@engg.college.edu', department: 'Computer Science & Engineering', designation: 'Professor & Head of AI Lab', maxTeams: 5, assignedTeamsCount: 1, expertise: ['Artificial Intelligence', 'Deep Learning', 'Computer Vision', 'Neural Networks'] },
    { id: 'MENTOR-02', name: 'Kalyani', email: 'kalyanivilas990@gcu.edu.in', department: 'Computer Science & Engineering', designation: 'Assistant Professor', maxTeams: 5, assignedTeamsCount: 1, expertise: ['Project Mentorship', 'Software Engineering', 'Web Technologies', 'Database Systems'] },
    { id: 'MENTOR-03', name: 'Prof. Sunita Menon', email: 'prof.sunita@engg.college.edu', department: 'Computer Science & Engineering', designation: 'Associate Professor', maxTeams: 5, assignedTeamsCount: 1, expertise: ['Full Stack Web Systems', 'Cloud Computing', 'Distributed Systems', 'Microservices'] },
    { id: 'MENTOR-04', name: 'Dr. Rajesh Iyer', email: 'dr.rajesh@engg.college.edu', department: 'Information Science & Engineering', designation: 'Professor', maxTeams: 5, assignedTeamsCount: 1, expertise: ['Internet of Things (IoT)', 'Embedded Systems', 'Edge Computing', 'Smart Sensors'] },
    { id: 'MENTOR-05', name: 'Prof. Devika Nair', email: 'prof.devika@engg.college.edu', department: 'Cybersecurity & Systems', designation: 'Assistant Professor', maxTeams: 5, assignedTeamsCount: 1, expertise: ['Network Security', 'Blockchain', 'Cryptography', 'Ethical Hacking'] }
  ],

  // Reviewers list
  reviewers: [
    { id: 'REV-01', name: 'Prof. Robert Langford', department: 'Information Technology', assignedTeams: ['TEAM-01', 'TEAM-02'] },
    { id: 'REV-02', name: 'Dr. Emily Watson', department: 'Software Engineering', assignedTeams: ['TEAM-03'] }
  ],

  // Private Project Diary entries
  projectDiary: [
    {
      id: 'DIARY-04',
      teamId: 'TEAM-01',
      teamName: 'CodeCrafters Alpha',
      reviewNumber: 'Review 04',
      date: '2026-09-30',
      studentsPresent: ['Alex Vance', 'David Miller', 'Elena Rostova', 'Siddharth Rao'],
      attendanceMap: {
        'Alex Vance': 'Present',
        'David Miller': 'Present',
        'Elena Rostova': 'Present',
        'Siddharth Rao': 'Present'
      },
      workCompleted: 'Students completed the login system and connected the project PostgreSQL database.',
      workDemonstrated: 'Students demonstrated registration, JWT login, and role-based authentication.',
      progressPercent: 65,
      stage: 'Development',
      problemsFaced: 'Students are facing issues with API response handling and exception catching during model inference.',
      mentorObservations: 'The authentication module is working properly, but API error handling needs immediate improvement.',
      mentorFeedback: 'Complete the main doctor triage dashboard and improve API error handling before the next review.',
      improvementsSuggested: 'Implement standardized JSON error responses and retry logic for DICOM file processing.',
      tasksGivenList: [
        { task: 'Complete dashboard', student: 'Alex Vance', deadline: '2026-10-07' },
        { task: 'Fix API issues', student: 'David Miller', deadline: '2026-10-05' },
        { task: 'Add validation', student: 'Elena Rostova', deadline: '2026-10-06' },
        { task: 'Update GitHub repository', student: 'Siddharth Rao', deadline: '2026-10-07' }
      ],
      nextReviewDate: '2026-10-07',
      remarks: 'Team is showing steady progress and maintaining clean code structure.',
      mentorName: 'Dr. Sarah Jenkins'
    },
    {
      id: 'DIARY-03',
      teamId: 'TEAM-01',
      teamName: 'CodeCrafters Alpha',
      reviewNumber: 'Review 03',
      date: '2026-09-15',
      studentsPresent: ['Alex Vance', 'David Miller', 'Siddharth Rao'],
      attendanceMap: {
        'Alex Vance': 'Present',
        'David Miller': 'Present',
        'Elena Rostova': 'Absent',
        'Siddharth Rao': 'Present'
      },
      workCompleted: 'PyTorch deep learning model trained on CheXNet dataset with 94.2% sensitivity.',
      workDemonstrated: 'Demonstrated model inference on 20 sample test X-ray DICOM images.',
      progressPercent: 45,
      stage: 'Development',
      problemsFaced: 'Training time was high due to GPU memory constraints.',
      mentorObservations: 'Model accuracy is satisfactory. Focus now shifts to full-stack integration.',
      mentorFeedback: 'Prepare API endpoints for backend integration.',
      improvementsSuggested: 'Quantize PyTorch model weights to reduce RAM memory footprint.',
      tasksGivenList: [
        { task: 'Setup FastAPI REST endpoints', student: 'David Miller', deadline: '2026-09-22' },
        { task: 'Create database schema', student: 'Alex Vance', deadline: '2026-09-22' }
      ],
      nextReviewDate: '2026-09-30',
      remarks: 'Elena Rostova was absent with prior leave permission.',
      mentorName: 'Dr. Sarah Jenkins'
    },
    {
      id: 'DIARY-02',
      teamId: 'TEAM-01',
      teamName: 'CodeCrafters Alpha',
      reviewNumber: 'Review 02',
      date: '2026-08-25',
      studentsPresent: ['Alex Vance', 'David Miller', 'Elena Rostova', 'Siddharth Rao'],
      attendanceMap: {
        'Alex Vance': 'Present',
        'David Miller': 'Present',
        'Elena Rostova': 'Present',
        'Siddharth Rao': 'Present'
      },
      workCompleted: 'Completed literature survey of 8 research papers and finalized SRS document.',
      workDemonstrated: 'Presented system architecture diagram and database ER diagram.',
      progressPercent: 25,
      stage: 'Research & SRS',
      problemsFaced: 'Selecting appropriate cloud storage for heavy DICOM files.',
      mentorObservations: 'Comprehensive literature survey. Architecture diagram is well structured.',
      mentorFeedback: 'Approved SRS and system architecture. Proceed to dataset preparation.',
      improvementsSuggested: 'Consider using MinIO local object storage for DICOM files.',
      tasksGivenList: [
        { task: 'Download CheXNet dataset', student: 'Elena Rostova', deadline: '2026-09-01' }
      ],
      nextReviewDate: '2026-09-15',
      remarks: 'SRS approved officially.',
      mentorName: 'Dr. Sarah Jenkins'
    },
    {
      id: 'DIARY-01',
      teamId: 'TEAM-01',
      teamName: 'CodeCrafters Alpha',
      reviewNumber: 'Review 01',
      date: '2026-08-10',
      studentsPresent: ['Alex Vance', 'David Miller', 'Elena Rostova', 'Siddharth Rao'],
      attendanceMap: {
        'Alex Vance': 'Present',
        'David Miller': 'Present',
        'Elena Rostova': 'Present',
        'Siddharth Rao': 'Present'
      },
      workCompleted: 'Team formation and project domain finalization.',
      workDemonstrated: 'Project proposal presentation deck.',
      progressPercent: 10,
      stage: 'Project Selection',
      problemsFaced: 'Narrowing down domain scope to pulmonary radiology.',
      mentorObservations: 'Good initiative and high domain enthusiasm.',
      mentorFeedback: 'Proposal accepted. Begin literature review immediately.',
      improvementsSuggested: 'Refine problem statement to highlight triage speed metrics.',
      tasksGivenList: [
        { task: 'Submit literature review draft', student: 'Alex Vance', deadline: '2026-08-20' }
      ],
      nextReviewDate: '2026-08-25',
      remarks: 'Project topic officially approved by mentor.',
      mentorName: 'Dr. Sarah Jenkins'
    }
  ],

  // Review Evaluation Rubric Parameters
  rubricParameters: [
    { key: 'problemUnderstanding', label: 'Problem Understanding & Scope', maxMarks: 10 },
    { key: 'literatureReview', label: 'Literature Review & Paper Survey', maxMarks: 10 },
    { key: 'technicalKnowledge', label: 'Technical Knowledge & Design', maxMarks: 10 },
    { key: 'progress', label: 'Progress & Execution Consistency', maxMarks: 10 },
    { key: 'presentation', label: 'Presentation & Q/A Performance', maxMarks: 10 }
  ],

  // Evaluation Marks recorded by Reviewers
  evaluations: [
    { id: 'EVAL-01', teamId: 'TEAM-01', teamName: 'Neural Vision Squad', reviewerName: 'Prof. Robert Langford', reviewNumber: 'CIA Review 1', date: '2026-09-30', marks: { problemUnderstanding: 9, literatureReview: 8, technicalKnowledge: 9, progress: 8, presentation: 9 }, totalMarks: 43, status: 'Verified' },
    { id: 'EVAL-02', teamId: 'TEAM-03', teamName: 'CodeCrafters Alpha', reviewerName: 'Dr. Emily Watson', reviewNumber: 'CIA Review 1', date: '2026-09-28', marks: { problemUnderstanding: 10, literatureReview: 9, technicalKnowledge: 10, progress: 9, presentation: 10 }, totalMarks: 48, status: 'Finalized' },
    { id: 'EVAL-03', teamId: 'TEAM-06', teamName: 'DataForge Alpha', reviewerName: 'Prof. Robert Langford', reviewNumber: 'CIA Review 1', date: '2026-09-27', marks: { problemUnderstanding: 8, literatureReview: 8, technicalKnowledge: 7, progress: 7, presentation: 8 }, totalMarks: 38, status: 'Draft' }
  ],

  // Scheduled Reviews
  reviews: [
    { id: 'REV-SCH-01', title: 'CIA Review 2 — 6th Semester', date: '2026-10-20', time: '10:00 AM', venue: 'Seminar Hall 2', semester: '6th Semester', teams: ['TEAM-01', 'TEAM-02', 'TEAM-03'], reviewer: 'Prof. Robert Langford', status: 'Upcoming' },
    { id: 'REV-SCH-02', title: 'Progress Demo — 7th Semester', date: '2026-10-25', time: '02:00 PM', venue: 'Lab Block A — Room 301', semester: '7th Semester', teams: ['TEAM-06', 'TEAM-07', 'TEAM-09'], reviewer: 'Dr. Emily Watson', status: 'Upcoming' },
    { id: 'REV-SCH-03', title: 'Final Viva — 8th Semester', date: '2026-11-05', time: '09:00 AM', venue: 'Conference Hall', semester: '8th Semester', teams: ['TEAM-10', 'TEAM-11', 'TEAM-12'], reviewer: 'Prof. Robert Langford', status: 'Upcoming' }
  ],

  // Coordinator Notice Board
  notices: [
    { id: 'NOTE-01', title: '📢 6th Semester Research Paper & Topic Finalization Deadline', date: '2025-09-08', author: 'Dr. Marcus Sterling (Coordinator)', priority: 'high', content: 'All 6th Semester teams must complete domain selection, problem statement, and 5 research paper entries by September 25th, 2025.' },
    { id: 'NOTE-02', title: '📅 CIA Presentation & Evaluation Schedule Released', date: '2025-09-05', author: 'Dr. Marcus Sterling (Coordinator)', priority: 'normal', content: 'The 6th Semester CIA Review will be held on October 20th, 2025 in Seminar Hall 2. Check your review schedule tab for venue details.' },
    { id: 'NOTE-03', title: '📄 Official E-Report & PPT Templates Uploaded', date: '2025-09-01', author: 'Dr. Marcus Sterling (Coordinator)', priority: 'normal', content: 'Official project report layout templates and presentation slides have been updated in the Resources & Templates section.' }
  ],

  // System Notifications
  notifications: [],

  // Official Templates
  templates: [
    { id: 'T-01', name: 'Official 6th Sem Structured E-Report Format', type: 'PDF / Document Guide', size: '1.2 MB', updated: 'Sep 01, 2025', url: '#' },
    { id: 'T-02', name: 'Official Mid-Semester Presentation Deck (.pptx)', type: 'PowerPoint Template', size: '3.4 MB', updated: 'Sep 01, 2025', url: '#' }
  ]
};

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Clear old legacy cache keys that caused persistent stale display
    localStorage.removeItem('nexus_academic_data_save');
    localStorage.removeItem('nexus_academic_data_v3');
    const saved = localStorage.getItem('nexus_academic_data_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData({
          ...initialData,
          ...parsed,
          teams: initialData.teams,
          mentors: initialData.mentors
        });
      } catch (e) {
        setData(initialData);
      }
    } else {
      setData(initialData);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('nexus_academic_data_v4', JSON.stringify(data));
    }
  }, [data, isLoaded]);

  // Authentication Actions
  const login = (role, email, password) => {
    let profile = null;
    if (role === 'student') profile = { ...data.studentProfile, email: email || data.studentProfile.email };
    else if (role === 'mentor') profile = { ...data.mentorProfile, email: email || data.mentorProfile.email };
    else if (role === 'reviewer') profile = { ...data.reviewerProfile, email: email || data.reviewerProfile.email };
    else if (role === 'coordinator') profile = { ...data.coordinatorProfile, email: email || data.coordinatorProfile.email };

    setData(prev => ({
      ...prev,
      currentUser: { ...profile, role },
      activeRole: role,
      notifications: [
        { id: `N-${Date.now()}`, text: `🔒 Logged in successfully as ${profile?.fullName || role}`, time: 'Just now', read: false, role },
        ...prev.notifications
      ]
    }));
  };

  const demoLogin = (role) => {
    login(role, null, null);
  };

  const logout = () => {
    setData(prev => ({
      ...prev,
      currentUser: null
    }));
  };

  const setRole = (role) => {
    setData(prev => ({
      ...prev,
      activeRole: role,
      currentUser: prev.currentUser ? { ...prev.currentUser, role } : null
    }));
  };

  // Student Actions
  const updateStudentProfile = (updatedFields) => {
    setData(prev => ({
      ...prev,
      studentProfile: { ...prev.studentProfile, ...updatedFields }
    }));
  };

  const createTeam = (teamName) => {
    const newTeamId = `TEAM-${String(data.teams.length + 1).padStart(2, '0')}`;
    const newTeam = {
      id: newTeamId,
      name: teamName,
      leaderEmail: data.studentProfile.email,
      status: 'Pending Approval',
      mentorId: null,
      mentorName: null,
      mentorStatus: 'Pending',
      domain: '',
      domainReason: '',
      projectTitle: '',
      problemStatement: '',
      shortDescription: '',
      currentSemester: '6th Semester',
      members: [
        { name: data.studentProfile.fullName, email: data.studentProfile.email, regNo: data.studentProfile.registerNo, role: 'Team Leader', status: 'Accepted' }
      ],
      invitations: [],
      researchPapers: [],
      marks: {
        cia: { teamFormation: 5, mentorSelection: 0, domainSelection: 0, problemIdentification: 0, researchReview: 0, total: 5 },
        endSem: { presentation: 0, finalReport: 0, total: 0 },
        totalMarks: 5,
        status: 'Draft'
      }
    };

    setData(prev => ({
      ...prev,
      teams: [...prev.teams, newTeam],
      studentProfile: { ...prev.studentProfile, teamId: newTeamId },
      notifications: [
        { id: `N-${Date.now()}`, text: `🎉 Team "${teamName}" created successfully!`, time: 'Just now', read: false, role: 'student' },
        ...prev.notifications
      ]
    }));
  };

  const sendInvitation = (teamId, email) => {
    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => {
        if (t.id === teamId) {
          const existingInvites = t.invitations || [];
          if (existingInvites.some(inv => inv.email === email)) return t;
          return { ...t, invitations: [...existingInvites, { email, status: 'Pending' }] };
        }
        return t;
      }),
      notifications: [
        { id: `N-${Date.now()}`, text: `📩 Invitation sent to ${email}.`, time: 'Just now', read: false, role: 'student' },
        ...prev.notifications
      ]
    }));
  };

  const respondToInvitation = (teamId, email, response) => {
    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => {
        if (t.id === teamId) {
          const updatedInvites = t.invitations.filter(i => i.email !== email);
          let updatedMembers = [...t.members];
          if (response === 'Accepted') {
            updatedMembers.push({
              name: email.split('@')[0].replace('.', ' ').toUpperCase(),
              email,
              regNo: `21BCA${Math.floor(100 + Math.random() * 800)}`,
              role: 'Member',
              status: 'Accepted'
            });
          }
          return { ...t, invitations: updatedInvites, members: updatedMembers };
        }
        return t;
      }),
      notifications: [
        { id: `N-${Date.now()}`, text: `🤝 ${email} has ${response.toLowerCase()} team invitation.`, time: 'Just now', read: false, role: 'student' },
        ...prev.notifications
      ]
    }));
  };

  const selectMentor = (teamId, mentorId) => {
    const selectedMentorObj = data.mentors.find(m => m.id === mentorId);
    if (!selectedMentorObj) return;

    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === teamId ? { ...t, mentorId: selectedMentorObj.id, mentorName: selectedMentorObj.name, mentorStatus: 'Pending' } : t),
      notifications: [
        { id: `N-${Date.now()}`, text: `📤 Mentor request sent to ${selectedMentorObj.name}.`, time: 'Just now', read: false, role: 'student' },
        ...prev.notifications
      ]
    }));
  };

  const setDomainAndTopic = (teamId, domain, domainReason, projectTitle, problemStatement, shortDescription) => {
    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === teamId ? {
        ...t, domain, domainReason, projectTitle, problemStatement, shortDescription,
        marks: { ...t.marks, cia: { ...t.marks.cia, domainSelection: 5, problemIdentification: 5 } }
      } : t),
      notifications: [
        { id: `N-${Date.now()}`, text: `💾 Domain & Topic configuration securely saved!`, time: 'Just now', read: false, role: 'student' },
        ...prev.notifications
      ]
    }));
  };

  const addResearchPaper = (teamId, paper) => {
    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => {
        if (t.id === teamId) {
          const newPapers = [...t.researchPapers, { id: t.researchPapers.length + 1, ...paper }];
          const ciaReviewScore = newPapers.length >= 5 ? 5 : Math.floor((newPapers.length / 5) * 5);
          return {
            ...t,
            researchPapers: newPapers,
            marks: { ...t.marks, cia: { ...t.marks.cia, researchReview: ciaReviewScore } }
          };
        }
        return t;
      })
    }));
  };

  // Mentor Actions
  const respondToMentorRequest = (teamId, accept) => {
    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === teamId ? {
        ...t,
        mentorStatus: accept ? 'Accepted' : 'Rejected',
        status: accept ? 'Approved' : t.status,
        marks: { ...t.marks, cia: { ...t.marks.cia, mentorSelection: accept ? 5 : 0 } }
      } : t),
      notifications: [
        { id: `N-${Date.now()}`, text: `🔔 Mentor request ${accept ? 'ACCEPTED' : 'REJECTED'}.`, time: 'Just now', read: false, role: 'student' },
        ...prev.notifications
      ]
    }));
  };

  const addProjectDiaryEntry = (entry) => {
    const newEntry = {
      id: `DIARY-${Date.now()}`,
      mentorName: data.mentorProfile.fullName,
      ...entry
    };
    setData(prev => ({
      ...prev,
      projectDiary: [newEntry, ...prev.projectDiary],
      notifications: [
        { id: `N-${Date.now()}`, text: `📖 Guidance entry added for ${entry.teamName}.`, time: 'Just now', read: false, role: 'mentor' },
        ...prev.notifications
      ]
    }));
  };

  const updateProjectProgress = (teamId, currentStage, progress) => {
    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === teamId ? { ...t, currentStage, progress: Number(progress) } : t),
      notifications: [
        { id: `N-${Date.now()}`, text: `📈 Progress updated for Team ${teamId}: ${currentStage} (${progress}%)`, time: 'Just now', read: false, role: 'mentor' },
        ...prev.notifications
      ]
    }));
  };

  const addComprehensiveReviewDiaryEntry = (entryData) => {
    const reviewId = `DIARY-${Date.now()}`;
    const newEntry = {
      id: reviewId,
      mentorName: data.mentorProfile.fullName,
      ...entryData
    };

    setData(prev => {
      // Find team
      const targetTeam = prev.teams.find(t => t.id === entryData.teamId);
      if (!targetTeam) return prev;

      // Extract tasks if any
      const newTasks = (entryData.tasksGivenList || []).map((t, idx) => ({
        id: `TASK-${Date.now()}-${idx}`,
        description: t.task,
        assignedStudent: t.student || 'All Members',
        dateAssigned: entryData.date,
        deadline: t.deadline || entryData.nextReviewDate,
        status: 'Pending',
        mentorRemarks: `Assigned during ${entryData.reviewNumber}`
      }));

      const updatedTeams = prev.teams.map(t => {
        if (t.id === entryData.teamId) {
          return {
            ...t,
            progress: Number(entryData.progressPercent) || t.progress,
            currentStage: entryData.stage || t.currentStage,
            lastReviewDate: entryData.date,
            nextReviewDate: entryData.nextReviewDate || t.nextReviewDate,
            tasks: [...(t.tasks || []), ...newTasks]
          };
        }
        return t;
      });

      return {
        ...prev,
        projectDiary: [newEntry, ...prev.projectDiary],
        teams: updatedTeams,
        notifications: [
          { id: `N-${Date.now()}`, text: `📖 ${entryData.reviewNumber} recorded for ${targetTeam.name}!`, time: 'Just now', read: false, role: 'mentor' },
          ...prev.notifications
        ]
      };
    });
  };

  const addMentorTaskToTeam = (teamId, taskObj) => {
    const newTask = {
      id: `TASK-${Date.now()}`,
      status: 'Pending',
      dateAssigned: new Date().toISOString().split('T')[0],
      ...taskObj
    };
    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === teamId ? { ...t, tasks: [...(t.tasks || []), newTask] } : t),
      notifications: [
        { id: `N-${Date.now()}`, text: `📌 New task assigned to ${taskObj.assignedStudent}: "${taskObj.description}"`, time: 'Just now', read: false, role: 'mentor' },
        ...prev.notifications
      ]
    }));
  };

  const updateMentorTaskStatus = (teamId, taskId, status, mentorRemarks) => {
    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => {
        if (t.id === teamId) {
          return {
            ...t,
            tasks: (t.tasks || []).map(tk => tk.id === taskId ? { ...tk, status, mentorRemarks: mentorRemarks !== undefined ? mentorRemarks : tk.mentorRemarks } : tk)
          };
        }
        return t;
      })
    }));
  };

  const uploadTeamProjectDocument = (teamId, docObj) => {
    const newDoc = {
      id: `DOC-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      url: '#',
      ...docObj
    };
    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === teamId ? { ...t, documents: [...(t.documents || []), newDoc] } : t)
    }));
  };

  const updateMentorProfile = (updatedFields) => {
    setData(prev => ({
      ...prev,
      mentorProfile: { ...prev.mentorProfile, ...updatedFields }
    }));
  };

  // Reviewer Actions
  const submitReviewerMarks = (teamId, reviewName, scores, comments) => {
    const totalScore = Object.values(scores).reduce((a, b) => Number(a) + Number(b), 0);
    const newEval = {
      id: `EVAL-${Date.now()}`,
      teamId,
      reviewerName: data.reviewerProfile.fullName,
      reviewName,
      reviewDate: new Date().toISOString().split('T')[0],
      scores,
      totalScore,
      comments
    };

    setData(prev => ({
      ...prev,
      evaluations: [newEval, ...prev.evaluations],
      teams: prev.teams.map(t => t.id === teamId ? {
        ...t,
        marks: {
          ...t.marks,
          endSem: {
            presentation: scores.presentation || 9,
            finalReport: Math.min(15, (scores.problemUnderstanding || 8) + (scores.progress || 7)),
            total: Math.min(25, Math.floor(totalScore / 2))
          },
          totalMarks: (t.marks.cia?.total || 25) + Math.min(25, Math.floor(totalScore / 2))
        }
      } : t),
      notifications: [
        { id: `N-${Date.now()}`, text: `📝 Evaluation submitted for Team ${teamId}.`, time: 'Just now', read: false, role: 'reviewer' },
        ...prev.notifications
      ]
    }));
  };

  // Coordinator Actions
  const toggleRegisterLock = () => {
    setData(prev => ({
      ...prev,
      studentProfile: { ...prev.studentProfile, registerNoLocked: !prev.studentProfile.registerNoLocked }
    }));
  };

  const approveTeamStatus = (teamId, status) => {
    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === teamId ? { ...t, status } : t)
    }));
  };

  const assignMentorToTeam = (teamId, mentorId) => {
    const mentorObj = data.mentors.find(m => m.id === mentorId);
    if (!mentorObj) return;

    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === teamId ? { ...t, mentorId, mentorName: mentorObj.name, mentorStatus: 'Accepted' } : t)
    }));
  };

  const scheduleReview = (reviewData) => {
    const newReview = { id: `REV-EVENT-${Date.now()}`, ...reviewData };
    setData(prev => ({
      ...prev,
      reviews: [newReview, ...prev.reviews],
      notifications: [
        { id: `N-${Date.now()}`, text: `📢 New Review scheduled: ${reviewData.reviewName}`, time: 'Just now', read: false, role: 'student' },
        ...prev.notifications
      ]
    }));
  };

  const updateMarksStatus = (teamId, status) => {
    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === teamId ? { ...t, marks: { ...t.marks, status } } : t)
    }));
  };

  const publishNotice = (noticeObj) => {
    const newNotice = {
      id: `NOTE-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: `${data.coordinatorProfile.fullName} (Coordinator)`,
      ...noticeObj
    };
    setData(prev => ({
      ...prev,
      notices: [newNotice, ...prev.notices]
    }));
  };

  const markNotificationRead = (id) => {
    setData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  };

  const clearAllNotifications = () => {
    setData(prev => ({ ...prev, notifications: [] }));
  };

  return (
    <AppContext.Provider value={{
      data,
      login,
      demoLogin,
      logout,
      setRole,
      updateStudentProfile,
      createTeam,
      sendInvitation,
      respondToInvitation,
      selectMentor,
      setDomainAndTopic,
      addResearchPaper,
      respondToMentorRequest,
      addProjectDiaryEntry,
      updateProjectProgress,
      addComprehensiveReviewDiaryEntry,
      addMentorTaskToTeam,
      updateMentorTaskStatus,
      uploadTeamProjectDocument,
      updateMentorProfile,
      submitReviewerMarks,
      toggleRegisterLock,
      approveTeamStatus,
      assignMentorToTeam,
      scheduleReview,
      updateMarksStatus,
      publishNotice,
      markNotificationRead,
      clearAllNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
