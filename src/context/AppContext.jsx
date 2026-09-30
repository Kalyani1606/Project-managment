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
      name: 'CodeCrafters Alpha',
      projectTitle: 'MedScan AI: Automated Radiology Triage & Diagnostic System',
      problemStatement: 'Radiologists in district hospitals face severe diagnostic fatigue with over 300+ X-rays per shift, leading to dangerous triage delays for critical pulmonary conditions.',
      objectives: '1. Develop deep learning model for chest X-ray anomaly detection.\n2. Achieve under 2 sec inference time with >93% accuracy.\n3. Build HIPAA-compliant Web UI for emergency room doctors.',
      shortDescription: 'Deep-learning based chest radiograph analysis platform that highlights pneumothorax and acute consolidation anomalies in under 2 seconds with 94.2% sensitivity.',
      domain: 'AI / Healthcare',
      domainReason: 'Priya and Alex have published paper on Convolutional Neural Networks for medical imaging.',
      technologies: ['Python', 'PyTorch', 'FastAPI', 'React', 'Docker', 'DICOM', 'TailwindCSS'],
      expectedOutcome: 'Clinical web application with real-time X-ray heatmap highlighting, priority queue triage, and automated PDF report generation.',
      startDate: '2026-08-01',
      expectedCompletionDate: '2026-11-30',
      status: 'In Development',
      currentStage: 'Development',
      progress: 65,
      lastReviewDate: '2026-09-30',
      nextReviewDate: '2026-10-07',
      leaderEmail: 'alex.vance@university.edu',
      mentorId: 'MENTOR-01',
      mentorName: 'Dr. Sarah Jenkins',
      mentorStatus: 'Accepted',
      currentSemester: '6th Semester',
      members: [
        { name: 'Alex Vance', email: 'alex.vance@university.edu', regNo: '21BCA042', role: 'Team Leader', status: 'Accepted', attendanceRate: '100%' },
        { name: 'David Miller', email: 'david.m@university.edu', regNo: '21BCA018', role: 'Backend Developer', status: 'Accepted', attendanceRate: '100%' },
        { name: 'Elena Rostova', email: 'elena.r@university.edu', regNo: '21BCA035', role: 'AI / ML Engineer', status: 'Accepted', attendanceRate: '75%' },
        { name: 'Siddharth Rao', email: 'sid.r@university.edu', regNo: '21BCA089', role: 'UI / UX Designer', status: 'Accepted', attendanceRate: '100%' }
      ],
      tasks: [
        { id: 'TASK-101', description: 'Complete emergency doctor triage dashboard UI', assignedStudent: 'Alex Vance', dateAssigned: '2026-09-30', deadline: '2026-10-07', status: 'In Progress', mentorRemarks: 'Focus on responsive layouts for tablet devices.' },
        { id: 'TASK-102', description: 'Fix API response error handling & PyTorch exception catching', assignedStudent: 'David Miller', dateAssigned: '2026-09-30', deadline: '2026-10-05', status: 'In Progress', mentorRemarks: 'Return standard HTTP 422 error payloads.' },
        { id: 'TASK-103', description: 'Add input validation for DICOM image file uploads', assignedStudent: 'Elena Rostova', dateAssigned: '2026-09-30', deadline: '2026-10-06', status: 'Pending', mentorRemarks: 'Verify image magic bytes before model inference.' },
        { id: 'TASK-104', description: 'Update GitHub repository README & Docker setup docs', assignedStudent: 'Siddharth Rao', dateAssigned: '2026-09-30', deadline: '2026-10-07', status: 'Completed', mentorRemarks: 'Great job on clean container startup instructions.' }
      ],
      documents: [
        { id: 'DOC-01', title: 'Project Proposal & Feasibility Report', type: 'Proposal', date: '2026-08-10', size: '1.4 MB', url: '#', reviewId: 'Review 01' },
        { id: 'DOC-02', title: 'Synopsis & System Architecture SRS', type: 'SRS', date: '2026-08-25', size: '2.8 MB', url: '#', reviewId: 'Review 02' },
        { id: 'DOC-03', title: 'Mid-Term Progress Report & Model Accuracy Benchmarks', type: 'Progress Report', date: '2026-09-15', size: '4.1 MB', url: '#', reviewId: 'Review 03' }
      ],
      invitations: [],
      researchPapers: [
        { id: 1, title: 'Deep Learning for Chest Radiograph Diagnosis', authors: 'Rajpurkar et al.', journal: 'PLOS Medicine', year: '2021', link: 'https://arxiv.org' }
      ],
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
      name: 'CyberShield Systems',
      projectTitle: 'Zero-Trust Network Access & Real-Time Anomaly Inspection',
      problemStatement: 'Legacy VPN solutions lack continuous micro-segmentation and device trust verification, making internal campus networks vulnerable to lateral threat movements.',
      objectives: '1. Implement eBPF kernel probes for real-time packet inspection.\n2. Construct automated device posture verification module.\n3. Provide central dashboard for SOC analysts.',
      shortDescription: 'Enterprise Zero-Trust network access gateway with eBPF micro-segmentation, posture verification, and automated SOC incident response rules.',
      domain: 'Cybersecurity & Networks',
      domainReason: 'Specialized focus in cryptography and kernel programming.',
      technologies: ['Go', 'eBPF', 'Rust', 'Docker', 'React', 'TailwindCSS', 'Redis'],
      expectedOutcome: 'High-throughput security proxy capable of inspecting 10Gbps traffic with low latency overhead.',
      startDate: '2026-08-05',
      expectedCompletionDate: '2026-11-28',
      status: 'In Development',
      currentStage: 'Design',
      progress: 45,
      lastReviewDate: '2026-09-22',
      nextReviewDate: '2026-10-06',
      leaderEmail: 'kiran.kumar@university.edu',
      mentorId: 'MENTOR-01',
      mentorName: 'Dr. Sarah Jenkins',
      mentorStatus: 'Accepted',
      currentSemester: '6th Semester',
      members: [
        { name: 'Kiran Kumar', email: 'kiran.kumar@university.edu', regNo: '21BCA055', role: 'Team Leader', status: 'Accepted', attendanceRate: '100%' },
        { name: 'Rohan Sharma', email: 'rohan.s@university.edu', regNo: '21BCA068', role: 'Security Analyst', status: 'Accepted', attendanceRate: '100%' },
        { name: 'Priya Sharma', email: 'priya.s@university.edu', regNo: '21BCA072', role: 'Frontend Engineer', status: 'Accepted', attendanceRate: '100%' }
      ],
      tasks: [
        { id: 'TASK-201', description: 'Benchmarking eBPF kernel probe overhead under 1Gbps load', assignedStudent: 'Kiran Kumar', dateAssigned: '2026-09-22', deadline: '2026-10-04', status: 'In Progress', mentorRemarks: 'Measure CPU cycles per packet.' },
        { id: 'TASK-202', description: 'Design wireframes for central SOC incident alert stream', assignedStudent: 'Priya Sharma', dateAssigned: '2026-09-22', deadline: '2026-10-06', status: 'Pending', mentorRemarks: 'Ensure dark mode compatibility.' }
      ],
      documents: [
        { id: 'DOC-04', title: 'Zero-Trust Architecture System Blueprint', type: 'SRS', date: '2026-08-28', size: '3.1 MB', url: '#', reviewId: 'Review 01' }
      ],
      invitations: [],
      researchPapers: [],
      marks: {
        cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 4, total: 24 },
        endSem: { presentation: 15, finalReport: 20, total: 35 },
        totalMarks: 59,
        status: 'Draft'
      }
    }
  ],

  // Mentors list
  mentors: [
    { id: 'MENTOR-01', name: 'Dr. Sarah Jenkins', email: 's.jenkins@university.edu', department: 'Computer Science', designation: 'Professor & Head of AI Lab', maxTeams: 8, assignedTeamsCount: 2, expertise: ['Artificial Intelligence', 'Machine Learning', 'Computer Vision', 'Cloud Systems'] },
    { id: 'MENTOR-02', name: 'Prof. Alan Turing', email: 'a.turing@university.edu', department: 'Cybersecurity', designation: 'Professor', maxTeams: 8, assignedTeamsCount: 4, expertise: ['Cybersecurity', 'IoT Security', 'Cryptography'] },
    { id: 'MENTOR-03', name: 'Dr. Grace Hopper', email: 'g.hopper@university.edu', department: 'Cloud Systems', designation: 'Professor', maxTeams: 8, assignedTeamsCount: 7, expertise: ['Cloud Computing', 'DevOps', 'Distributed Systems'] },
    { id: 'MENTOR-04', name: 'Dr. Raj Patel', email: 'r.patel@university.edu', department: 'Data Science', designation: 'Assistant Professor', maxTeams: 8, assignedTeamsCount: 6, expertise: ['Data Science', 'Big Data Analytics', 'NLP'] }
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
  evaluations: [],

  // Scheduled Reviews
  reviews: [],

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
    const saved = localStorage.getItem('nexus_academic_data_save');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('nexus_academic_data_save', JSON.stringify(data));
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
