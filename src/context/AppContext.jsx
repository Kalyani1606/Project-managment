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
  teams: [],

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
  projectDiary: [],

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
