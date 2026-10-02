import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Users,
  UserCheck,
  Target,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Lock,
  Send,
  FileText,
  Award,
  Clock,
  Sparkles,
  ChevronRight,
  Eye,
  Check,
  X,
  BarChart3,
  Info,
  MonitorPlay,
  XCircle,
  Save,
  PlusCircle
} from 'lucide-react';
import Roadmap3D from '../Roadmap3D';
import EReportView from '../common/EReportView';
import SeventhSemesterReview from './SeventhSemesterReview';
import EighthSemesterReview from './EighthSemesterReview';

export default function StudentPortal({ defaultTab = 'dashboard', activeSection = 'all' }) {
  const router = useRouter();
  const {
    data,
    updateStudentProfile,
    createTeam,
    sendInvitation,
    respondToInvitation,
    selectMentor,
    setDomainAndTopic,
    addResearchPaper,
    clearResearchPapers,
    submitStudentReviewLog
  } = useApp();

  const { user } = useAuth();
  
  // Merge true auth user with the fallback profile so names/emails display properly
  const profile = {
    ...data.studentProfile,
    ...(data.currentUser || {}),
    ...(user || {}),
    email: user?.email || user?.collegeEmail || data.currentUser?.email || data.studentProfile.email,
    fullName: user?.name || data.currentUser?.fullName || data.studentProfile.fullName
  };
  const userTeam = data.teams.find(t => 
    t.leaderEmail === profile.email || 
    t.members?.some(m => m.email === profile.email)
  ) || data.teams[0]; // Fallback to first team for testing purposes

  const [activeTab, setActiveTab] = useState(defaultTab);
  
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const [selectedSemester, setSelectedSemester] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('targetSemester');
      if (stored) {
        localStorage.removeItem('targetSemester');
        return stored;
      }
    }
    return '6th Semester';
  });
  const [showEReportModal, setShowEReportModal] = useState(false);
  const [showReviewSubmitModal, setShowReviewSubmitModal] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    nextReviewDate: '',
    attendanceMap: {},
    workCompleted: '',
    workDemonstrated: '',
    progressPercent: 50,
    stage: 'Development',
    problemsFaced: '',
    mentorObservations: '',
    mentorFeedback: '',
    tasks: [{ task: '', student: '', deadline: '' }]
  });
  const [saveStatus, setSaveStatus] = useState('');
  const storageKey = `isSemesterCompleted_${profile.email}`;
  const [isSemesterCompleted, setIsSemesterCompleted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(storageKey) === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (showReviewSubmitModal && userTeam) {
      const initialAttendance = {};
      (userTeam.members || []).forEach(m => {
        initialAttendance[m.name] = 'Present';
      });
      setReviewFormData(prev => ({ ...prev, attendanceMap: initialAttendance }));
    }
  }, [showReviewSubmitModal, userTeam]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, isSemesterCompleted);
    }
  }, [isSemesterCompleted, storageKey]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ ...profile });

  const [newTeamName, setNewTeamName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const [domain, setDomain] = useState(() => {
    if (!userTeam?.domain) return 'Artificial Intelligence';
    const presets = ['Artificial Intelligence', 'Machine Learning', 'Web Development', 'Cybersecurity', 'IoT', 'Cloud Computing', 'Data Science'];
    return presets.includes(userTeam.domain) ? userTeam.domain : 'Others';
  });
  const [customDomain, setCustomDomain] = useState(() => {
    if (!userTeam?.domain) return '';
    const presets = ['Artificial Intelligence', 'Machine Learning', 'Web Development', 'Cybersecurity', 'IoT', 'Cloud Computing', 'Data Science'];
    return presets.includes(userTeam.domain) ? '' : userTeam.domain;
  });
  const [domainReason, setDomainReason] = useState(userTeam?.domainReason || '');
  const [projectTitle, setProjectTitle] = useState(userTeam?.projectTitle || '');
  const [problemStatement, setProblemStatement] = useState(userTeam?.problemStatement || '');
  const [shortDescription, setShortDescription] = useState(userTeam?.shortDescription || '');

  useEffect(() => {
    if (userTeam) {
      if (userTeam.domain) {
        const presets = ['Artificial Intelligence', 'Machine Learning', 'Web Development', 'Cybersecurity', 'IoT', 'Cloud Computing', 'Data Science'];
        if (presets.includes(userTeam.domain)) {
          setDomain(userTeam.domain);
        } else {
          setDomain('Others');
          setCustomDomain(userTeam.domain);
        }
      }
      if (userTeam.domainReason) setDomainReason(userTeam.domainReason);
      if (userTeam.projectTitle) setProjectTitle(userTeam.projectTitle);
      if (userTeam.problemStatement) setProblemStatement(userTeam.problemStatement);
      if (userTeam.shortDescription) setShortDescription(userTeam.shortDescription);
    }
  }, [userTeam?.id, activeSection]);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);

  const steps = [
    { id: 1, title: 'Create Team', isDone: !!userTeam },
    { id: 2, title: 'Add Members', isDone: userTeam && userTeam.members.length >= 2 },
    { id: 3, title: 'Select Mentor', isDone: userTeam && !!userTeam.mentorId },
    { id: 4, title: 'Domain & Topic', isDone: userTeam && !!userTeam.domain && !!userTeam.projectTitle },
    { id: 5, title: '5 Research Papers', isDone: userTeam && userTeam.researchPapers.length >= 5 }
  ];

  const completedStepsCount = steps.filter(s => s.isDone).length;
  const progressPercentage = Math.round((completedStepsCount / steps.length) * 100);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateStudentProfile(profileForm);
    setIsEditingProfile(false);
  };

  const handleCreateTeamSubmit = (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    createTeam(newTeamName.trim(), profile);
    setNewTeamName('');
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !userTeam) return;
    sendInvitation(userTeam.id, inviteEmail.trim());
    setInviteEmail('');
  };

  const handleDomainTopicSubmit = (e) => {
    if (e) e.preventDefault();
    if (!userTeam) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 4000);
      return;
    }
    const finalDomain = domain === 'Others' ? customDomain : domain;
    setDomainAndTopic(userTeam.id, finalDomain, domainReason, projectTitle, problemStatement, shortDescription);
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(''), 4000);
  };

  const handleUploadFile = (e) => {
    const files = Array.from(e.target.files);
    if (uploadedFiles.length + files.length > 5) {
      alert("You can only upload up to 5 papers.");
      return;
    }
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeUploadedFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleExtractDetails = () => {
    if (uploadedFiles.length < 5) {
      alert("Please upload 5 research papers before extracting.");
      return;
    }
    setIsExtracting(true);
    setTimeout(() => {
      const aiMockExtracts = [
          { title: "Deep Residual Learning for Image Recognition", authors: "He, K., Zhang, X.", publication: "IEEE CVPR", year: "2016" },
          { title: "Attention Is All You Need", authors: "Vaswani, A., et al.", publication: "NeurIPS", year: "2017" },
          { title: "YOLOv7: Trainable bag-of-freebies", authors: "Wang, C. Y., et al.", publication: "CVPR", year: "2023" },
          { title: "ImageNet Classification with Deep Convolutional Neural Networks", authors: "Krizhevsky, A., Sutskever, I.", publication: "NIPS", year: "2012" },
          { title: "Adam: A Method for Stochastic Optimization", authors: "Kingma, D. P., Ba, J.", publication: "ICLR", year: "2015" }
      ];
      aiMockExtracts.forEach(paper => addResearchPaper(userTeam.id, paper));
      setIsExtracting(false);
      setUploadedFiles([]);
    }, 2500); 
  };
  
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userTeam || !reviewFormData.workCompleted) return;
    
    const studentsPresentList = Object.keys(reviewFormData.attendanceMap).filter(
      name => reviewFormData.attendanceMap[name] === 'Present'
    );

    submitStudentReviewLog(userTeam.id, {
      ...reviewFormData,
      reviewNumber: `Review ${String(data.projectDiary.filter(d => d.teamId === userTeam.id).length + 1).padStart(2, '0')}`,
      studentsPresent: studentsPresentList,
      tasksGivenList: reviewFormData.tasks.filter(t => t.task.trim() !== '')
    });
    
    setShowReviewSubmitModal(false);
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(''), 4000);
    setReviewFormData({
      date: new Date().toISOString().split('T')[0],
      nextReviewDate: '',
      attendanceMap: {},
      workCompleted: '',
      workDemonstrated: '',
      progressPercent: 50,
      stage: 'Development',
      problemsFaced: '',
      mentorObservations: '',
      mentorFeedback: '',
      tasks: [{ task: '', student: '', deadline: '' }]
    });
  };

  return (
    <div className="space-y-6">
      {/* ==================== A. STUDENT PROFILE TAB ==================== */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-[#EADBD0] shadow-sm p-6 rounded-3xl border border-[#EADBD0] max-w-4xl mx-auto space-y-6 bg-white">
          <div className="flex items-center justify-between border-b border-[#EADBD0] pb-4">
            <div className="flex items-center gap-4">
              <img
                src={profile.photo}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-blue-600 object-cover shadow-md"
              />
              <div>
                <h2 className="text-xl font-bold text-[#111827]">{profile.fullName}</h2>
                <p className="text-xs text-[#FF5F38] font-mono font-bold">Reg. No: {profile.registerNo}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-[#0B2E26] font-bold text-xs rounded-xl border border-[#EADBD0] shadow-sm transition-all cursor-pointer py-1.5 text-xs"
            >
              {isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>

          <form onSubmit={handleProfileSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                className="form-input w-full"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label flex items-center justify-between">
                Register Number
                {profile.registerNoLocked && (
                  <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked by Coordinator
                  </span>
                )}
              </label>
              <input
                type="text"
                disabled={profile.registerNoLocked || !isEditingProfile}
                className="form-input w-full font-mono"
                value={profileForm.registerNo}
                onChange={(e) => setProfileForm({ ...profileForm, registerNo: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                disabled={!isEditingProfile}
                className="form-input w-full"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                className="form-input w-full"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Department / Programme</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                className="form-input w-full"
                value={profileForm.department}
                onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Course Name</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                className="form-input w-full"
                value={profileForm.course}
                onChange={(e) => setProfileForm({ ...profileForm, course: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Current Semester</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                className="form-input w-full"
                value={profileForm.semester}
                onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Academic Year</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                className="form-input w-full"
                value={profileForm.academicYear}
                onChange={(e) => setProfileForm({ ...profileForm, academicYear: e.target.value })}
              />
            </div>

            {isEditingProfile && (
              <div className="sm:col-span-2 flex justify-end gap-2 pt-4">
                <button type="submit" className="px-5 py-2.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer py-2 text-xs">
                  Save Profile Changes
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* ==================== B. STUDENT HOME DASHBOARD TAB ==================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#FFDAC5] to-[#FFECD9] border border-[#FF5F38]/40 rounded-3xl p-8 shadow-md">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div className="space-y-4 max-w-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF5F38]"></span>
                  <span className="text-[#FF5F38] text-[10px] font-black uppercase tracking-wider">Student Portal</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-[#111827] tracking-tight">
                  Welcome back,<br />
                  <span className="text-[#FF5F38]">{profile.fullName?.split(' ')[0]}!</span>
                </h1>
                <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed max-w-md">
                  "Big projects start with small steps. Keep going!"
                </p>
              </div>
              
              <div className="hidden md:flex flex-shrink-0 relative">
                <div className="absolute inset-0 bg-[#FF5F38]/10 blur-3xl rounded-full" />
                <span className="text-[120px] filter drop-shadow-xl relative z-10 animate-[bounce_3s_infinite]">🎓</span>
              </div>
            </div>
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 text-[180px] text-[#FF5F38]/5 transform rotate-12 blur-sm pointer-events-none">🎓</div>
            <div className="absolute bottom-10 left-1/2 w-4 h-4 rounded-full bg-[#FF5F38]/40" />
            <div className="absolute top-10 right-1/3 w-2 h-2 rounded-full bg-[#FF5F38]/60" />
            <div className="absolute bottom-20 right-1/4 w-3 h-3 justify-center items-center flex">
               <span className="text-[#FF5F38]/40 font-bold rotate-45 text-xl">+</span>
            </div>
          </div>

          {/* Semester Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 6th Semester Card */}
            <div className="bg-white border-2 border-transparent hover:border-[#FF5F38] shadow-sm hover:shadow-lg rounded-3xl p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-6 left-6 px-3 py-1 bg-[#FF5F38]/10 text-[#FF5F38] font-black text-sm rounded-lg">01</div>
              <div className="flex justify-center mt-8 mb-6 relative">
                <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full" />
                <span className="text-[80px] filter drop-shadow-lg relative z-10 duration-300 hover:scale-110">📚</span>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-black text-[#111827]">Capstone Project Phase 1</h3>
                <p className="text-sm font-bold text-slate-500">Planning & Research</p>
                <p className="text-xs text-slate-500 leading-relaxed min-h-[60px]">
                  Team formation, Mentor selection, Domain identification, Problem statement and 5 Research papers.
                </p>
              </div>
              <button 
                onClick={() => { localStorage.setItem('targetSemester', '6th Semester'); router.push('/student/events'); }}
                className="mt-6 flex items-center justify-between text-[#FF5F38] font-bold text-sm hover:text-[#E54D26] group"
              >
                Click to view tasks
                <div className="w-8 h-8 rounded-full bg-[#FF5F38]/10 flex items-center justify-center group-hover:bg-[#FF5F38]/20 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* 7th Semester Card */}
            <div className="bg-white border-2 border-transparent hover:border-[#FF5F38] shadow-sm hover:shadow-lg rounded-3xl p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-6 left-6 px-3 py-1 bg-slate-100 text-slate-600 font-black text-sm rounded-lg">02</div>
              <div className="flex justify-center mt-8 mb-6 relative">
                 <div className="absolute inset-0 bg-slate-400/10 blur-xl rounded-full" />
                <span className="text-[80px] filter drop-shadow-lg relative z-10 duration-300 hover:scale-110">💻</span>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-black text-[#111827]">Capstone Project Phase 2</h3>
                <p className="text-sm font-bold text-slate-500">Development & Implementation</p>
                <p className="text-xs text-slate-500 leading-relaxed min-h-[60px]">
                  Architecture design, Model training/API development, System integration and Mid-term demo.
                </p>
              </div>
              <button 
                onClick={() => { localStorage.setItem('targetSemester', '7th Semester'); router.push('/student/events'); }}
                className="mt-6 flex items-center justify-between text-[#FF5F38] font-bold text-sm hover:text-[#E54D26] group opacity-80 hover:opacity-100"
              >
                Click to view tasks
                <div className="w-8 h-8 rounded-full bg-[#FF5F38]/10 flex items-center justify-center group-hover:bg-[#FF5F38]/20 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* 8th Semester Card */}
            <div className="bg-white border-2 border-transparent hover:border-[#FF5F38] shadow-sm hover:shadow-lg rounded-3xl p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-6 left-6 px-3 py-1 bg-slate-100 text-slate-600 font-black text-sm rounded-lg">03</div>
              <div className="flex justify-center mt-8 mb-6 relative">
                 <div className="absolute inset-0 bg-[#FF5F38]/10 blur-xl rounded-full" />
                <span className="text-[80px] filter drop-shadow-lg relative z-10 duration-300 hover:scale-110">🚀</span>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-black text-[#111827]">Capstone Project Phase 3</h3>
                <p className="text-sm font-bold text-slate-500">Final Project & Completion</p>
                <p className="text-xs text-slate-500 leading-relaxed min-h-[60px]">
                  Performance benchmarking, Final viva presentation, Thesis submission and Publication.
                </p>
              </div>
              <button 
                onClick={() => { localStorage.setItem('targetSemester', '8th Semester'); router.push('/student/events'); }}
                className="mt-6 flex items-center justify-between text-[#FF5F38] font-bold text-sm hover:text-[#E54D26] group opacity-80 hover:opacity-100"
              >
                Click to view tasks
                <div className="w-8 h-8 rounded-full bg-[#FF5F38]/10 flex items-center justify-center group-hover:bg-[#FF5F38]/20 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================== C. EVENTS / SEMESTER PAGE ==================== */}
      {activeTab === 'semester' && (
        <div className="space-y-6">
          
          {/* Semester Selector Tabs */}
          {(activeSection === 'all' || activeSection === 'progress') && (
          <div className="flex items-center justify-center gap-3 bg-white p-2 rounded-2xl border border-[#EADBD0] max-w-xl mx-auto shadow-sm">
            {['6th Semester', '7th Semester', '8th Semester'].map((sem) => {
              const isActive = selectedSemester === sem;
              return (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#FF5F38] text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                      : 'text-slate-600 hover:text-[#111827] hover:bg-slate-100'
                  }`}
                >
                  {sem.startsWith('6') && '🟢 Capstone Phase 1'}
                  {sem.startsWith('7') && '🟡 Capstone Phase 2'}
                  {sem.startsWith('8') && '🔵 Capstone Phase 3'}
                </button>
              );
            })}
          </div>
          )}

          {/* 6th Semester Detailed Module */}
          {selectedSemester === '6th Semester' ? (
            <div className="space-y-6">
              
              {/* Progress Tracker Card */}
              {(activeSection === 'all' || activeSection === 'progress') && (
              <div className="bg-white border border-[#EADBD0] shadow-sm p-6 rounded-3xl border border-blue-200 bg-white shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#FF5F38]" />
                      📊 6th Semester Progress Tracker
                    </h2>
                    <p className="text-xs text-slate-500">Track real-time completion of your 5-step project setup</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-extrabold text-[#FF5F38] font-mono">{progressPercentage}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-[#EADBD0] mb-4">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-2 text-center text-xs">
                  {steps.map(s => (
                    <div
                      key={s.id}
                      className={`p-2.5 rounded-2xl border transition-all ${
                        s.isDone
                          ? 'bg-[#FF5F38]/10 border-blue-200 text-blue-800 font-bold'
                          : 'bg-[#FAF2EC] border-[#EADBD0] text-slate-400'
                      }`}
                    >
                      <div className="text-[10px] opacity-75">Step {s.id}</div>
                      <div className="text-[11px] truncate mt-0.5">{s.title}</div>
                      <div className="text-xs mt-1">{s.isDone ? '✓ Done' : '⏳ Pending'}</div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* Step-by-Step Module */}
              <div className="space-y-4">
                {isSemesterCompleted ? (
                   <div className="p-8 rounded-[24px] border border-[#EADBD0] bg-white shadow-lg space-y-6 animate-fade-in relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-2 h-full bg-[#FF5F38]"></div>
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EADBD0] pb-4 gap-4">
                        <h2 className="text-xl font-black text-[#111827] flex items-center gap-2">
                           <CheckCircle2 className="w-6 h-6 text-[#FF5F38]" /> Final Submitted Details Summary
                        </h2>
                        <button onClick={() => setIsSemesterCompleted(false)} className="px-5 py-2.5 bg-[#FFF8F4] hover:bg-[#FADCC7] border border-[#FADCC7] text-[#D94625] text-xs font-bold rounded-xl transition-all cursor-pointer">
                           Edit Details
                        </button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#FAF2EC] p-5 rounded-2xl border border-[#EADBD0]">
                           <h3 className="text-xs font-bold text-[#FF5F38] mb-3 uppercase tracking-wider">Team & Mentor</h3>
                           <p className="text-sm font-semibold text-[#111827] mb-1"><span className="text-slate-500 font-medium">Team ID:</span> {userTeam?.id}</p>
                           <p className="text-sm font-semibold text-[#111827] mb-1"><span className="text-slate-500 font-medium">Name:</span> {userTeam?.name}</p>
                           <p className="text-sm font-semibold text-[#111827] mt-3 pt-3 border-t border-[#EADBD0]"><span className="text-slate-500 font-medium">Mentor:</span> {userTeam?.mentorName || "Pending Setup"}</p>
                        </div>
                        <div className="bg-[#FAF2EC] p-5 rounded-2xl border border-[#EADBD0]">
                           <h3 className="text-xs font-bold text-[#FF5F38] mb-3 uppercase tracking-wider">Domain & Topic</h3>
                           <p className="text-sm font-semibold text-[#111827] mb-1"><span className="text-slate-500 font-medium">Domain:</span> {userTeam?.domain || "Not Selected"}</p>
                           <p className="text-sm font-semibold text-[#111827] mt-2 leading-relaxed"><span className="text-slate-500 font-medium">Topic:</span> {userTeam?.projectTitle || "Not Selected"}</p>
                        </div>
                     </div>
                     <div className="bg-[#FAF2EC] p-5 rounded-2xl border border-[#EADBD0]">
                         <h3 className="text-xs font-bold text-[#FF5F38] mb-3 uppercase tracking-wider">Members ({userTeam?.members?.length || 0})</h3>
                         <div className="flex flex-wrap gap-2">
                            {userTeam?.members?.map((m, idx) => (
                               <span key={idx} className="text-xs font-bold bg-white border border-[#EADBD0] text-slate-700 px-3 py-1.5 rounded-lg">{m.name}</span>
                            ))}
                         </div>
                     </div>
                     <div className="bg-[#FAF2EC] p-5 rounded-2xl border border-[#EADBD0] md:col-span-2">
                         <h3 className="text-xs font-bold text-[#FF5F38] mb-3 uppercase tracking-wider">Literature Survey ({userTeam?.researchPapers?.length || 0} Papers)</h3>
                         {userTeam?.researchPapers?.length > 0 ? (
                           <div className="overflow-x-auto bg-white rounded-xl border border-[#EADBD0] p-1">
                             <table className="w-full text-left text-xs border-collapse">
                               <thead>
                                 <tr className="border-b border-[#EADBD0] text-slate-500 bg-slate-50/50">
                                   <th className="py-2 px-3">No.</th>
                                   <th className="py-2 px-3">Paper Title</th>
                                   <th className="py-2 px-3">Author(s)</th>
                                   <th className="py-2 px-3">Publication / Journal</th>
                                   <th className="py-2 px-3">Year</th>
                                 </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-100">
                                 {userTeam?.researchPapers?.map((p, idx) => (
                                   <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                     <td className="py-2.5 px-3 font-mono font-bold text-[#FF5F38]">{idx + 1}</td>
                                     <td className="py-2.5 px-3 font-semibold text-[#111827]">{p.title}</td>
                                     <td className="py-2.5 px-3 text-slate-700">{p.authors}</td>
                                     <td className="py-2.5 px-3 text-slate-500">{p.publication}</td>
                                     <td className="py-2.5 px-3 font-mono text-slate-600">{p.year}</td>
                                   </tr>
                                 ))}
                               </tbody>
                             </table>
                           </div>
                         ) : (
                           <div className="text-xs text-slate-500 font-medium italic">No research papers added.</div>
                         )}
                     </div>
                   </div>
                ) : (
                  <>
                
                {/* STEP 1 & 2 */}
                {(activeSection === 'all' || activeSection === 'team') && (
                <div className="p-6 rounded-3xl border border-[#EADBD0] bg-white shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#FF5F38] flex items-center justify-center font-bold text-xs">
                        1 & 2
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#111827]">Step 1 & 2: Create Team & Add Team Members 🤝</h3>
                        <p className="text-xs text-slate-500">Team leader initiates team and sends email invitations</p>
                      </div>
                    </div>
                    {userTeam && (
                      <span className={`badge ${userTeam.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                        {userTeam.status}
                      </span>
                    )}
                  </div>

                  {!userTeam ? (
                    <form onSubmit={handleCreateTeamSubmit} className="flex gap-3 max-w-md">
                      <input
                        type="text"
                        placeholder="Enter Team Name (e.g. CodeCrafters Alpha)"
                        className="flex-1 px-4 py-3 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl text-sm focus:outline-none focus:border-[#FF5F38] focus:ring-1 focus:ring-[#FF5F38] transition-colors"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        required
                      />
                      <button type="submit" className="px-5 py-3 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap">
                        Create Team
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-[#FAF2EC] border border-[#EADBD0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="text-xs text-[#FF5F38] font-mono font-bold">Team ID: {userTeam.id}</div>
                          <div className="text-base font-bold text-[#111827]">{userTeam.name}</div>
                          <div className="text-xs text-slate-500">Leader: {userTeam.leaderEmail}</div>
                        </div>

                        <form onSubmit={handleInviteSubmit} className="flex items-center gap-2">
                          <input
                            type="email"
                            placeholder="teammate@university.edu"
                            className="form-input text-xs py-1.5"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                          />
                          <button type="submit" className="px-4 py-2 bg-white hover:bg-slate-100 text-[#0B2E26] font-bold text-xs rounded-xl border border-[#EADBD0] shadow-sm transition-all cursor-pointer py-1.5 text-xs whitespace-nowrap">
                            <Send className="w-3.5 h-3.5" /> Send Invite
                          </button>
                        </form>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-[#EADBD0] text-slate-500">
                              <th className="py-2 px-3">Student Name</th>
                              <th className="py-2 px-3">Email Address</th>
                              <th className="py-2 px-3">Register No</th>
                              <th className="py-2 px-3">Role</th>
                              <th className="py-2 px-3">Invitation Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {userTeam.members.map((m, idx) => (
                              <tr key={idx}>
                                <td className="py-2.5 px-3 font-bold text-[#111827]">{m.name}</td>
                                <td className="py-2.5 px-3 text-slate-600">{m.email}</td>
                                <td className="py-2.5 px-3 font-mono text-slate-500">{m.regNo}</td>
                                <td className="py-2.5 px-3 font-semibold text-[#FF5F38]">{m.role}</td>
                                <td className="py-2.5 px-3">
                                  <span className="badge badge-success font-mono">Accepted ✅</span>
                                </td>
                              </tr>
                            ))}

                            {userTeam.invitations?.map((inv, idx) => (
                              <tr key={idx} className="bg-amber-50/50">
                                <td className="py-2.5 px-3 text-slate-500">Invited Member</td>
                                <td className="py-2.5 px-3 text-amber-800 font-mono">{inv.email}</td>
                                <td className="py-2.5 px-3 text-slate-400">Pending</td>
                                <td className="py-2.5 px-3 text-slate-500">Member</td>
                                <td className="py-2.5 px-3 flex items-center gap-2">
                                  <span className="badge badge-warning">Pending Invite ⏳</span>
                                  <button
                                    onClick={() => respondToInvitation(userTeam.id, inv.email, 'Accepted')}
                                    className="p-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                    title="Simulate Accept"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => respondToInvitation(userTeam.id, inv.email, 'Rejected')}
                                    className="p-1 rounded bg-rose-100 text-rose-700 hover:bg-rose-200"
                                    title="Simulate Reject"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                    </div>
                  )}
                </div>
                )}

                {/* STEP 3 */}
                {(activeSection === 'all' || activeSection === 'mentor') && (
                <div className="p-6 rounded-3xl border border-[#EADBD0] bg-white shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        3
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#111827]">Step 3: Select Faculty Mentor 👨‍🏫</h3>
                        <p className="text-xs text-slate-500">Enter the name of your desired faculty mentor</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <input 
                      type="text" 
                      placeholder="e.g. Dr. Sarah Jenkins" 
                      className="flex-1 px-4 py-3 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl text-sm focus:outline-none focus:border-[#FF5F38] focus:ring-1 focus:ring-[#FF5F38] transition-colors"
                    />
                    <button 
                      onClick={() => alert("Mentor request sent!")}
                      className="px-6 py-3 bg-[#0B2E26] hover:bg-[#0B2E26]/90 text-white font-bold text-sm rounded-xl transition-colors whitespace-nowrap"
                    >
                      Send Request
                    </button>
                  </div>
                </div>
                )}

                {/* STEP 4 & 5 */}
                {(activeSection === 'all' || activeSection === 'domain') && (
                <div className="p-6 rounded-3xl border border-[#EADBD0] bg-white shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                        4
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#111827]">Step 4: Domain Selection 💡</h3>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleDomainTopicSubmit} className="space-y-5 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[13px] font-bold text-[#111827] mb-2 block tracking-tight">Project Domain</label>
                        <select
                          className="w-full px-4 py-3 bg-[#FCFAF8] border border-[#FADCC7] rounded-2xl text-[14px] font-semibold text-[#111827] focus:outline-none focus:border-[#FF5F38] focus:ring-4 focus:ring-[#FF5F38]/10 shadow-sm hover:border-[#FADCC7] transition-all cursor-pointer"
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                        >
                          <option value="Artificial Intelligence">Artificial Intelligence</option>
                          <option value="Machine Learning">Machine Learning</option>
                          <option value="Web Development">Web Development</option>
                          <option value="Cybersecurity">Cybersecurity</option>
                          <option value="IoT">IoT (Internet of Things)</option>
                          <option value="Cloud Computing">Cloud Computing</option>
                          <option value="Data Science">Data Science</option>
                          <option value="Others">Others</option>
                        </select>
                        {domain === 'Others' && (
                          <input
                            type="text"
                            placeholder="Type your custom domain..."
                            className="w-full px-4 py-3 mt-3 bg-[#FCFAF8] border border-[#FADCC7] rounded-2xl text-[14px] font-semibold text-[#111827] focus:outline-none focus:border-[#FF5F38] focus:ring-4 focus:ring-[#FF5F38]/10 shadow-sm hover:border-[#FADCC7] transition-all"
                            value={customDomain}
                            onChange={(e) => setCustomDomain(e.target.value)}
                            required
                          />
                        )}
                      </div>

                      <div>
                        <label className="text-[13px] font-bold text-[#111827] mb-2 block tracking-tight">Proposed Project Title</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-[#FCFAF8] border border-[#FADCC7] rounded-2xl text-[14px] font-semibold text-[#111827] focus:outline-none focus:border-[#FF5F38] focus:ring-4 focus:ring-[#FF5F38]/10 shadow-sm hover:border-[#FADCC7] transition-all placeholder-slate-400"
                          placeholder="e.g. Intelligent Auto-Scaler"
                          value={projectTitle}
                          onChange={(e) => setProjectTitle(e.target.value)}
                          required
                        />
                      </div>
                    </div>



                    <div className="flex items-center justify-end gap-4 pt-3">
                      {saveStatus === 'success' && <span className="text-[13px] font-bold text-emerald-600 animate-pulse">✓ Saved Successfully!</span>}
                      {saveStatus === 'error' && <span className="text-[13px] font-bold text-rose-500">Error: Create a Team first!</span>}
                      <button type="button" onClick={handleDomainTopicSubmit} className="px-8 py-4 bg-[#FF5F38] hover:bg-[#E54D26] hover:-translate-y-0.5 hover:shadow-lg text-white font-black text-[15px] tracking-wide rounded-2xl shadow-md transition-all flex items-center gap-2.5 cursor-pointer">
                        <Save className="w-5 h-5" />
                        Save Domain & Topic Details
                      </button>
                    </div>
                  </form>
                </div>
                )}

                {/* STEP 6 */}
                {(activeSection === 'all' || activeSection === 'papers') && (
                <div className="p-6 rounded-3xl border border-[#EADBD0] bg-white shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        5
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#111827]">Step 5: Research Paper Literature Survey 📚</h3>
                        <p className="text-xs text-slate-500">Upload all the five research papers</p>
                      </div>
                    </div>

                    <span className="badge badge-primary font-mono">
                      {userTeam?.researchPapers?.length || 0} / 5 Papers Added
                    </span>
                  </div>

                  {(userTeam?.researchPapers?.length || 0) < 5 ? (
                  <div className="p-6 rounded-[24px] bg-[#FFF8F4] border border-[#FADCC7]/60 shadow-sm mt-4">
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#FADCC7] rounded-2xl bg-white hover:bg-slate-50 transition-all cursor-pointer relative">
                      <input 
                        type="file" 
                        multiple
                        accept="application/pdf"
                        onChange={handleUploadFile}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-3">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h4 className="text-[15px] font-black text-[#D94625] uppercase tracking-wide">
                        Upload Research Papers
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Drag and drop or click to upload 5 PDFs</p>
                    </div>
                    
                    {uploadedFiles.length > 0 && (
                      <div className="mt-5 space-y-3">
                        {uploadedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-white border border-[#FADCC7] rounded-xl shadow-sm">
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-slate-400" />
                              <span className="text-sm font-semibold text-slate-700 truncate max-w-[200px] sm:max-w-md">{file.name}</span>
                            </div>
                            <button onClick={() => removeUploadedFile(idx)} className="text-rose-400 hover:text-rose-600">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-end pt-5">
                      <button 
                        onClick={handleExtractDetails} 
                        disabled={uploadedFiles.length < 5 || isExtracting}
                        className="px-8 py-3.5 bg-[#FF5F38] disabled:bg-[#FADCC7] disabled:cursor-not-allowed hover:bg-[#E54D26] text-white font-black text-[14px] tracking-wide rounded-2xl shadow-md transition-all flex items-center gap-2"
                      >
                        {isExtracting ? (
                          <>
                            <Sparkles className="w-5 h-5 animate-pulse" />
                            Extracting AI Details...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Extract Details
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  ) : (
                    <div className="p-4 px-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm mt-4 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                           <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                         </div>
                         <div>
                           <p className="font-black text-sm text-emerald-900 tracking-wide uppercase">Literature Survey Completed</p>
                           <p className="text-[13px] font-medium text-emerald-700 mt-0.5">All 5 research papers extracted successfully.</p>
                         </div>
                       </div>
                       <button 
                         onClick={() => clearResearchPapers(userTeam.id)}
                         className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-[13px] rounded-xl transition-colors shrink-0"
                       >
                         Clear Papers
                       </button>
                    </div>
                  )}

                  {userTeam?.researchPapers?.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse mt-4">
                        <thead>
                          <tr className="border-b border-[#EADBD0] text-slate-500">
                            <th className="py-2 px-2">No.</th>
                            <th className="py-2 px-3">Paper Title</th>
                            <th className="py-2 px-3">Author(s)</th>
                            <th className="py-2 px-3">Publication / Journal</th>
                            <th className="py-2 px-2">Year</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {userTeam?.researchPapers?.map((p, idx) => (
                            <tr key={idx}>
                              <td className="py-2 px-2 font-mono font-bold text-[#FF5F38]">{idx + 1}</td>
                              <td className="py-2 px-3 font-semibold text-[#111827]">{p.title}</td>
                              <td className="py-2 px-3 text-slate-700">{p.authors}</td>
                              <td className="py-2 px-3 text-slate-500">{p.publication}</td>
                              <td className="py-2 px-2 font-mono text-slate-600">{p.year}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
                )}

                {/* Final Submit Button */}
                {userTeam && (
                  <div className="flex justify-end pt-4 mt-8 pb-4">
                     <button
                       onClick={() => setIsSemesterCompleted(true)}
                       className="px-8 py-3.5 bg-[#0B2E26] hover:bg-[#071f1a] text-white font-black text-sm tracking-wide rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                     >
                        <CheckCircle2 className="w-5 h-5" />
                        Complete & Submit Details
                     </button>
                  </div>
                )}
                </>
                )}

                {/* MARKS DISPLAY */}
                {(activeSection === 'all' || activeSection === 'reports') && (
                <div className="space-y-6 relative z-10">
                  {/* Top Summary Tiles */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* CIA Summary Card */}
                    <div className="bg-white p-5 rounded-[24px] border border-[#EADBD0] shadow-sm flex items-center justify-between hover:border-[#FF5F38] hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#FFF8F4] text-[#FF5F38] flex items-center justify-center border border-[#FADCC7] shrink-0">
                          <Target className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">CIA</p>
                          <p className="text-xl font-bold text-[#111827]">25 <span className="text-sm font-medium text-slate-500">Marks</span></p>
                        </div>
                      </div>
                    </div>

                    {/* ESE Summary Card */}
                    <div className="bg-white p-5 rounded-[24px] border border-[#EADBD0] shadow-sm flex items-center justify-between hover:border-[#FF5F38] hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#FFF8F4] text-[#FF5F38] flex items-center justify-center border border-[#FADCC7] shrink-0">
                          <Target className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">ESE</p>
                          <p className="text-xl font-bold text-[#111827]">25 <span className="text-sm font-medium text-slate-500">Marks</span></p>
                        </div>
                      </div>
                    </div>

                    {/* Total Summary Banner */}
                    <div className="bg-[#FF5F38] p-5 rounded-[24px] shadow-md flex items-center justify-between relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 opacity-10">
                        <CheckCircle2 className="w-24 h-24 text-white" />
                      </div>
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white/90 uppercase">TOTAL EVALUATION</p>
                          <p className="text-2xl font-bold text-white">50 <span className="text-sm font-medium text-white/80">Marks</span></p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Evaluation Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CIA Card */}
                    <div className="bg-white rounded-[24px] border border-[#EADBD0] shadow-sm overflow-hidden hover:shadow-lg hover:border-[#FF5F38] transition-all duration-300 group flex flex-col">
                      <div className="p-6 border-b border-[#FADCC7] bg-[#FFF8F4] flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[#111827]">CIA (Review 1)</h2>
                        <span className="px-3 py-1 bg-[#FFDAC5] text-[#D94625] font-black text-xs rounded-full">Total: 25</span>
                      </div>
                      <div className="p-6 space-y-4 flex-1">
                        <div className="flex items-center justify-between p-4 rounded-[16px] bg-white border border-[#EADBD0] shadow-sm group-hover:border-[#FF5F38]/30 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#FFF8F4] flex items-center justify-center text-[#FF5F38] border border-[#FADCC7]/50 shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-[#111827]">Project Planning & Proposal</h4>
                              <p className="text-xs font-medium text-slate-500 mt-0.5">Based on the report review-1 and semester activities.</p>
                            </div>
                          </div>
                          <div className="px-3 py-1.5 bg-[#FFF8F4] border border-[#FADCC7] rounded-xl font-black text-[#D94625] shrink-0 text-sm">
                            25 M
                          </div>
                        </div>
                      </div>
                      <div className="p-5 bg-[#0B2E26] text-white flex justify-between items-center">
                        <span className="font-bold text-sm tracking-wide text-emerald-100/70 uppercase">TOTAL MARKS</span>
                        <span className="text-xl font-black">25</span>
                      </div>
                    </div>

                    {/* ESE Card */}
                    <div className="bg-white rounded-[24px] border border-[#EADBD0] shadow-sm overflow-hidden hover:shadow-lg hover:border-[#FF5F38] transition-all duration-300 group flex flex-col">
                      <div className="p-6 border-b border-[#FADCC7] bg-[#FFF8F4] flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[#111827]">ESE (Review 2)</h2>
                        <span className="px-3 py-1 bg-[#FFDAC5] text-[#D94625] font-black text-xs rounded-full">Total: 25</span>
                      </div>
                      <div className="p-6 space-y-4 flex-1">
                        <div className="flex items-center justify-between p-4 rounded-[16px] bg-white border border-[#EADBD0] shadow-sm group-hover:border-[#FF5F38]/30 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#FFF8F4] flex items-center justify-center text-[#FF5F38] border border-[#FADCC7]/50 shrink-0">
                              <MonitorPlay className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-[#111827]">Presentation & Viva</h4>
                            </div>
                          </div>
                          <div className="px-3 py-1.5 bg-[#FFF8F4] border border-[#FADCC7] rounded-xl font-black text-[#D94625] shrink-0 text-sm">
                            10 M
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-[16px] bg-white border border-[#EADBD0] shadow-sm group-hover:border-[#FF5F38]/30 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#FFF8F4] flex items-center justify-center text-[#FF5F38] border border-[#FADCC7]/50 shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-[#111827]">Final Report</h4>
                            </div>
                          </div>
                          <div className="px-3 py-1.5 bg-[#FFF8F4] border border-[#FADCC7] rounded-xl font-black text-[#D94625] shrink-0 text-sm">
                            15 M
                          </div>
                        </div>
                      </div>
                      <div className="p-5 bg-[#0B2E26] text-white flex justify-between items-center">
                        <span className="font-bold text-sm tracking-wide text-emerald-100/70 uppercase">TOTAL MARKS</span>
                        <span className="text-xl font-black">25</span>
                      </div>
                    </div>
                  </div>
                </div>
                )}


                {/* SEMESTER COMPLETE BUTTON */}
                {activeSection === 'all' && progressPercentage === 100 && (
                  <div className="p-6 mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-emerald-800">Ready to Submit?</h3>
                      <p className="text-xs text-emerald-600">You have completed all requirements for the 6th Semester.</p>
                    </div>
                    {!isSemesterCompleted ? (
                      <button 
                        type="button"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                        onClick={() => setIsSemesterCompleted(true)}
                      >
                        <CheckCircle2 className="w-5 h-5" /> Complete Semester Submission
                      </button>
                    ) : (
                      <button 
                        type="button"
                        disabled
                        className="px-6 py-3 bg-emerald-700/80 text-white/90 font-black text-sm rounded-xl transition-all flex items-center gap-2 cursor-default shadow-inner"
                      >
                        <CheckCircle2 className="w-5 h-5" /> Completed Successfully
                      </button>
                    )}
                  </div>
                )}

                {/* MARKS DISPLAY */}

              </div>
            </div>
          ) : selectedSemester === '7th Semester' ? (
            <SeventhSemesterReview userTeam={userTeam} />
          ) : selectedSemester === '8th Semester' ? (
            <EighthSemesterReview userTeam={userTeam} />
          ) : (
            <div className="bg-white border border-[#EADBD0] shadow-sm p-12 text-center rounded-3xl border border-[#EADBD0] bg-white text-slate-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-[#FF5F38] opacity-50" />
              <h3 className="text-lg font-bold text-[#111827] mb-1">{selectedSemester} Upcoming</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tasks for {selectedSemester} will unlock automatically upon completion of 6th Semester work.
              </p>
            </div>
          )}

        </div>
      )}

      {/* ==================== C. PROJECT REVIEWS TAB ==================== */}
      {activeTab === 'reviews' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Subtle Banner */}
          <div className="p-6 sm:p-8 rounded-[24px] bg-[#0B2E26] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-[#0B2E26]">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-[16px] bg-[#FF5F38] text-white flex items-center justify-center font-black shrink-0">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-wide">Project Review Logs</h3>
                <p className="text-[13px] text-emerald-100/70 mt-1 max-w-sm leading-relaxed">
                  Submit detailed progress reports to your mentor and maintain an official tracking history.
                </p>
              </div>
            </div>
            {userTeam && (
              <button 
                onClick={() => setShowReviewSubmitModal(true)}
                className="px-6 py-3.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-black text-sm rounded-xl shadow-lg shadow-[#FF5F38]/20 transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
              >
                + Submit Review Log
              </button>
            )}
          </div>
          
          {/* List of Previous Submissions */}
          <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-[#EADBD0] shadow-sm min-h-[50vh] flex flex-col">
            <h4 className="text-lg font-black text-[#111827] mb-6 flex items-center gap-2 pb-4 border-b border-[#EADBD0]/60">
              Your Submitted Reviews
            </h4>
            {!userTeam ? (
               <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-60 pb-10">
                 <FileText className="w-16 h-16 mb-4" />
                 <p className="font-bold">You must be in a team to submit reviews.</p>
               </div>
            ) : data.projectDiary.filter(d => d.teamId === userTeam.id).length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-80 pb-10 mt-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-10">
                 <Clock className="w-12 h-12 mb-3 text-slate-300" />
                 <h3 className="text-base font-black text-slate-500 mb-1">No Reviews Submitted</h3>
                 <p className="text-xs font-medium text-slate-400 text-center max-w-xs">
                   When you submit a review log, it will appear here for your mentor to evaluate and approve.
                 </p>
               </div>
            ) : (
               <div className="space-y-4">
                 {data.projectDiary.filter(d => d.teamId === userTeam.id).map((entry, idx) => (
                   <div key={entry.id} className="p-5 rounded-[20px] bg-[#FAF2EC] border border-[#EADBD0] flex flex-col sm:flex-row justify-between gap-4">
                     <div>
                       <div className="flex items-center gap-3 mb-2">
                         <span className="bg-[#111827] text-white text-xs font-bold px-3 py-1 rounded-full">{entry.reviewNumber || `Review ${idx + 1}`}</span>
                         <span className="text-xs text-slate-500 font-bold">{entry.date}</span>
                         {entry.status === 'Pending' ? (
                           <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold">Pending Approval</span>
                         ) : (
                           <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Approved</span>
                         )}
                       </div>
                       <p className="text-sm font-bold text-slate-800">Stage: {entry.stage}</p>
                       <p className="text-xs text-slate-600 mt-1 line-clamp-2">{entry.workCompleted}</p>
                     </div>
                     {entry.status === 'Approved' && entry.mentorFeedback && (
                       <div className="sm:w-1/3 bg-white p-4 rounded-xl border border-[#EADBD0] text-xs shadow-sm">
                         <span className="font-bold text-[#FF5F38] block mb-1 flex items-center gap-1">
                           <CheckCircle2 className="w-3 h-3" /> Mentor Feedback
                         </span>
                         <span className="text-slate-700 leading-relaxed line-clamp-3">{entry.mentorFeedback}</span>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>
      )}

      {showReviewSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm shadow-2xl">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl overflow-hidden border border-[#EADBD0] animate-fade-in flex flex-col max-h-[90vh]">
            <div className="bg-white px-8 py-5 flex items-center justify-between border-b border-[#EADBD0]">
              <div>
                <h2 className="text-xl font-black text-[#111827]">
                  New Official Project Review Entry — {userTeam?.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">Record review date, attendance, work completed & demonstrated progress for mentor approval</p>
              </div>
              <button onClick={() => setShowReviewSubmitModal(false)} className="bg-slate-100 hover:bg-slate-200 p-2 rounded-full text-slate-500 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleReviewSubmit} className="p-8 overflow-y-auto space-y-6 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Review Number</label>
                  <input type="text" readOnly value={`Review ${String(data.projectDiary.filter(d => d.teamId === userTeam?.id).length + 1).padStart(2, '0')}`} className="w-full px-3 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-mono font-bold" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Review Date</label>
                  <input type="date" required value={reviewFormData.date} onChange={e => setReviewFormData({...reviewFormData, date: e.target.value})} className="w-full px-3 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-mono font-bold" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Next Review Date</label>
                  <input type="date" value={reviewFormData.nextReviewDate} onChange={e => setReviewFormData({...reviewFormData, nextReviewDate: e.target.value})} className="w-full px-3 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-mono font-bold" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Record Student Attendance</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(userTeam?.members || []).map(m => {
                    const status = reviewFormData.attendanceMap[m.name] || 'Absent';
                    return (
                      <div key={m.regNo} className="bg-[#FAF2EC] p-3 rounded-2xl border border-[#EADBD0] flex items-center justify-between">
                        <div>
                          <div className="font-bold text-sm text-[#111827]">{m.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">USN: {m.regNo}</div>
                        </div>
                        <div className="flex bg-white rounded-xl overflow-hidden border border-[#EADBD0] shadow-sm">
                          <button type="button" onClick={() => setReviewFormData(prev => ({...prev, attendanceMap: {...prev.attendanceMap, [m.name]: 'Present'}}))} className={`px-3 py-1 text-xs font-bold transition ${status === 'Present' ? 'bg-[#0B2E26] text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Present</button>
                          <button type="button" onClick={() => setReviewFormData(prev => ({...prev, attendanceMap: {...prev.attendanceMap, [m.name]: 'Absent'}}))} className={`px-3 py-1 text-xs font-bold transition ${status === 'Absent' ? 'bg-red-50 text-red-600' : 'text-slate-500 hover:bg-slate-50'}`}>Absent</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Work Completed Since Last Review</label>
                  <textarea rows="3" required placeholder="Students completed database setup..." value={reviewFormData.workCompleted} onChange={e => setReviewFormData({...reviewFormData, workCompleted: e.target.value})} className="w-full p-3 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-medium"></textarea>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Work Demonstrated by Students</label>
                  <textarea rows="3" placeholder="Demonstrated user login..." value={reviewFormData.workDemonstrated} onChange={e => setReviewFormData({...reviewFormData, workDemonstrated: e.target.value})} className="w-full p-3 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-medium"></textarea>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Project Stage</label>
                <select value={reviewFormData.stage} onChange={e => setReviewFormData({...reviewFormData, stage: e.target.value})} className="w-full px-3 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-bold">
                  <option>Project Selection</option>
                  <option>Problem Identification</option>
                  <option>Research & SRS</option>
                  <option>Planning & Architecture</option>
                  <option>Design & Prototype</option>
                  <option>Development</option>
                  <option>Testing & QA</option>
                  <option>Documentation</option>
                  <option>Final Presentation</option>
                  <option>Final Submission</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#EADBD0] flex justify-end gap-3">
                <button type="button" onClick={() => setShowReviewSubmitModal(false)} className="px-6 py-2.5 rounded-xl border border-[#EADBD0] text-slate-600 font-bold hover:bg-slate-100 cursor-pointer text-sm">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white text-sm font-extrabold shadow-md cursor-pointer rounded-xl">Submit Review Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEReportModal && (
        <EReportView team={userTeam} onClose={() => setShowEReportModal(false)} />
      )}
    </div>
  );
}
