"use client";

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
      marks: {
        cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 5, total: 25 },
        endSem: { presentation: 18, finalReport: 22, total: 40 },
        totalMarks: 65,
        status: 'Approved'
      }
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
      marks: {
        cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 4, total: 24 },
        endSem: { presentation: 15, finalReport: 20, total: 35 },
        totalMarks: 59,
        status: 'Draft'
      }
    },
    {
      id: 'TEAM-03',
      teamNumber: '03',
      name: 'NeuroPulse Systems',
      projectTitle: 'Real-Time EEG Signal Processing & Cognitive State Detection',
      problemStatement: 'Non-invasive BCI hardware generates high artifact noise, preventing robust real-time classification of user focus and fatigue states.',
      objectives: '1. Build lightweight EEG denoising filter using Wavelet Transforms.\n2. Train real-time 1D-CNN classifier for 4 distinct cognitive states.\n3. Implement low-latency BLE streaming gateway for clinical researchers.',
      shortDescription: 'Brain-Computer Interface platform capable of filtering raw EEG noise and classifying cognitive fatigue with 91.8% accuracy.',
      domain: 'AI / Biomedical',
      domainReason: 'Specialized focus in signal processing and embedded bio-sensors.',
      technologies: ['Python', 'TensorFlow', 'C++', 'FastAPI', 'React', 'WebSockets'],
      expectedOutcome: 'Working prototype desktop and web interface displaying live brainwave heatmaps and cognitive focus metrics.',
      startDate: '2026-08-01',
      expectedCompletionDate: '2026-11-25',
      status: 'In Development',
      currentStage: 'Development',
      progress: 58,
      lastReviewDate: '2026-09-28',
      nextReviewDate: '2026-10-08',
      leaderEmail: 'ananya.sharma@university.edu',
      mentorId: 'MENTOR-01',
      mentorName: 'Dr. Sarah Jenkins',
      mentorStatus: 'Accepted',
      currentSemester: '7th Semester',
      members: [
        { name: 'Ananya Sharma', email: 'ananya.sharma@university.edu', regNo: '20BCA012', role: 'Team Leader', status: 'Accepted', attendanceRate: '100%' },
        { name: 'Rahul Verma', email: 'rahul.v@university.edu', regNo: '20BCA045', role: 'Hardware & ML Engineer', status: 'Accepted', attendanceRate: '95%' },
        { name: 'Sneha Patel', email: 'sneha.p@university.edu', regNo: '20BCA063', role: 'Frontend & Visualizer', status: 'Accepted', attendanceRate: '100%' },
        { name: 'Arjun Nair', email: 'arjun.n@university.edu', regNo: '20BCA088', role: 'Firmware Specialist', status: 'Accepted', attendanceRate: '90%' }
      ],
      tasks: [
        { id: 'TASK-301', description: 'Optimize FFT bandpass filter for 50Hz mains hum reduction', assignedStudent: 'Rahul Verma', dateAssigned: '2026-09-28', deadline: '2026-10-06', status: 'In Progress', mentorRemarks: 'Test with synthetic noise samples.' },
        { id: 'TASK-302', description: 'Design 3D electrode montage display component', assignedStudent: 'Sneha Patel', dateAssigned: '2026-09-28', deadline: '2026-10-07', status: 'Completed', mentorRemarks: 'Looks very intuitive.' }
      ],
      documents: [
        { id: 'DOC-05', title: 'Phase II System Architecture & Model Pipeline', type: 'Architecture Document', date: '2026-09-10', size: '3.6 MB', url: '#', reviewId: 'Review 02' }
      ],
      invitations: [],
      researchPapers: [],
      marks: {
        cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 5, total: 25 },
        endSem: { presentation: 19, finalReport: 21, total: 40 },
        totalMarks: 65,
        status: 'Approved'
      }
    },
    {
      id: 'TEAM-04',
      teamNumber: '04',
      name: 'GridFlow IoT',
      projectTitle: 'Smart Microgrid Decentralized Energy Trading & Load Balancing',
      problemStatement: 'Distributed solar rooftop producers face high transaction friction and grid instability when selling surplus power to neighboring campus buildings.',
      objectives: '1. Create private ledger smart contracts for peer-to-peer kWh settlement.\n2. Deploy IoT energy meters with automated load cutoff relays.\n3. Integrate predictive solar forecast algorithm.',
      shortDescription: 'Decentralized peer-to-peer campus energy distribution system balancing dynamic battery storage with automated smart contracts.',
      domain: 'IoT & Clean Energy',
      domainReason: 'Clean tech sustainability project with embedded hardware integration.',
      technologies: ['Solidity', 'Node.js', 'MQTT', 'ESP32', 'Next.js', 'InfluxDB'],
      expectedOutcome: 'Campus pilot prototype enabling 10 student labs to bid and consume decentralized green energy.',
      startDate: '2026-08-10',
      expectedCompletionDate: '2026-11-20',
      status: 'In Development',
      currentStage: 'Development',
      progress: 62,
      lastReviewDate: '2026-09-25',
      nextReviewDate: '2026-10-09',
      leaderEmail: 'kartik.deshmukh@university.edu',
      mentorId: 'MENTOR-01',
      mentorName: 'Dr. Sarah Jenkins',
      mentorStatus: 'Accepted',
      currentSemester: '7th Semester',
      members: [
        { name: 'Kartik Deshmukh', email: 'kartik.deshmukh@university.edu', regNo: '20BCA029', role: 'Team Leader', status: 'Accepted', attendanceRate: '100%' },
        { name: 'Meera Iyer', email: 'meera.i@university.edu', regNo: '20BCA051', role: 'Smart Contract Developer', status: 'Accepted', attendanceRate: '100%' },
        { name: 'Devendra Joshi', email: 'devendra.j@university.edu', regNo: '20BCA077', role: 'IoT Firmware Developer', status: 'Accepted', attendanceRate: '85%' }
      ],
      tasks: [
        { id: 'TASK-401', description: 'Verify MQTT packet latency under 50 concurrent smart meters', assignedStudent: 'Devendra Joshi', dateAssigned: '2026-09-25', deadline: '2026-10-05', status: 'In Progress', mentorRemarks: 'Ensure TLS encryption on broker.' }
      ],
      documents: [
        { id: 'DOC-06', title: 'Microgrid Hardware Schematic & Protocol Spec', type: 'SRS', date: '2026-09-02', size: '2.1 MB', url: '#', reviewId: 'Review 01' }
      ],
      invitations: [],
      researchPapers: [],
      marks: {
        cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 4, total: 24 },
        endSem: { presentation: 17, finalReport: 20, total: 37 },
        totalMarks: 61,
        status: 'Approved'
      }
    },
    {
      id: 'TEAM-05',
      teamNumber: '05',
      name: 'AeroVision Autonomous',
      projectTitle: 'Autonomous UAV Swarm for Wildfire Early Detection & Thermal Mapping',
      problemStatement: 'Forestry departments suffer critical response delays due to manual satellite review that only updates every 6-12 hours.',
      objectives: '1. Implement edge computer vision on Nvidia Jetson for smoke & flame recognition.\n2. Autonomous drone mesh networking without cellular connectivity.\n3. Publish final research paper and complete defense viva.',
      shortDescription: 'Multi-UAV autonomous surveillance mesh streaming real-time thermal geo-coordinates of ignition points to first responder dashboards.',
      domain: 'Robotics & Computer Vision',
      domainReason: 'Capstone capstone engineering project combining embedded avionics and edge AI.',
      technologies: ['ROS2', 'PyTorch', 'C++', 'Nvidia Jetson', 'WebRTC', 'Mapbox GL'],
      expectedOutcome: 'Final defended capstone project with published IEEE conference paper and live outdoor flight demonstration.',
      startDate: '2026-08-01',
      expectedCompletionDate: '2026-12-10',
      status: 'Final Submission',
      currentStage: 'Final Presentation',
      progress: 92,
      lastReviewDate: '2026-09-29',
      nextReviewDate: '2026-10-12',
      leaderEmail: 'tanvi.kulkarni@university.edu',
      mentorId: 'MENTOR-01',
      mentorName: 'Dr. Sarah Jenkins',
      mentorStatus: 'Accepted',
      currentSemester: '8th Semester',
      members: [
        { name: 'Tanvi Kulkarni', email: 'tanvi.kulkarni@university.edu', regNo: '19BCA008', role: 'Team Leader', status: 'Accepted', attendanceRate: '100%' },
        { name: 'Vikramaditya Sen', email: 'vikram.sen@university.edu', regNo: '19BCA033', role: 'Computer Vision Engineer', status: 'Accepted', attendanceRate: '100%' },
        { name: 'Ritu Ganguly', email: 'ritu.g@university.edu', regNo: '19BCA057', role: 'Embedded Systems Lead', status: 'Accepted', attendanceRate: '95%' },
        { name: 'Pranav Menon', email: 'pranav.m@university.edu', regNo: '19BCA091', role: 'Flight Operations & QA', status: 'Accepted', attendanceRate: '100%' }
      ],
      tasks: [
        { id: 'TASK-501', description: 'Prepare 15-minute final defense slide deck and video demonstration', assignedStudent: 'Tanvi Kulkarni', dateAssigned: '2026-09-29', deadline: '2026-10-10', status: 'In Progress', mentorRemarks: 'Include benchmarking against satellite latency.' },
        { id: 'TASK-502', description: 'Finalize camera-ready IEEE conference manuscript', assignedStudent: 'Vikramaditya Sen', dateAssigned: '2026-09-29', deadline: '2026-10-08', status: 'Completed', mentorRemarks: 'Paper accepted for publication.' }
      ],
      documents: [
        { id: 'DOC-07', title: 'Complete Project Thesis & Final Technical Report', type: 'Final Report', date: '2026-09-20', size: '8.4 MB', url: '#', reviewId: 'Review 04' },
        { id: 'DOC-08', title: 'Conference Publication Proof & Reviewer Comments', type: 'Publication', date: '2026-09-28', size: '1.8 MB', url: '#', reviewId: 'Review 04' }
      ],
      invitations: [],
      researchPapers: [],
      marks: {
        cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 5, total: 25 },
        endSem: { presentation: 20, finalReport: 24, total: 44 },
        totalMarks: 69,
        status: 'Approved'
      }
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
        const hasSem7 = parsed.teams?.some(t => t.currentSemester === '7th Semester');
        const hasSem8 = parsed.teams?.some(t => t.currentSemester === '8th Semester');
        if (!hasSem7 || !hasSem8) {
          const missingTeams = initialData.teams.filter(
            it => !parsed.teams?.some(pt => pt.id === it.id)
          );
          parsed.teams = [...(parsed.teams || []), ...missingTeams];
        }
        setData(parsed);
      } catch (e) {
        setData(initialData);
      }
    } else {
      setData(initialData);
    }
    setIsLoaded(true);
  }, []);

  // Multi-tab real-time sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'nexus_academic_data_v4' && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          setData(updated);
        } catch (err) {
          console.error("Storage parse error:", err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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

  const createTeam = (submittedTeamName, overrideUser = null) => {
    // Generate a unique sequential Team ID based on the number of teams
    const newTeamId = `TEAM-${String(data.teams.length + 1).padStart(2, '0')}`;
    const teamName = submittedTeamName;
    const activeUser = overrideUser || data.currentUser || data.studentProfile;
    const newTeam = {
      id: newTeamId,
      name: teamName,
      leaderEmail: activeUser.email,
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
        { name: activeUser.fullName || activeUser.email.split('@')[0], email: activeUser.email, regNo: activeUser.registerNo || 'NEW-REG', role: 'Team Leader', status: 'Accepted' }
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

  const selectMentor = (teamId, mentorInput) => {
    if (!mentorInput || !mentorInput.trim()) return;
    const cleanInput = mentorInput.trim();

    const foundById = data.mentors.find(m => m.id === cleanInput);
    const foundByEmail = data.mentors.find(m => m.email?.toLowerCase() === cleanInput.toLowerCase());
    const foundByName = data.mentors.find(m => m.name?.toLowerCase() === cleanInput.toLowerCase());
    const foundObj = foundById || foundByEmail || foundByName;

    const mentorId = foundObj ? foundObj.id : `MENTOR-${Date.now()}`;
    const mentorName = foundObj ? foundObj.name : cleanInput;
    const mentorEmail = foundObj ? foundObj.email : (cleanInput.includes('@') ? cleanInput : '');

    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === teamId ? {
        ...t,
        mentorId,
        mentorName,
        mentorEmail: mentorEmail || mentorName,
        mentorStatus: 'Pending',
        marks: {
          ...t.marks,
          cia: {
            ...t.marks?.cia,
            mentorSelection: 5
          }
        }
      } : t),
      notifications: [
        { id: `N-${Date.now()}`, text: `📤 Mentor supervision request sent to ${mentorName || mentorEmail}.`, time: 'Just now', read: false, role: 'student' },
        { id: `N-${Date.now()}-m`, text: `📬 New mentor supervision request from ${prev.teams.find(t => t.id === teamId)?.name || 'Team'} for ${mentorName}!`, time: 'Just now', read: false, role: 'mentor' },
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

  const clearResearchPapers = (teamId) => {
    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => {
        if (t.id === teamId) {
          return {
            ...t,
            researchPapers: [],
            basePaper: null,
            marks: { ...t.marks, cia: { ...t.marks.cia, researchReview: 0 } }
          };
        }
        return t;
      })
    }));
  };

  const setBasePaper = (teamId, paperId) => {
    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => {
        if (t.id === teamId) {
          const selected = t.researchPapers.find(p => p.id === paperId);
          return {
            ...t,
            basePaper: selected
          };
        }
        return t;
      }),
      notifications: [
        ...prev.notifications,
        { id: `N-${Date.now()}`, text: `📄 Base paper successfully set!`, time: 'Just now', read: false, role: 'student' }
      ]
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

  const submitProjectProgressUpdate = (teamId, updateData) => {
    setData(prev => {
      const targetTeam = prev.teams.find(t => t.id === teamId);
      const teamName = targetTeam ? targetTeam.name : `Team ${teamId}`;
      const newPending = {
        stage: updateData.stage || 'Development',
        progress: Number(updateData.progress || 50),
        notes: updateData.notes || '',
        submittedBy: updateData.submittedBy || 'Student Team Leader',
        submittedAt: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };

      return {
        ...prev,
        teams: prev.teams.map(t => t.id === teamId ? { ...t, pendingProgressUpdate: newPending } : t),
        notifications: [
          {
            id: `N-${Date.now()}`,
            text: `📈 ${teamName} submitted a Progress & Stage update: ${newPending.stage} (${newPending.progress}%). Awaiting mentor approval.`,
            time: 'Just now',
            read: false,
            role: 'mentor'
          },
          ...prev.notifications
        ]
      };
    });
  };

  const approveProjectProgressUpdate = (teamId, mentorRemarks = '') => {
    setData(prev => {
      const targetTeam = prev.teams.find(t => t.id === teamId);
      if (!targetTeam || !targetTeam.pendingProgressUpdate) return prev;
      
      const newStage = targetTeam.pendingProgressUpdate.stage;
      const newProgress = targetTeam.pendingProgressUpdate.progress;

      return {
        ...prev,
        teams: prev.teams.map(t => {
          if (t.id === teamId) {
            return {
              ...t,
              currentStage: newStage,
              progress: newProgress,
              pendingProgressUpdate: {
                ...t.pendingProgressUpdate,
                status: 'Approved',
                mentorRemarks
              }
            };
          }
          return t;
        }),
        notifications: [
          {
            id: `N-${Date.now()}`,
            text: `✅ Mentor approved progress update for ${targetTeam.name}: ${newStage} (${newProgress}%).`,
            time: 'Just now',
            read: false,
            role: 'student'
          },
          ...prev.notifications
        ]
      };
    });
  };

  const rejectProjectProgressUpdate = (teamId, reason = '') => {
    setData(prev => {
      const targetTeam = prev.teams.find(t => t.id === teamId);
      if (!targetTeam || !targetTeam.pendingProgressUpdate) return prev;

      return {
        ...prev,
        teams: prev.teams.map(t => {
          if (t.id === teamId) {
            return {
              ...t,
              pendingProgressUpdate: {
                ...t.pendingProgressUpdate,
                status: 'Rejected',
                rejectionReason: reason || 'Mentor requested revisions on the submitted progress.'
              }
            };
          }
          return t;
        }),
        notifications: [
          {
            id: `N-${Date.now()}`,
            text: `⚠️ Progress update for ${targetTeam.name} requires revision: ${reason || 'See mentor comments.'}`,
            time: 'Just now',
            read: false,
            role: 'student'
          },
          ...prev.notifications
        ]
      };
    });
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
  };  const submitStudentReviewLog = (teamId, entryDetails) => {
    const newEntry = {
      id: `DIARY-${Date.now()}`,
      teamId,
      teamName: data.teams.find(t => t.id === teamId)?.name,
      ...entryDetails,
      status: 'Pending',
    };
    
    setData(prev => ({
      ...prev,
      projectDiary: [newEntry, ...prev.projectDiary],
      notifications: [
        { id: `N-${Date.now()}`, text: `📝 New review submitted by ${newEntry.teamName} pending your approval.`, time: 'Just now', read: false, role: 'mentor' },
        ...prev.notifications
      ]
    }));
  };

  const approveStudentReviewLog = (diaryId, mentorDetails) => {
    setData(prev => {
      const entryIndex = prev.projectDiary.findIndex(d => d.id === diaryId);
      if (entryIndex === -1) return prev;
      
      const updatedDiary = [...prev.projectDiary];
      updatedDiary[entryIndex] = {
        ...updatedDiary[entryIndex],
        ...mentorDetails,
        status: 'Approved'
      };

      return {
        ...prev,
        projectDiary: updatedDiary,
        notifications: [
          { id: `N-${Date.now()}`, text: `✅ Your review (${updatedDiary[entryIndex].reviewNumber}) has been approved by the mentor!`, time: 'Just now', read: false, role: 'student' },
          ...prev.notifications
        ]
      };
    });
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
      clearResearchPapers,
      setBasePaper,
      respondToMentorRequest,
      addProjectDiaryEntry,
      updateProjectProgress,
      submitProjectProgressUpdate,
      approveProjectProgressUpdate,
      rejectProjectProgressUpdate,
      addComprehensiveReviewDiaryEntry,
      addMentorTaskToTeam,
      updateMentorTaskStatus,
      uploadTeamProjectDocument,
      updateMentorProfile,
      submitReviewerMarks,
      submitStudentReviewLog,
      approveStudentReviewLog,
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
