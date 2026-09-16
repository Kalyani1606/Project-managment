import React, { createContext, useContext, useState } from 'react';

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
    teamId: 'TEAM-01'
  },

  mentorProfile: {
    fullName: 'Dr. Sarah Jenkins',
    employeeId: 'EMP-8042',
    email: 's.jenkins@university.edu',
    department: 'Department of Computer Science',
    designation: 'Associate Professor',
    areaOfExpertise: 'Artificial Intelligence, Machine Learning, Computer Vision'
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
      name: 'Team Alpha',
      leaderEmail: 'alex.vance@university.edu',
      status: 'Approved',
      mentorId: 'MENTOR-01',
      mentorName: 'Dr. Sarah Jenkins',
      mentorStatus: 'Accepted',
      domain: 'Artificial Intelligence',
      domainReason: 'Intense interest in automated medical image diagnosis and healthcare AI accessibility.',
      projectTitle: 'Explainable AI for Diabetic Retinopathy Screening',
      problemStatement: 'Early detection of diabetic retinopathy is critical to prevent vision loss. Existing deep learning models lack explainability for clinicians.',
      shortDescription: 'Developing a novel Grad-CAM augmented CNN model that highlights subtle retinal lesions while providing confidence scores for ophthalmologists.',
      currentSemester: '6th Semester',
      members: [
        { name: 'Alex Vance', email: 'alex.vance@university.edu', regNo: '21BCA042', role: 'Team Leader', status: 'Accepted' },
        { name: 'David Miller', email: 'david.m@university.edu', regNo: '21BCA043', role: 'Member', status: 'Accepted' },
        { name: 'Elena Rostova', email: 'elena.r@university.edu', regNo: '21BCA045', role: 'Member', status: 'Accepted' },
        { name: 'Siddharth Rao', email: 'siddharth.r@university.edu', regNo: '21BCA048', role: 'Member', status: 'Accepted' }
      ],
      invitations: [],
      researchPapers: [
        { id: 1, title: 'Deep Residual Learning for Image Recognition', authors: 'He, K., Zhang, X., Ren, S., & Sun, J.', publication: 'IEEE CVPR', year: '2016' },
        { id: 2, title: 'Grad-CAM: Visual Explanations from Deep Networks', authors: 'Selvaraju, R. R., et al.', publication: 'IEEE ICCV', year: '2017' },
        { id: 3, title: 'Deep Learning for Detection of Diabetic Retinopathy', authors: 'Gulshan, V., Rajan, R. P., et al.', publication: 'JAMA Journal', year: '2016' },
        { id: 4, title: 'Attention Is All You Need in Medical Vision Transformers', authors: 'Vaswani, A., & Dosovitskiy, A.', publication: 'NeurIPS', year: '2021' },
        { id: 5, title: 'Explainable AI in Clinical Decision Support: A Review', authors: 'Amann, J., et al.', publication: 'BMC Medical Informatics', year: '2020' }
      ],
      marks: {
        cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 5, total: 25 },
        endSem: { presentation: 9, finalReport: 14, total: 23 },
        totalMarks: 48,
        status: 'Verified'
      }
    },
    {
      id: 'TEAM-02',
      name: 'Team CyberShield',
      leaderEmail: 'priya.s@university.edu',
      status: 'Approved',
      mentorId: 'MENTOR-02',
      mentorName: 'Prof. Alan Turing',
      mentorStatus: 'Accepted',
      domain: 'Cybersecurity',
      domainReason: 'Addressing zero-day IoT vulnerability threats in smart home networks.',
      projectTitle: 'AI-Powered Anomaly Detection System for IoT Traffic',
      problemStatement: 'IoT devices lack standard hardware encryption and are vulnerable to botnet amplification attacks.',
      shortDescription: 'Implementing lightweight eBPF packet capture with isolation forest machine learning.',
      currentSemester: '6th Semester',
      members: [
        { name: 'Priya Sharma', email: 'priya.s@university.edu', regNo: '21BCA012', role: 'Team Leader', status: 'Accepted' },
        { name: 'Kevin Durant', email: 'kevin.d@university.edu', regNo: '21BCA015', role: 'Member', status: 'Accepted' },
        { name: 'Ananya Roy', email: 'ananya.r@university.edu', regNo: '21BCA019', role: 'Member', status: 'Accepted' }
      ],
      invitations: [],
      researchPapers: [
        { id: 1, title: 'eBPF-Based Network Packet Inspection', authors: 'Smith, J.', publication: 'ACM SIGCOMM', year: '2022' },
        { id: 2, title: 'IoT Security Challenges and Machine Learning Defense', authors: 'Zheng, C.', publication: 'IEEE IoT Journal', year: '2021' },
        { id: 3, title: 'Isolation Forest for High-Dimensional Network Intrusion', authors: 'Liu, F. T.', publication: 'IEEE ICDM', year: '2008' },
        { id: 4, title: 'Zero-Day Vulnerability Mitigation in Edge Networks', authors: 'Kumar, A.', publication: 'IEEE Access', year: '2023' },
        { id: 5, title: 'Mirai Botnet Architecture & Remediation Strategies', authors: 'Antonakakis, M.', publication: 'USENIX Security', year: '2017' }
      ],
      marks: {
        cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 4, problemIdentification: 5, researchReview: 4, total: 23 },
        endSem: { presentation: 8, finalReport: 13, total: 21 },
        totalMarks: 44,
        status: 'Draft'
      }
    },
    {
      id: 'TEAM-03',
      name: 'Team Nexus',
      leaderEmail: 'rohan.k@university.edu',
      status: 'Pending Approval',
      mentorId: 'MENTOR-01',
      mentorName: 'Dr. Sarah Jenkins',
      mentorStatus: 'Pending',
      domain: 'Cloud Computing',
      domainReason: 'Optimizing microservices container orchestration and serverless auto-scaling costs.',
      projectTitle: 'Intelligent Kubernetes Auto-Scaler Using Predictive Workload Metrics',
      problemStatement: 'Reactive Kubernetes HPA scales too late during unexpected flash traffic surges.',
      shortDescription: 'Using LSTM time-series forecasting to proactively scale pods prior to predicted traffic spikes.',
      currentSemester: '6th Semester',
      members: [
        { name: 'Rohan Kapoor', email: 'rohan.k@university.edu', regNo: '21BCA088', role: 'Team Leader', status: 'Accepted' },
        { name: 'Meera Nair', email: 'meera.n@university.edu', regNo: '21BCA090', role: 'Member', status: 'Accepted' }
      ],
      invitations: [{ email: 'samuel.t@university.edu', status: 'Pending' }],
      researchPapers: [],
      marks: {
        cia: { teamFormation: 4, mentorSelection: 0, domainSelection: 4, problemIdentification: 3, researchReview: 0, total: 11 },
        endSem: { presentation: 0, finalReport: 0, total: 0 },
        totalMarks: 11,
        status: 'Draft'
      }
    }
  ],

  // Mentors list
  mentors: [
    { id: 'MENTOR-01', name: 'Dr. Sarah Jenkins', email: 's.jenkins@university.edu', department: 'Computer Science', designation: 'Associate Professor', maxTeams: 8, assignedTeamsCount: 5, expertise: ['Artificial Intelligence', 'Machine Learning', 'Computer Vision'] },
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
      id: 'DIARY-101',
      teamId: 'TEAM-01',
      teamName: 'Team Alpha',
      date: '2025-09-02',
      mentorName: 'Dr. Sarah Jenkins',
      studentsPresent: ['Alex Vance', 'David Miller', 'Elena Rostova', 'Siddharth Rao'],
      discussion: 'Reviewed problem statement and initial literature survey of 5 research papers.',
      guidanceGiven: 'Refine the Grad-CAM visualization pipeline. Focus on Kaggle Diabetic Retinopathy dataset pre-processing.',
      workAssigned: 'Complete dataset preprocessing and execute baseline ResNet50 model training.',
      nextMeetingDate: '2025-09-16'
    },
    {
      id: 'DIARY-102',
      teamId: 'TEAM-01',
      teamName: 'Team Alpha',
      date: '2025-08-20',
      mentorName: 'Dr. Sarah Jenkins',
      studentsPresent: ['Alex Vance', 'Elena Rostova'],
      discussion: 'Initial project domain identification and scope discussion.',
      guidanceGiven: 'Approved AI domain selection. Suggested narrowing focus to healthcare diagnostics.',
      workAssigned: 'Draft problem statement and identify 5 high-impact peer-reviewed journals.',
      nextMeetingDate: '2025-09-02'
    },
    {
      id: 'DIARY-103',
      teamId: 'TEAM-02',
      teamName: 'Team CyberShield',
      date: '2025-08-28',
      mentorName: 'Prof. Alan Turing',
      studentsPresent: ['Priya Sharma', 'Kevin Durant', 'Ananya Roy'],
      discussion: 'eBPF kernel module implementation overview and setup environment test.',
      guidanceGiven: 'Ensure Linux kernel compatibility (v5.15+). Use BCC toolkit for rapid prototyping.',
      workAssigned: 'Set up virtualized testbed for IoT packet capture.',
      nextMeetingDate: '2025-09-12'
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
    {
      id: 'EVAL-01',
      teamId: 'TEAM-01',
      reviewerName: 'Prof. Robert Langford',
      reviewName: '6th Semester Mid-Term Review',
      reviewDate: '2025-09-10',
      scores: { problemUnderstanding: 9, literatureReview: 10, technicalKnowledge: 9, progress: 8, presentation: 9 },
      totalScore: 45,
      comments: 'Exceptional clarity in literature review. Grad-CAM methodology design is very well grounded.'
    }
  ],

  // Scheduled Reviews
  reviews: [
    { id: 'REV-EVENT-01', semester: '6th Semester', reviewName: '6th Semester CIA Review & Viva', date: '2025-10-20', time: '10:00 AM - 01:00 PM', venue: 'Seminar Hall 2, Science Block', assignedReviewer: 'Prof. Robert Langford', teamsAssigned: ['TEAM-01', 'TEAM-02'] },
    { id: 'REV-EVENT-02', semester: '7th Semester', reviewName: '7th Semester Prototype Demo', date: '2025-11-15', time: '02:00 PM - 05:00 PM', venue: 'Project Lab 4, IT Wing', assignedReviewer: 'Dr. Emily Watson', teamsAssigned: ['TEAM-03'] }
  ],

  // Coordinator Notice Board
  notices: [
    { id: 'NOTE-01', title: '📢 6th Semester Research Paper & Topic Finalization Deadline', date: '2025-09-08', author: 'Dr. Marcus Sterling (Coordinator)', priority: 'high', content: 'All 6th Semester teams must complete domain selection, problem statement, and 5 research paper entries by September 25th, 2025.' },
    { id: 'NOTE-02', title: '📅 CIA Presentation & Evaluation Schedule Released', date: '2025-09-05', author: 'Dr. Marcus Sterling (Coordinator)', priority: 'normal', content: 'The 6th Semester CIA Review will be held on October 20th, 2025 in Seminar Hall 2. Check your review schedule tab for venue details.' },
    { id: 'NOTE-03', title: '📄 Official E-Report & PPT Templates Uploaded', date: '2025-09-01', author: 'Dr. Marcus Sterling (Coordinator)', priority: 'normal', content: 'Official project report layout templates and presentation slides have been updated in the Resources & Templates section.' }
  ],

  // System Notifications
  notifications: [
    { id: 'N-01', text: '🔔 Your team (Team Alpha) mentor request was accepted by Dr. Sarah Jenkins.', time: '2 hours ago', read: false, role: 'student' },
    { id: 'N-02', text: '🔔 6th Semester CIA Review scheduled on Oct 20 at Seminar Hall 2.', time: '1 day ago', read: false, role: 'student' },
    { id: 'N-03', text: '🔔 New Mentor Request from Team Nexus awaiting your response.', time: '3 hours ago', read: false, role: 'mentor' },
    { id: 'N-04', text: '🔔 Assigned to evaluate 2 teams for 6th Semester CIA Review.', time: '1 day ago', read: false, role: 'reviewer' },
    { id: 'N-05', text: '🔔 5 teams have pending registration approvals.', time: '4 hours ago', read: false, role: 'coordinator' }
  ],

  // Official Templates
  templates: [
    { id: 'T-01', name: 'Official 6th Sem Structured E-Report Format', type: 'PDF / Document Guide', size: '1.2 MB', updated: 'Sep 01, 2025', url: '#' },
    { id: 'T-02', name: 'Official Mid-Semester Presentation Deck (.pptx)', type: 'PowerPoint Template', size: '3.4 MB', updated: 'Sep 01, 2025', url: '#' }
  ]
};

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(initialData);

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
      } : t)
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
