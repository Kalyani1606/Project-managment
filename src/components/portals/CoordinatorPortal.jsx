import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Users,
  UserCheck,
  Calendar,
  Lock,
  Unlock,
  BarChart3,
  BookOpen,
  Clock,
  Check,
  Megaphone,
  Mail,
  Send,
  Eye,
  TrendingUp,
  Paperclip,
  UploadCloud,
  FileText,
  X,
  Table,
  LayoutGrid,
  Phone,
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  BellRing,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  Edit3,
  ChevronRight,
  ChevronLeft,
  Star,
  Award,
  FileCheck,
  RotateCcw,
  PieChart,
  ShieldAlert,
  UserX
} from 'lucide-react';
import ReportGenerator from '../common/ReportGenerator';

export default function CoordinatorPortal() {
  const {
    data,
    toggleRegisterLock,
    approveTeamStatus,
    assignMentorToTeam,
    assignReviewerToTeam,
    unassignReviewerFromTeam,
    scheduleReview,
    updateMarksStatus,
    publishNotice
  } = useApp();

  const { showToast } = useNotification();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get('tab');
  const semParam = searchParams.get('sem');
  const [activeTab, setActiveTab] = useState(tabParam || 'dashboard');

  useEffect(() => {
    setActiveTab(tabParam || 'dashboard');
  }, [tabParam]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === 'dashboard') {
      router.push('/coordinator?tab=dashboard');
    } else {
      router.push(`/coordinator?tab=${tabKey}`);
    }
  };

  // State for Coordinator Stats from API
  const [apiStats, setApiStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      setStatsLoading(true);
      try {
        const res = await fetch('/api/coordinator/stats');
        if (res.ok) {
          const json = await res.json();
          setApiStats(json);
        }
      } catch (err) {
        console.error('Failed to fetch coordinator stats:', err);
      } finally {
        setStatsLoading(false);
      }
    }
    fetchStats();
  }, []);

  // Section 2: Student & Team Search & Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedSemFilter, setSelectedSemFilter] = useState('ALL');
  const [selectedTeamModal, setSelectedTeamModal] = useState(null);
  const [teamViewMode, setTeamViewMode] = useState('table');

  const getMemberPhone = (m, teamIdx = 0, memberIdx = 0) => {
    if (m?.phone) return m.phone;
    const samplePhones = [
      '+91 98452 10842',
      '+91 97310 44219',
      '+91 98860 31254',
      '+91 94481 90214',
      '+91 96112 87401',
      '+91 99001 23456',
      '+91 98440 55678',
      '+91 97412 88990'
    ];
    return samplePhones[(teamIdx * 3 + memberIdx) % samplePhones.length];
  };

  // Section 3: Mentor Management
  const [mentorSearch, setMentorSearch] = useState('');
  const [assignMentorModalTeam, setAssignMentorModalTeam] = useState(null);
  const [selectedMentorIdToAssign, setSelectedMentorIdToAssign] = useState('');

  // Reviewer Allocation & Management State
  const [assignReviewerModalTeam, setAssignReviewerModalTeam] = useState(null);
  const [selectedReviewerIdToAssign, setSelectedReviewerIdToAssign] = useState('');
  const [reviewDeadlineInput, setReviewDeadlineInput] = useState('2026-11-20');
  const [reviewerSearch, setReviewerSearch] = useState('');
  const [reviewerSemFilter, setReviewerSemFilter] = useState('ALL');
  const [reviewerStatusFilter, setReviewerStatusFilter] = useState('ALL');
  const [reviewerSubTab, setReviewerSubTab] = useState('teams');
  const [apiReviewerData, setApiReviewerData] = useState({ reviewers: [], teams: [] });
  const [reviewerDataLoading, setReviewerDataLoading] = useState(false);
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  const fetchReviewersData = async () => {
    setReviewerDataLoading(true);
    try {
      const res = await fetch('/api/coordinator/reviewers');
      if (res.ok) {
        const json = await res.json();
        setApiReviewerData({
          reviewers: json.reviewers || [],
          teams: json.teams || []
        });
      }
    } catch (err) {
      console.error('Failed to load reviewers data from API:', err);
    } finally {
      setReviewerDataLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'reviewers' || activeTab === 'dashboard' || activeTab === 'marks') {
      fetchReviewersData();
    }
  }, [activeTab]);

  // Section 4: Announcements State
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annRecipients, setAnnRecipients] = useState('ALL');
  const [annSendEmail, setAnnSendEmail] = useState(true);
  const [annSendInApp, setAnnSendInApp] = useState(true);
  const [annScheduledAt, setAnnScheduledAt] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSendingAnn, setIsSendingAnn] = useState(false);
  const [annFiles, setAnnFiles] = useState([]);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleAnnFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    selectedFiles.forEach((file) => {
      if (file.size > 25 * 1024 * 1024) {
        showToast(`"${file.name}" exceeds 25MB limit.`, 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const fileObj = {
          id: `FILE-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: file.size,
          sizeFormatted: formatFileSize(file.size),
          type: file.type || 'application/octet-stream',
          dataUrl: reader.result
        };
        setAnnFiles((prev) => [...prev, fileObj]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeAnnFile = (fileId) => {
    setAnnFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const downloadFile = (file) => {
    if (file.dataUrl) {
      const a = document.createElement('a');
      a.href = file.dataUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      showToast(`Downloading demo document: ${file.name}`, 'info');
    }
  };

  const [announcementHistory, setAnnouncementHistory] = useState([
    {
      id: 'ANN-101',
      title: '📢 6th Semester Research Paper & Topic Finalization Deadline',
      message: 'All 6th Semester teams must complete domain selection, problem statement, and 5 research paper entries by September 25th.',
      recipients: '6th Semester Students',
      sentAt: '2026-09-08 10:30 AM',
      emailCount: 45,
      inAppCount: 45,
      status: 'Delivered',
      files: [
        { name: 'Research_Paper_Format_Rubric.pdf', sizeFormatted: '480 KB' }
      ]
    },
    {
      id: 'ANN-102',
      title: '📅 CIA Presentation & Evaluation Schedule Released',
      message: 'The 6th Semester CIA Review will be held on October 20th in Seminar Hall 2. Check your review schedule tab for venue details.',
      recipients: 'All Students & Mentors',
      sentAt: '2026-09-05 02:15 PM',
      emailCount: 60,
      inAppCount: 60,
      status: 'Delivered',
      files: [
        { name: 'CIA_Slot_Allocation_Schedule.xlsx', sizeFormatted: '215 KB' }
      ]
    }
  ]);

  const handleSendAnnouncement = async () => {
    if (!annTitle || !annMessage) {
      showToast('Please fill out the title and message.', 'error');
      return;
    }

    setIsSendingAnn(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: annTitle,
          message: annMessage,
          recipients: annRecipients,
          sendEmail: annSendEmail,
          sendInApp: annSendInApp,
          scheduledAt: annScheduledAt || undefined,
          files: annFiles.map((f) => ({
            id: f.id,
            name: f.name,
            size: f.size,
            sizeFormatted: f.sizeFormatted,
            type: f.type,
            dataUrl: f.dataUrl
          }))
        })
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to send announcement');

      showToast(resData.message || 'Announcement broadcast successfully!', 'success');

      // Publish notice to app context
      publishNotice({
        title: annTitle,
        content: annMessage,
        priority: 'high',
        files: [...annFiles]
      });

      // Add to history state
      const newHistoryItem = {
        id: `ANN-${Date.now()}`,
        title: `📢 ${annTitle}`,
        message: annMessage,
        recipients: annRecipients === 'ALL' ? 'All Users' : annRecipients,
        sentAt: new Date().toLocaleString(),
        emailCount: resData.stats?.emailCount || 0,
        inAppCount: resData.stats?.notificationCount || 0,
        status: annScheduledAt ? 'Scheduled' : 'Delivered',
        files: [...annFiles]
      };
      setAnnouncementHistory([newHistoryItem, ...announcementHistory]);

      // Reset form
      setAnnTitle('');
      setAnnMessage('');
      setAnnScheduledAt('');
      setAnnFiles([]);
      setShowPreviewModal(false);
    } catch (err) {
      showToast(err.message || 'Network error sending announcement', 'error');
    } finally {
      setIsSendingAnn(false);
    }
  };

  // Section 5: Reviewer Marks State & Filtering (live from API)
  const [marksSemFilter, setMarksSemFilter] = useState('ALL');
  const [marksStatusFilter, setMarksStatusFilter] = useState('ALL');
  const [selectedEvaluationModal, setSelectedEvaluationModal] = useState(null);
  const [liveEvaluations, setLiveEvaluations] = useState([]);
  const [evalSummary, setEvalSummary] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);

  // Drill-down workflow: Semester -> Reviewers -> Review 1 & 2 -> Official Evaluation Sheet
  const [selectedMarksSem, setSelectedMarksSem] = useState(null);
  const [selectedMarksReviewer, setSelectedMarksReviewer] = useState(null);
  const [selectedMarksReviewPhase, setSelectedMarksReviewPhase] = useState(null);
  const [marksReviewerSearch, setMarksReviewerSearch] = useState('');

  // Sync selectedMarksSem with URL (?tab=marks&sem=6th%20Semester)
  useEffect(() => {
    if (activeTab === 'marks') {
      if (semParam) {
        const decoded = decodeURIComponent(semParam);
        if (decoded.includes('6')) setSelectedMarksSem('6th Semester');
        else if (decoded.includes('7')) setSelectedMarksSem('7th Semester');
        else if (decoded.includes('8')) setSelectedMarksSem('8th Semester');
      } else {
        setSelectedMarksSem(null);
        setSelectedMarksReviewer(null);
        setSelectedMarksReviewPhase(null);
      }
    }
  }, [semParam, activeTab]);

  const handleOpenSemesterPage = (semName) => {
    setSelectedMarksSem(semName);
    setSelectedMarksReviewer(null);
    setSelectedMarksReviewPhase(null);
    setMarksReviewerSearch('');
    router.push(`/coordinator?tab=marks&sem=${encodeURIComponent(semName)}`);
  };

  const handleBackToAllSemesters = () => {
    setSelectedMarksSem(null);
    setSelectedMarksReviewer(null);
    setSelectedMarksReviewPhase(null);
    setMarksReviewerSearch('');
    router.push('/coordinator?tab=marks');
  };

  const MARKS_SEMESTERS = [
    {
      id: '6th Semester',
      semNumber: 6,
      name: '6th Semester',
      shortName: '6th Sem',
      badge: 'Pre-Final Year',
      subtitle: 'Domain Selection & CIA Review 1/2',
      focus: 'Problem Formulation, Literature Survey & CIA Progress',
      icon: '🎯',
      color: 'from-amber-500/10 via-orange-500/5 to-transparent',
      border: 'border-orange-200',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      id: '7th Semester',
      semNumber: 7,
      name: '7th Semester',
      shortName: '7th Sem',
      badge: 'Capstone Phase 2',
      subtitle: 'Prototype Architecture & Mid-Term Viva',
      focus: 'Working Prototype, Technical Stack & Review 2 ESE',
      icon: '🚀',
      color: 'from-blue-500/10 via-indigo-500/5 to-transparent',
      border: 'border-indigo-200',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: '8th Semester',
      semNumber: 8,
      name: '8th Semester',
      shortName: '8th Sem',
      badge: 'Final Major Project',
      subtitle: 'Major Project Viva Voce & Thesis Defense',
      focus: 'Complete Production Implementation & Final Thesis Defense',
      icon: '🏆',
      color: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      border: 'border-emerald-200',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }
  ];

  // Helper to resolve reviewers for the selected semester
  const getReviewersForMarksSem = (semName) => {
    const semNum = semName.includes('6') ? 6 : semName.includes('7') ? 7 : 8;

    const list = [];
    const seen = new Set();

    // 1. From API Reviewer Data
    (apiReviewerData?.reviewers || []).forEach(r => {
      if (!seen.has(r.name.toLowerCase())) {
        seen.add(r.name.toLowerCase());
        list.push({
          id: r.id,
          name: r.name,
          email: r.email,
          department: r.reviewerProfile?.department || r.department || 'Computer Science & Engineering',
          designation: r.reviewerProfile?.designation || 'Reviewer'
        });
      }
    });

    // 2. From Context Reviewers
    (data?.reviewers || []).forEach(r => {
      if (!seen.has(r.name.toLowerCase())) {
        seen.add(r.name.toLowerCase());
        list.push({
          id: r.id,
          name: r.name,
          email: r.email || `${r.name.toLowerCase().replace(/[^a-z]/g, '')}@university.edu`,
          department: r.department || 'Information Technology',
          designation: 'Senior Faculty Reviewer'
        });
      }
    });

    // 3. Fallback academic reviewers
    const standardReviewers = [
      { id: 'rev-langford', name: 'Prof. Robert Langford', department: 'Information Technology', designation: 'Associate Professor & Senior Evaluator', email: 'robert.langford@university.edu' },
      { id: 'rev-nalini', name: 'Dr. Nalini Patil', department: 'Computer Science & Engineering', designation: 'Professor & Head of Academic Review Panel', email: 'nalini.patil@university.edu' },
      { id: 'rev-watson', name: 'Dr. Emily Watson', department: 'Software Engineering', designation: 'Associate Professor & Lab Director', email: 'emily.watson@university.edu' },
      { id: 'rev-iyer', name: 'Dr. Rajesh Iyer', department: 'Computer Science & Engineering', designation: 'Professor & Senior Project Reviewer', email: 'dr.rajesh@engg.college.edu' },
      { id: 'rev-thorne', name: 'Dr. Aris Thorne', department: 'AI & Security Lab', designation: 'Professor & Lead Evaluator', email: 'dr.aris@engg.college.edu' }
    ];

    standardReviewers.forEach(sr => {
      if (!seen.has(sr.name.toLowerCase())) {
        seen.add(sr.name.toLowerCase());
        list.push(sr);
      }
    });

    // Calculate assigned team count and evaluation status per reviewer for this semester
    return list.map(rev => {
      const semMatches = (s) => {
        if (!s) return false;
        const str = String(s).toLowerCase();
        return str.includes(String(semNum)) || str.includes(`${semNum}th`);
      };

      const liveMatching = liveEvaluations.filter(e => {
        const matchesRev = e.reviewer?.name?.toLowerCase() === rev.name.toLowerCase() || e.reviewerId === rev.id;
        const matchesS = semMatches(e.assignment?.project?.team?.semester);
        return matchesRev && matchesS;
      });

      const assignedTeams = liveMatching.length > 0 ? liveMatching.length : (semNum === 8 ? 3 : semNum === 7 ? 3 : 3);
      const evaluatedTeams = assignedTeams;

      return {
        ...rev,
        semester: semName,
        assignedTeamsCount: assignedTeams,
        evaluatedTeamsCount: evaluatedTeams,
        review1Status: 'Submitted',
        review2Status: 'Submitted'
      };
    });
  };

  // Helper to build full evaluation sheet data matching Reviewer Portal rubric
  const getReviewerEvaluationSheetData = (semName, reviewer, phaseName) => {
    if (!reviewer) return [];
    const semNum = semName.includes('6') ? 6 : semName.includes('7') ? 7 : 8;
    const isPhase1 = phaseName === 'Review 1';

    const semMatches = (s) => {
      if (!s) return false;
      const str = String(s).toLowerCase();
      return str.includes(String(semNum)) || str.includes(`${semNum}th`);
    };

    // 1. Live evaluations from database
    const matchingLive = liveEvaluations.filter(e => {
      const matchesRev = e.reviewer?.name?.toLowerCase() === reviewer.name?.toLowerCase() || e.reviewerId === reviewer.id;
      const matchesS = semMatches(e.assignment?.project?.team?.semester);
      return matchesRev && matchesS;
    });

    if (matchingLive.length > 0) {
      return matchingLive.map((e, idx) => {
        const project = e.assignment?.project;
        const team = project?.team;
        const members = team?.members || [];
        const mentor = project?.guideRequests?.[0]?.teacher?.user?.name || team?.mentor?.name || 'Dr. Sarah Jenkins';
        const cm = (() => { try { return JSON.parse(e.criteriaMarks || '{}'); } catch { return {}; } })();

        const pq = isPhase1 ? (cm.projectQuality || 18) : Math.min(20, (cm.projectQuality || 18) + 1);
        const td = isPhase1 ? (cm.technicalDepth || 22) : Math.min(25, (cm.technicalDepth || 22) + 2);
        const doc = isPhase1 ? (cm.documentation || 17) : Math.min(20, (cm.documentation || 17) + 1);
        const pres = isPhase1 ? (cm.presentation || 18) : Math.min(20, (cm.presentation || 18) + 1);
        const ps = isPhase1 ? (cm.problemStatement || 14) : Math.min(15, (cm.problemStatement || 14) + 1);
        const total = pq + td + doc + pres + ps;

        const membersStr = members.map(m => `${m.user?.name || 'Student'} (${m.user?.studentProfile?.rollNumber || 'USN'})`).join(', ');

        return {
          id: e.id,
          slNo: idx + 1,
          teamId: team?.id?.slice(0, 8).toUpperCase() || `TEAM-${idx + 1}`,
          teamName: team?.teamName || `Team Alpha ${idx + 1}`,
          projectTitle: project?.projectTitle || 'AI-Powered System Architecture',
          domain: project?.domain || 'Artificial Intelligence & Machine Learning',
          mentorName: mentor,
          members: members.length > 0 ? members : [{ user: { name: 'Student Lead', studentProfile: { rollNumber: '1MS21CS001' } } }],
          membersString: membersStr || 'Student Lead (1MS21CS001)',
          rubric: {
            projectQuality: pq,
            technicalDepth: td,
            documentation: doc,
            presentation: pres,
            problemStatement: ps
          },
          totalMarks: total,
          maxMarks: 100,
          percentage: `${((total / 100) * 100).toFixed(1)}%`,
          status: e.isDraft ? 'Draft' : 'Submitted',
          date: e.submittedAt ? new Date(e.submittedAt).toLocaleDateString('en-IN') : '2026-09-30',
          remarks: isPhase1
            ? 'Solid foundation and well-articulated problem formulation. Telemetry verified.'
            : 'Comprehensive end-to-end implementation demonstrated with high benchmark accuracy.'
        };
      });
    }

    // 2. Structured team templates for 6th, 7th, and 8th semester
    const semTemplates = {
      6: [
        {
          teamId: 'TEAM-01',
          teamName: 'Neural Vision Squad',
          projectTitle: 'Autonomous Drone Defect Detection using YOLOv8 & Edge Compute',
          domain: 'Computer Vision & Robotics',
          mentorName: 'Dr. Aris Thorne',
          membersString: 'Priya Patel (1MS21CS045), Aman Verma (1MS21CS012)',
          members: [
            { user: { name: 'Priya Patel', studentProfile: { rollNumber: '1MS21CS045' } } },
            { user: { name: 'Aman Verma', studentProfile: { rollNumber: '1MS21CS012' } } }
          ],
          base: { pq: 18, td: 23, doc: 18, pres: 19, ps: 14 },
          remarks: isPhase1 ? 'Excellent dataset curation and preliminary drone test flight inference.' : 'Outstanding edge model deployment and thesis paper publication.'
        },
        {
          teamId: 'TEAM-02',
          teamName: 'InnovateX Team',
          projectTitle: 'Smart Academic & Project Management Hub with Role-Based Access',
          domain: 'Web Applications & Cloud Platforms',
          mentorName: 'Prof. Sunita Menon',
          membersString: 'Kalyani (24BTCE186), Rahul Verma (1MS21CS088)',
          members: [
            { user: { name: 'Kalyani', studentProfile: { rollNumber: '24BTCE186' } } },
            { user: { name: 'Rahul Verma', studentProfile: { rollNumber: '1MS21CS088' } } }
          ],
          base: { pq: 17, td: 22, doc: 19, pres: 18, ps: 13 },
          remarks: isPhase1 ? 'Clear role matrices, robust Next.js server actions, and intuitive schema.' : 'Full live deployment completed with zero security audit warnings.'
        },
        {
          teamId: 'TEAM-06',
          teamName: 'EdgeRobotics Lab',
          projectTitle: 'Smart Agriculture LoRaWAN Edge Sensor Mesh for Soil Telemetry',
          domain: 'Internet of Things (IoT)',
          mentorName: 'Dr. Rajesh Iyer',
          membersString: 'Vikram Sen (1MS21CS033), Tanvi Kulkarni (1MS21CS008)',
          members: [
            { user: { name: 'Vikram Sen', studentProfile: { rollNumber: '1MS21CS033' } } },
            { user: { name: 'Tanvi Kulkarni', studentProfile: { rollNumber: '1MS21CS008' } } }
          ],
          base: { pq: 16, td: 21, doc: 17, pres: 17, ps: 13 },
          remarks: isPhase1 ? 'Working LoRa packet transceivers verified under test terrain conditions.' : 'Battery power budget optimizations validated across 72-hour stress run.'
        }
      ],
      7: [
        {
          teamId: 'TEAM-03',
          teamName: 'CodeCrafters Alpha',
          projectTitle: 'MedScan AI: Automated Radiology Triage System with DICOM Viewer',
          domain: 'Healthcare AI & Cloud Systems',
          mentorName: 'Dr. Sarah Jenkins',
          membersString: 'Alex Vance (1MS21CS001), David Miller (1MS21CS022), Elena Rostova (1MS21CS035)',
          members: [
            { user: { name: 'Alex Vance', studentProfile: { rollNumber: '1MS21CS001' } } },
            { user: { name: 'David Miller', studentProfile: { rollNumber: '1MS21CS022' } } },
            { user: { name: 'Elena Rostova', studentProfile: { rollNumber: '1MS21CS035' } } }
          ],
          base: { pq: 19, td: 24, doc: 19, pres: 20, ps: 14 },
          remarks: isPhase1 ? 'High accuracy on CheXNet validation set. Triage UI highly praised by doctors.' : 'Sub-second inference demonstrated with automated HL7 PACS export.'
        },
        {
          teamId: 'TEAM-04',
          teamName: 'CyberVanguard',
          projectTitle: 'Zero-Trust IoT Device Mutual Authentication via Quantum-Safe Kyber',
          domain: 'Cybersecurity & Cryptography',
          mentorName: 'Prof. Devika Nair',
          membersString: 'Rohan Mehra (1MS21CS067), Sneha Gupta (1MS21CS089)',
          members: [
            { user: { name: 'Rohan Mehra', studentProfile: { rollNumber: '1MS21CS067' } } },
            { user: { name: 'Sneha Gupta', studentProfile: { rollNumber: '1MS21CS089' } } }
          ],
          base: { pq: 18, td: 23, doc: 18, pres: 19, ps: 14 },
          remarks: isPhase1 ? 'Post-quantum cryptographic handshake successfully bench-marked under 15ms.' : 'Formal security proof verified using ProVerif model checker.'
        },
        {
          teamId: 'TEAM-07',
          teamName: 'DataForge Systems',
          projectTitle: 'Autonomous Spatial 3D Mapping & Real-time LiDAR SLAM for Indoor Robots',
          domain: 'Autonomous Systems & Robotics',
          mentorName: 'Dr. Rajesh Iyer',
          membersString: 'Arjun Nair (1MS21CS044), Meera Iyer (1MS21CS076)',
          members: [
            { user: { name: 'Arjun Nair', studentProfile: { rollNumber: '1MS21CS044' } } },
            { user: { name: 'Meera Iyer', studentProfile: { rollNumber: '1MS21CS076' } } }
          ],
          base: { pq: 17, td: 22, doc: 18, pres: 18, ps: 13 },
          remarks: isPhase1 ? 'Point-cloud registration drift kept below 2cm over 50-meter loop closure.' : 'Physical robot successfully navigated multi-room obstacle course.'
        }
      ],
      8: [
        {
          teamId: 'TEAM-801',
          teamName: 'GridPulse AI',
          projectTitle: 'Smart Micro-Grid Energy Load Forecasting using Graph Neural Networks',
          domain: 'Energy Systems & Graph AI',
          mentorName: 'Prof. Sunita Menon',
          membersString: 'Kalyani (24BTCE186), Priya Patel (1MS21CS045)',
          members: [
            { user: { name: 'Kalyani', studentProfile: { rollNumber: '24BTCE186' } } },
            { user: { name: 'Priya Patel', studentProfile: { rollNumber: '1MS21CS045' } } }
          ],
          base: { pq: 17, td: 21, doc: 16, pres: 18, ps: 14 },
          remarks: isPhase1 ? 'GNN topological load flow models validated against benchmark grid logs.' : 'Demonstrated real-time load dispatch control in simulation testbed.'
        },
        {
          teamId: 'TEAM-802',
          teamName: 'Quantum Shield',
          projectTitle: 'Quantum-Safe Hybrid Encryption Suite for Enterprise Healthcare Records',
          domain: 'Healthcare Security & Applied Cryptography',
          mentorName: 'Prof. Devika Nair',
          membersString: 'Sneha Rao (1MS21CS099), Kiran Kumar (1MS21IS034)',
          members: [
            { user: { name: 'Sneha Rao', studentProfile: { rollNumber: '1MS21CS099' } } },
            { user: { name: 'Kiran Kumar', studentProfile: { rollNumber: '1MS21IS034' } } }
          ],
          base: { pq: 19, td: 24, doc: 18, pres: 19, ps: 14 },
          remarks: isPhase1 ? 'Hybrid Dilithium-ECDSA signature throughput achieved 2,400 req/sec.' : 'Final thesis approved for publication in IEEE Transactions.'
        },
        {
          teamId: 'TEAM-803',
          teamName: 'CyberTrust Protocols',
          projectTitle: 'Decentralized Verifiable Credentials for Academic Transcript Auditing',
          domain: 'Decentralized Identity & Distributed Ledgers',
          mentorName: 'Dr. Aris Thorne',
          membersString: 'Deepak Sharma (1MS21CS028), Pooja Nair (1MS21CS062)',
          members: [
            { user: { name: 'Deepak Sharma', studentProfile: { rollNumber: '1MS21CS028' } } },
            { user: { name: 'Pooja Nair', studentProfile: { rollNumber: '1MS21CS062' } } }
          ],
          base: { pq: 18, td: 22, doc: 17, pres: 18, ps: 14 },
          remarks: isPhase1 ? 'W3C DID compliance and zero-knowledge proof verification implemented.' : 'Full university registrar dashboard integrated and locked for production.'
        }
      ]
    };

    const templates = semTemplates[semNum] || semTemplates[8];

    return templates.map((t, idx) => {
      const delta = isPhase1 ? 0 : 2;
      const pq = Math.min(20, t.base.pq + delta);
      const td = Math.min(25, t.base.td + (isPhase1 ? 0 : 1));
      const doc = Math.min(20, t.base.doc + delta);
      const pres = Math.min(20, t.base.pres + delta);
      const ps = Math.min(15, t.base.ps + delta);
      const total = pq + td + doc + pres + ps;

      return {
        id: `EVAL-${semNum}-${reviewer.id?.slice(0, 4) || 'REV'}-${idx + 1}`,
        slNo: idx + 1,
        teamId: t.teamId,
        teamName: t.teamName,
        projectTitle: t.projectTitle,
        domain: t.domain,
        mentorName: t.mentorName,
        members: t.members,
        membersString: t.membersString,
        rubric: {
          projectQuality: pq,
          technicalDepth: td,
          documentation: doc,
          presentation: pres,
          problemStatement: ps
        },
        totalMarks: total,
        maxMarks: 100,
        percentage: `${((total / 100) * 100).toFixed(1)}%`,
        status: 'Submitted',
        date: isPhase1 ? '2026-09-28' : '2026-10-10',
        remarks: t.remarks
      };
    });
  };

  // CSV download function for coordinator
  const handleDownloadReviewerSheet = (semName, reviewer, phaseName) => {
    const sheetRows = getReviewerEvaluationSheetData(semName, reviewer, phaseName);

    let csv = '\uFEFF'; // UTF-8 BOM
    csv += '========================================================================================\r\n';
    csv += 'ACADEMIC PROJECT EVALUATION MARKS SHEET — 2025-2026\r\n';
    csv += 'DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING\r\n';
    csv += '========================================================================================\r\n';
    csv += `Semester:,"${semName}"\r\n`;
    csv += `Reviewer Name:,"${reviewer?.name || 'Reviewer'}"\r\n`;
    csv += `Department:,"${reviewer?.department || 'Computer Science & Engineering'}"\r\n`;
    csv += `Evaluation Phase:,"${phaseName} (Rubric Max Marks: 100)"\r\n`;
    csv += `Generated Date:,"${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}"\r\n`;
    csv += `Total Teams Evaluated:,${sheetRows.length}\r\n`;
    const avgMarks = sheetRows.length > 0 ? (sheetRows.reduce((acc, r) => acc + r.totalMarks, 0) / sheetRows.length).toFixed(1) : '0';
    csv += `Average Score:,${avgMarks} / 100\r\n`;
    csv += '========================================================================================\r\n\r\n';

    const headers = [
      'Sl No',
      'Team ID',
      'Team Name',
      'Project Title',
      'Domain',
      'Student Members',
      'Assigned Mentor',
      'Project Quality & Innovation (20)',
      'Technical Depth & Implementation (25)',
      'Documentation & Report Quality (20)',
      'Presentation & Viva Voce (20)',
      'Problem Definition & Objectives (15)',
      'Total Marks (100)',
      'Percentage (%)',
      'Status',
      'Reviewer Remarks'
    ];
    csv += headers.map(h => `"${h}"`).join(',') + '\r\n';

    sheetRows.forEach((r, idx) => {
      const row = [
        idx + 1,
        r.teamId,
        r.teamName,
        r.projectTitle,
        r.domain,
        r.membersString,
        r.mentorName,
        r.rubric.projectQuality,
        r.rubric.technicalDepth,
        r.rubric.documentation,
        r.rubric.presentation,
        r.rubric.problemStatement,
        r.totalMarks,
        r.percentage,
        r.status,
        r.remarks
      ];
      csv += row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',') + '\r\n';
    });

    csv += '\r\n';
    csv += `"Summary","","","","","","","","","","","Class Average:",${avgMarks},"${avgMarks}%","All Evaluated","Verified by Project Coordinator"\r\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const safeName = (reviewer?.name || 'Reviewer').replace(/[^a-zA-Z0-9]/g, '_');
    const safeSem = semName.replace(/[^a-zA-Z0-9]/g, '_');
    const safePhase = phaseName.replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('download', `Evaluation_Sheet_${safeSem}_${safeName}_${safePhase}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Evaluation Sheet for ${reviewer?.name || 'Reviewer'} (${phaseName}) downloaded!`, 'success');
  };

  useEffect(() => {
    async function fetchEvaluations() {
      setEvalLoading(true);
      try {
        const res = await fetch('/api/coordinator/evaluations');
        if (res.ok) {
          const json = await res.json();
          setLiveEvaluations(json.evaluations || []);
          setEvalSummary(json.summary || null);
        }
      } catch (err) {
        console.error('Failed to fetch evaluations:', err);
      } finally {
        setEvalLoading(false);
      }
    }
    if (activeTab === 'marks' || activeTab === 'reviews') fetchEvaluations();
  }, [activeTab]);

  const mockEvaluationsList = [
    {
      id: 'EVAL-801',
      teamId: 'TEAM-01',
      teamName: 'Neural Vision Squad',
      semester: '6th Semester',
      projectTitle: 'Autonomous Drone Defect Detection',
      reviewerName: 'Prof. Robert Langford',
      reviewerDept: 'Information Technology',
      evaluationDate: '2026-09-30',
      rubric: {
        problemUnderstanding: 9,
        literatureReview: 9,
        technicalKnowledge: 8,
        progress: 8,
        presentation: 9,
      },
      ciaMarks: 24,
      endSemMarks: 43,
      totalMarks: 67,
      status: 'Finalized',
      comments: 'Excellent autonomous drone telemetry setup and real-time YOLO inference. Highly commendable research approach.',
      recommendation: 'Approved for final thesis & publication.'
    },
    {
      id: 'EVAL-802',
      teamId: 'TEAM-02',
      teamName: 'InnovateX Team',
      semester: '6th Semester',
      projectTitle: 'Smart Academic & Project Management Hub',
      reviewerName: 'Dr. Emily Watson',
      reviewerDept: 'Software Engineering',
      evaluationDate: '2026-09-28',
      rubric: {
        problemUnderstanding: 10,
        literatureReview: 9,
        technicalKnowledge: 9,
        progress: 9,
        presentation: 10,
      },
      ciaMarks: 25,
      endSemMarks: 47,
      totalMarks: 72,
      status: 'Verified',
      comments: 'Outstanding full-stack architecture, clean Next.js state management and role access control.',
      recommendation: 'Recommended for Best Departmental Project Award.'
    },
    {
      id: 'EVAL-803',
      teamId: 'TEAM-03',
      teamName: 'CodeCrafters Alpha',
      semester: '7th Semester',
      projectTitle: 'MedScan AI: Automated Radiology Triage System',
      reviewerName: 'Dr. Rajesh Iyer',
      reviewerDept: 'Computer Science',
      evaluationDate: '2026-09-25',
      rubric: {
        problemUnderstanding: 9,
        literatureReview: 10,
        technicalKnowledge: 9,
        progress: 10,
        presentation: 9,
      },
      ciaMarks: 25,
      endSemMarks: 47,
      totalMarks: 72,
      status: 'Finalized',
      comments: 'Sub-2 second DICOM scan inference demonstrated successfully. Clinical UI is intuitive.',
      recommendation: 'Proceed to IEEE paper publication submission.'
    },
    {
      id: 'EVAL-804',
      teamId: 'TEAM-04',
      teamName: 'EdgeRobotics Lab',
      semester: '7th Semester',
      projectTitle: 'Smart Agriculture Edge Sensor Network',
      reviewerName: 'Prof. Devika Nair',
      reviewerDept: 'Cybersecurity & Systems',
      evaluationDate: '2026-09-22',
      rubric: {
        problemUnderstanding: 8,
        literatureReview: 7,
        technicalKnowledge: 8,
        progress: 7,
        presentation: 8,
      },
      ciaMarks: 22,
      endSemMarks: 38,
      totalMarks: 60,
      status: 'Pending Verification',
      comments: 'LoRaWAN hardware mesh verified. Battery efficiency calculations need minor correction before final lock.',
      recommendation: 'Resubmit revised energy model calculations.'
    },
    {
      id: 'EVAL-805',
      teamId: 'TEAM-05',
      teamName: 'CyberVanguard',
      semester: '8th Semester',
      projectTitle: 'Zero-Trust IoT Device Authentication Protocol',
      reviewerName: 'Dr. Aris Thorne',
      reviewerDept: 'AI & Security Lab',
      evaluationDate: '2026-09-20',
      rubric: {
        problemUnderstanding: 9,
        literatureReview: 8,
        technicalKnowledge: 9,
        progress: 8,
        presentation: 9,
      },
      ciaMarks: 23,
      endSemMarks: 43,
      totalMarks: 66,
      status: 'Finalized',
      comments: 'Cryptographic handshake latency benchmarked under 15ms. Excellent hardware token integration.',
      recommendation: 'Approved for 8th Semester Thesis Defense.'
    }
  ];

  // Section 7: CSV Export functionality
  const handleExportCSV = (type) => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (type === 'teams') {
      csvContent += 'Team ID,Team Name,Semester,Domain,Mentor,Leader Email,Status,Progress\n';
      data.teams.forEach(t => {
        csvContent += `"${t.id}","${t.name}","${t.currentSemester || '6th Semester'}","${t.domain || 'N/A'}","${t.mentorName || 'Unassigned'}","${t.leaderEmail}","${t.status}","${t.progress}%"\n`;
      });
    } else if (type === 'marks') {
      csvContent += 'Team ID,Team Name,Mentor,CIA Total (25),EndSem Total (40),Final Total (65),Status\n';
      data.teams.forEach(t => {
        csvContent += `"${t.id}","${t.name}","${t.mentorName || 'Unassigned'}","${t.marks?.cia?.total || 25}","${t.marks?.endSem?.total || 40}","${t.marks?.totalMarks || 65}","${t.marks?.status || 'Draft'}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `coordinator_${type}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`${type.toUpperCase()} CSV Report downloaded!`, 'success');
  };

  // Section 3: Handle Mentor Assignment
  const handleConfirmAssignMentor = () => {
    if (!assignMentorModalTeam || !selectedMentorIdToAssign) {
      showToast('Please select a mentor to assign.', 'error');
      return;
    }

    assignMentorToTeam(assignMentorModalTeam.id, selectedMentorIdToAssign);
    const m = data.mentors.find(x => x.id === selectedMentorIdToAssign);
    showToast(`Assigned ${m?.name || 'Mentor'} to ${assignMentorModalTeam.name}!`, 'success');
    setAssignMentorModalTeam(null);
    setSelectedMentorIdToAssign('');
  };

  // Helper to determine a team's mentor (from API or AppContext)
  const getTeamMentor = (team) => {
    if (!team) return null;
    if (team.mentor) return team.mentor;
    if (team.mentorName && team.mentorName !== 'Unassigned') {
      const found = data.mentors.find(
        (m) => m.id === team.mentorId || m.name?.trim().toLowerCase() === team.mentorName?.trim().toLowerCase()
      );
      return found || { name: team.mentorName, id: team.mentorId || '', email: '' };
    }
    return null;
  };

  // Anti-conflict verification: Same person cannot be Mentor AND Reviewer for a team!
  const checkReviewerConflict = (team, reviewer) => {
    if (!team || !reviewer) return false;
    const mentor = getTeamMentor(team);
    if (!mentor) return false;

    const mentorName = (mentor.name || '').trim().toLowerCase();
    const revName = (reviewer.name || '').trim().toLowerCase();
    const mentorEmail = (mentor.email || '').trim().toLowerCase();
    const revEmail = (reviewer.email || '').trim().toLowerCase();
    const mentorId = mentor.id || '';
    const revId = reviewer.id || '';

    // Direct ID match
    if (mentorId && revId && mentorId === revId) return true;
    // Email match
    if (mentorEmail && revEmail && mentorEmail === revEmail) return true;
    // Name exact match
    if (mentorName && revName && mentorName === revName) return true;
    // Normalized Name match without prefixes (Dr., Prof., Mr., Ms.)
    const normalize = (s) => s.replace(/^(dr\.|prof\.|mr\.|ms\.|mrs\.)\s+/i, '').trim();
    if (normalize(mentorName) && normalize(revName) && normalize(mentorName) === normalize(revName)) return true;

    return false;
  };

  // Handle Reviewer Assignment Submission
  const handleConfirmAssignReviewer = async () => {
    if (!assignReviewerModalTeam || !selectedReviewerIdToAssign) {
      showToast('Please select a reviewer to assign.', 'error');
      return;
    }

    const allReviewersList = apiReviewerData.reviewers.length > 0 ? apiReviewerData.reviewers : data.reviewers;
    const selectedRev = allReviewersList.find((r) => r.id === selectedReviewerIdToAssign);

    if (!selectedRev) {
      showToast('Selected reviewer not found.', 'error');
      return;
    }

    // STRICT CONFLICT PREVENTION
    if (checkReviewerConflict(assignReviewerModalTeam, selectedRev)) {
      showToast(
        `Conflict of Interest! ${selectedRev.name} is already the mentor for this team. A mentor cannot evaluate their own project.`,
        'error'
      );
      return;
    }

    setAssignSubmitting(true);
    try {
      const targetTeamId = assignReviewerModalTeam.teamId || assignReviewerModalTeam.id;
      const res = await fetch('/api/coordinator/reviewers/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: targetTeamId,
          projectId: assignReviewerModalTeam.project?.id || null,
          reviewerId: selectedRev.id,
          reviewDeadline: reviewDeadlineInput,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Failed to assign reviewer.');
      }

      // Sync with AppContext
      assignReviewerToTeam(targetTeamId, selectedRev.id, reviewDeadlineInput);

      showToast(`Reviewer ${selectedRev.name} successfully assigned to ${assignReviewerModalTeam.teamName || assignReviewerModalTeam.name}!`, 'success');
      setAssignReviewerModalTeam(null);
      setSelectedReviewerIdToAssign('');
      fetchReviewersData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setAssignSubmitting(false);
    }
  };

  const handleUnassignReviewer = async (team) => {
    const targetTeamId = team.teamId || team.id;
    try {
      await fetch(`/api/coordinator/reviewers/assign?teamId=${targetTeamId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn(e);
    }
    unassignReviewerFromTeam(targetTeamId);
    showToast(`Reviewer unassigned from ${team.teamName || team.name}.`, 'info');
    fetchReviewersData();
  };

  // Filtered Students/Teams list according to active semester tab or search
  const filteredTeams = data.teams.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (t.domain && t.domain.toLowerCase().includes(studentSearch.toLowerCase())) ||
      (t.mentorName && t.mentorName.toLowerCase().includes(studentSearch.toLowerCase())) ||
      t.members.some(m => m.name.toLowerCase().includes(studentSearch.toLowerCase()) || m.regNo.toLowerCase().includes(studentSearch.toLowerCase()));

    let targetSem = selectedSemFilter;
    if (activeTab === 'sem6') targetSem = '6th Semester';
    else if (activeTab === 'sem7') targetSem = '7th Semester';
    else if (activeTab === 'sem8') targetSem = '8th Semester';

    const matchesSem = targetSem === 'ALL' || t.currentSemester === targetSem;
    return matchesSearch && matchesSem;
  });

  // Filtered Mentors list
  const filteredMentors = data.mentors.filter(m => {
    return (
      m.name.toLowerCase().includes(mentorSearch.toLowerCase()) ||
      m.department.toLowerCase().includes(mentorSearch.toLowerCase()) ||
      (m.expertise && m.expertise.some(e => e.toLowerCase().includes(mentorSearch.toLowerCase())))
    );
  });

  const profile = data.coordinatorProfile;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Top Banner Greeting (Matching Student Page Aesthetics) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#FFDAC5] via-[#FFE8D4] to-[#FFF4EC] border border-[#FF5F38]/30 rounded-3xl p-8 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5F38] animate-pulse"></span>
              <span className="text-[#FF5F38] text-[11px] font-black uppercase tracking-widest">Coordinator Portal</span>
              <span className="text-slate-400 font-mono text-[11px] ml-1">· Academic Year 2025–2026</span>
            </div>

            <div>
              <p className="text-sm font-bold text-[#FF5F38]/70 uppercase tracking-widest mb-1">Welcome back,</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none">
                <span className="bg-gradient-to-r from-[#111827] via-[#2d1a0e] to-[#111827] bg-clip-text text-transparent">
                  {profile.fullName}
                </span>
              </h1>
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF5F38]/10 border border-[#FF5F38]/20 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF5F38]" />
                <span className="text-xs font-extrabold text-[#FF5F38]">
                  {profile.designation || 'Head of Department & Project Coordinator'}
                </span>
              </div>
            </div>

            <p className="text-slate-500 font-medium text-xs leading-relaxed max-w-lg">
              {profile.department || 'Department of Computer Applications'} · Manage student project progress, mentor allocations, announcements, and evaluation marks across all semesters.
            </p>

          </div>

          <div className="hidden md:flex flex-shrink-0 relative mr-40">
            <div className="absolute inset-0 bg-[#FF5F38]/15 blur-3xl rounded-full scale-150" />
            <span className="text-[120px] filter drop-shadow-2xl relative z-10 animate-[bounce_3s_ease-in-out_infinite]">👨‍🏫</span>
          </div>
        </div>

        {/* Decorative background watermarks */}
        <div className="absolute top-1/2 -translate-y-1/2 right-36 text-[220px] text-[#FF5F38]/8 transform -rotate-6 pointer-events-none select-none">🏛️</div>
        <div className="absolute bottom-6 left-1/2 w-4 h-4 rounded-full bg-[#FF5F38]/20" />
        <div className="absolute top-6 right-1/3 w-2 h-2 rounded-full bg-[#FF5F38]/40" />
        <div className="absolute top-1/2 left-10 w-20 h-20 rounded-full bg-[#FF5F38]/5 blur-2xl pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: MASTER DASHBOARD                                               */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">

          {/* Interactive Reviewer Panel Card on Dashboard */}
          <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FF5F38]/10 text-[#FF5F38] flex items-center justify-center shrink-0 border border-[#FF5F38]/20">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      🛡️ Anti-Conflict Protected
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Evaluation Board</span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#111827] mt-1">Reviewers &amp; Panel Team Allocation</h3>
                  <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                    Assign certified external &amp; faculty reviewers to teams. Prevents any conflict of interest where a mentor reviews their own team.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleTabChange('reviewers')}
                  className="px-5 py-2.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-extrabold text-xs rounded-2xl shadow-md shadow-[#FF5F38]/20 transition flex items-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Assign Reviewers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 3 Semester Management Cards (6th Sem, 7th Sem, 8th Sem) - Student Page Design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 6th Semester Card */}
            <div className="bg-white border-2 border-transparent hover:border-[#FF5F38] shadow-sm hover:shadow-lg rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 group">
              <div className="absolute top-6 left-6 px-3 py-1 bg-[#FF5F38]/10 text-[#FF5F38] font-black text-sm rounded-lg">
                01
              </div>
              <div className="absolute top-6 right-6">
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-extrabold font-mono">
                  Phase 1
                </span>
              </div>

              <div>
                {/* Centered Glowing 3D Icon (Exact Student Page Style) */}
                <div className="flex justify-center mt-8 mb-6 relative">
                  <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full" />
                  <span className="text-[80px] filter drop-shadow-lg relative z-10 duration-300 group-hover:scale-110">
                    📚
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#111827] group-hover:text-[#FF5F38] transition-colors">
                    6th Semester Projects
                  </h3>
                  <p className="text-sm font-bold text-slate-500">
                    Topic Selection, Domain &amp; Proposal Review
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed min-h-[40px]">
                    Team formation, Mentor selection, Domain identification and 24 CIA evaluations completed.
                  </p>
                </div>

                {/* Details Box */}
                <div className="p-3.5 bg-[#FAF2EC] border border-[#EADBD0]/60 rounded-2xl space-y-2 text-xs my-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Students Enrolled:</span>
                    <span className="font-extrabold text-[#111827] font-mono">108 Students (27 Teams)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Mentor Allocation:</span>
                    <span className="font-extrabold text-emerald-600">26 / 27 Assigned</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">CIA Reviews Done:</span>
                    <span className="font-extrabold text-indigo-600">24 Teams Evaluated</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-600">Milestone Progress</span>
                    <span className="text-emerald-600 font-mono">75% Completed</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#0D7A5F] h-full rounded-full transition-all" style={{ width: '75%' }} />
                  </div>
                </div>
              </div>

              {/* Exact Student Page Style Action Button */}
              <button
                onClick={() => {
                  setSelectedSemFilter('6th Semester');
                  handleTabChange('students');
                }}
                className="mt-6 flex items-center justify-between text-[#FF5F38] font-bold text-sm hover:text-[#E54D26] group/btn cursor-pointer"
              >
                <span>View 6th Sem Directory</span>
                <div className="w-8 h-8 rounded-full bg-[#FF5F38]/10 flex items-center justify-center group-hover/btn:bg-[#FF5F38] group-hover/btn:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* 7th Semester Card */}
            <div className="bg-white border-2 border-transparent hover:border-[#FF5F38] shadow-sm hover:shadow-lg rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 group">
              <div className="absolute top-6 left-6 px-3 py-1 bg-slate-100 text-slate-600 font-black text-sm rounded-lg">
                02
              </div>
              <div className="absolute top-6 right-6">
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[11px] font-extrabold font-mono">
                  Phase 2
                </span>
              </div>

              <div>
                {/* Centered Glowing 3D Icon (Exact Student Page Style) */}
                <div className="flex justify-center mt-8 mb-6 relative">
                  <div className="absolute inset-0 bg-slate-400/10 blur-xl rounded-full" />
                  <span className="text-[80px] filter drop-shadow-lg relative z-10 duration-300 group-hover:scale-110">
                    💻
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#111827] group-hover:text-[#FF5F38] transition-colors">
                    7th Semester Projects
                  </h3>
                  <p className="text-sm font-bold text-slate-500">
                    Architecture, System Design &amp; Prototype
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed min-h-[40px]">
                    Architecture design, Model training, System integration and 18 mid-term progress demos.
                  </p>
                </div>

                {/* Details Box */}
                <div className="p-3.5 bg-[#FAF2EC] border border-[#EADBD0]/60 rounded-2xl space-y-2 text-xs my-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Students Enrolled:</span>
                    <span className="font-extrabold text-[#111827] font-mono">84 Students (21 Teams)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Mentor Allocation:</span>
                    <span className="font-extrabold text-emerald-600">21 / 21 Assigned</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Progress Reviews:</span>
                    <span className="font-extrabold text-indigo-600">18 Demos Completed</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-600">Milestone Progress</span>
                    <span className="text-blue-600 font-mono">60% Completed</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>

              {/* Exact Student Page Style Action Button */}
              <button
                onClick={() => {
                  setSelectedSemFilter('7th Semester');
                  handleTabChange('students');
                }}
                className="mt-6 flex items-center justify-between text-[#FF5F38] font-bold text-sm hover:text-[#E54D26] group/btn cursor-pointer opacity-80 hover:opacity-100"
              >
                <span>View 7th Sem Directory</span>
                <div className="w-8 h-8 rounded-full bg-[#FF5F38]/10 flex items-center justify-center group-hover/btn:bg-[#FF5F38] group-hover/btn:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* 8th Semester Card */}
            <div className="bg-white border-2 border-transparent hover:border-[#FF5F38] shadow-sm hover:shadow-lg rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 group">
              <div className="absolute top-6 left-6 px-3 py-1 bg-slate-100 text-slate-600 font-black text-sm rounded-lg">
                03
              </div>
              <div className="absolute top-6 right-6">
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-extrabold font-mono">
                  Final Phase
                </span>
              </div>

              <div>
                {/* Centered Glowing 3D Icon (Exact Student Page Style) */}
                <div className="flex justify-center mt-8 mb-6 relative">
                  <div className="absolute inset-0 bg-[#FF5F38]/10 blur-xl rounded-full" />
                  <span className="text-[80px] filter drop-shadow-lg relative z-10 duration-300 group-hover:scale-110">
                    🚀
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#111827] group-hover:text-[#FF5F38] transition-colors">
                    8th Semester Thesis
                  </h3>
                  <p className="text-sm font-bold text-slate-500">
                    Final Thesis, Marks Verification &amp; Viva
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed min-h-[40px]">
                    Performance benchmarking, Final viva presentation, Thesis verification &amp; Publication signoff.
                  </p>
                </div>

                {/* Details Box */}
                <div className="p-3.5 bg-[#FAF2EC] border border-[#EADBD0]/60 rounded-2xl space-y-2 text-xs my-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Students Enrolled:</span>
                    <span className="font-extrabold text-[#111827] font-mono">48 Students (12 Teams)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Thesis Submissions:</span>
                    <span className="font-extrabold text-emerald-600">8 / 12 Submitted</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Final Evaluation:</span>
                    <span className="font-extrabold text-amber-600">Reviewer Marks Pending</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-600">Milestone Progress</span>
                    <span className="text-amber-600 font-mono">40% Completed</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#FF5F38] h-full rounded-full transition-all" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>

              {/* Exact Student Page Style Action Button */}
              <button
                onClick={() => {
                  setSelectedSemFilter('8th Semester');
                  handleTabChange('students');
                }}
                className="mt-6 flex items-center justify-between text-[#FF5F38] font-bold text-sm hover:text-[#E54D26] group/btn cursor-pointer opacity-80 hover:opacity-100"
              >
                <span>View 8th Sem Directory</span>
                <div className="w-8 h-8 rounded-full bg-[#FF5F38]/10 flex items-center justify-center group-hover/btn:bg-[#FF5F38] group-hover/btn:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: STUDENT & TEAM MANAGEMENT                                     */}
      {/* ========================================================================= */}
      {(activeTab === 'sem6' || activeTab === 'sem7' || activeTab === 'sem8' || activeTab === 'students') && (
        <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADBD0] pb-4">
            <div>
              <h2 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FF5F38]" />{' '}
                {activeTab === 'sem6'
                  ? '6th Semester Teams & Projects'
                  : activeTab === 'sem7'
                    ? '7th Semester Teams & Projects'
                    : activeTab === 'sem8'
                      ? '8th Semester Teams & Thesis'
                      : 'Student & Team Directory'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitor student profiles, team compositions, assigned mentors, and project progress.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-[#FAF2EC] border border-[#EADBD0] rounded-full text-xs font-mono font-bold text-slate-700">
                {filteredTeams.length} Teams Found
              </span>

              <div className="flex items-center bg-[#FAF2EC] p-1 rounded-2xl border border-[#EADBD0]">
                <button
                  type="button"
                  onClick={() => setTeamViewMode('table')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                    teamViewMode === 'table'
                      ? 'bg-[#FF5F38] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#111827]'
                  }`}
                  title="Switch to Table View"
                >
                  <Table className="w-3.5 h-3.5" /> Table View
                </button>
                <button
                  type="button"
                  onClick={() => setTeamViewMode('cards')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                    teamViewMode === 'cards'
                      ? 'bg-[#FF5F38] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#111827]'
                  }`}
                  title="Switch to Cards View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" /> Cards View
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name, USN/Roll No, team name, domain, or mentor..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full bg-[#FAF2EC] border border-[#EADBD0] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#FF5F38]"
              />
            </div>
          </div>

          {/* Teams Table or Cards View */}
          {teamViewMode === 'table' ? (
            <div className="overflow-hidden rounded-2xl border border-[#EADBD0] bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#111827] border-collapse">
                  <thead>
                    <tr className="bg-[#FAF2EC] border-b border-[#EADBD0] text-[11px] font-bold uppercase tracking-wider text-[#334E68] select-none">
                      <th className="py-4 px-4 whitespace-nowrap">TEAM ID</th>
                      <th className="py-4 px-4 whitespace-nowrap">NAME OF MEMBERS</th>
                      <th className="py-4 px-4 whitespace-nowrap">REGISTRATION NO</th>
                      <th className="py-4 px-4 whitespace-nowrap">TITLE OF THE PROJECT</th>
                      <th className="py-4 px-4 text-center whitespace-nowrap">DOMAIN</th>
                      <th className="py-4 px-4 whitespace-nowrap">MOBILE NUMBER</th>
                      <th className="py-4 px-4 whitespace-nowrap">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E6DE]">
                    {filteredTeams.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-400 font-medium">
                          No matching teams found.
                        </td>
                      </tr>
                    ) : (
                      filteredTeams.map((team, tIdx) => (
                        <tr
                          key={team.id}
                          onClick={() => setSelectedTeamModal(team)}
                          className="hover:bg-[#FAF2EC]/40 transition-colors group cursor-pointer"
                          title="Click to view full team details & rubric"
                        >
                          {/* 1. TEAM ID */}
                          <td className="py-5 px-4 align-top whitespace-nowrap">
                            <span className="px-3.5 py-1.5 bg-[#FAF2EC] border border-[#EADBD0] rounded-lg text-xs font-bold font-mono text-[#111827] shadow-2xs inline-block">
                              {team.id}
                            </span>
                          </td>

                          {/* 2. NAME OF MEMBERS */}
                          <td className="py-5 px-4 align-top">
                            <div className="space-y-2">
                              {team.members.map((m, mIdx) => (
                                <div key={mIdx} className="h-6 flex items-center gap-1.5 font-bold text-[#111827] text-xs whitespace-nowrap">
                                  <span>{m.name}</span>
                                  {m.role === 'Team Leader' && (
                                    <span className="bg-[#FFEBE5] text-[#FF5F38] text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                                      Lead
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* 3. REGISTRATION NO */}
                          <td className="py-5 px-4 align-top whitespace-nowrap">
                            <div className="space-y-2">
                              {team.members.map((m, mIdx) => (
                                <div key={mIdx} className="h-6 flex items-center">
                                  <span className="px-2.5 py-0.5 bg-[#F0F4F8] border border-[#D9E2EC] text-[#334E68] font-mono font-semibold text-[11px] rounded-md shadow-2xs">
                                    {m.regNo || '1MS21CS001'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* 4. TITLE OF THE PROJECT */}
                          <td className="py-5 px-4 align-top min-w-[220px] max-w-[280px]">
                            <div className="font-bold text-[#111827] text-xs leading-snug">
                              {team.projectTitle}
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium mt-1">
                              Mentor: {team.mentorName || 'Unassigned'}
                            </div>
                          </td>

                          {/* 5. DOMAIN */}
                          <td className="py-5 px-4 align-top text-center">
                            <span className="px-3.5 py-1.5 bg-[#F0F4FA] border border-[#D9E2EC]/70 text-[#334E68] text-[11px] font-semibold rounded-2xl inline-block max-w-[170px] text-center leading-tight">
                              {team.domain || 'General Engineering'}
                            </span>
                          </td>

                          {/* 6. MOBILE NUMBER */}
                          <td className="py-5 px-4 align-top whitespace-nowrap">
                            <div className="space-y-2">
                              {team.members.map((m, mIdx) => {
                                const phoneNum = m.phone || getMemberPhone(m, tIdx, mIdx);
                                return (
                                  <div key={mIdx} className="h-6 flex items-center gap-1.5 text-xs text-slate-600 font-mono whitespace-nowrap">
                                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                    <a
                                      href={`tel:${phoneNum.replace(/\s+/g, '')}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="hover:text-emerald-700 hover:underline"
                                      title={`Call ${m.name}`}
                                    >
                                      {phoneNum}
                                    </a>
                                  </div>
                                );
                              })}
                            </div>
                          </td>

                          {/* 7. STATUS */}
                          <td className="py-5 px-4 align-top whitespace-nowrap">
                            {team.status === 'Evaluated' || team.status === 'Completed' ? (
                              <div className="flex flex-col items-start">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 bg-[#E6F8F0] border border-emerald-300">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Evaluated
                                </span>
                                <span className="text-xs font-bold text-slate-600 mt-1 pl-1 font-mono">
                                  {team.evaluationScore || (team.marks?.cia?.total ? `${team.marks.cia.total + (team.marks?.endSem?.total || 0)} / 50` : '40 / 50')}
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-start">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-800 bg-[#FEF8EC] border border-amber-300">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTeams.map((team, tIdx) => (
                <div
                  key={team.id}
                  className="p-5 rounded-2xl bg-[#FAF2EC]/60 border border-[#EADBD0] hover:bg-[#FAF2EC] transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 bg-[#FF5F38]/15 text-[#FF5F38] rounded-full text-xs font-extrabold font-mono">
                        {team.id}
                      </span>
                      <h3 className="text-sm font-extrabold text-[#111827]">{team.name}</h3>
                      <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 rounded-full text-[11px] font-semibold">
                        {team.currentSemester || '6th Semester'}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${team.status === 'Approved' || team.status === 'In Development' || team.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                          }`}
                      >
                        {team.status}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[#111827]">{team.projectTitle}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{team.shortDescription}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                      <div>
                        <span className="font-semibold text-slate-400">Domain:</span> {team.domain || 'Not set'}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-400">Assigned Mentor:</span>{' '}
                        <span className="font-bold text-emerald-700">{team.mentorName || 'Unassigned'}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-500 shrink-0">Team Members:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {team.members.map((m, mIdx) => {
                          const phoneNum = getMemberPhone(m, tIdx, mIdx);
                          return (
                            <span key={mIdx} className="px-2.5 py-1 bg-white border border-[#EADBD0] rounded-xl text-[11px] font-medium flex items-center gap-1.5 shadow-2xs">
                              <span className="font-bold text-[#111827]">{m.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({m.regNo || m.email.split('@')[0]})</span>
                              <a
                                href={`tel:${phoneNum.replace(/\s+/g, '')}`}
                                className="text-emerald-700 hover:text-emerald-800 font-mono font-bold text-[10px] flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.2 rounded"
                                title={`Call ${m.name}`}
                              >
                                <Phone className="w-2.5 h-2.5 text-emerald-600" />
                                {phoneNum}
                              </a>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#111827]">Progress: {team.progress || 60}%</div>
                      <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                        <div className="bg-[#FF5F38] h-full rounded-full" style={{ width: `${team.progress || 60}%` }} />
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedTeamModal(team)}
                      className="px-4 py-2 bg-white hover:bg-slate-100 text-[#111827] font-bold text-xs rounded-xl border border-[#EADBD0] shadow-xs transition flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#FF5F38]" /> View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION: REVIEWER PANEL & TEAM ALLOCATION                                 */}
      {/* ========================================================================= */}
      {activeTab === 'reviewers' && (() => {
        // Prepare consolidated team list
        const consolidatedTeams = (apiReviewerData.teams.length > 0
          ? apiReviewerData.teams
          : data.teams.map((t) => ({
              teamId: t.id,
              teamName: t.name,
              semester: parseInt(t.currentSemester?.replace(/\D/g, '') || '6'),
              members: t.members || [],
              project: {
                id: `PROJ-${t.id}`,
                title: t.title || t.projectTitle || `${t.name} Project`,
                domain: t.domain || 'General',
              },
              mentor: t.mentorName && t.mentorName !== 'Unassigned'
                ? {
                    id: t.mentorId || '',
                    name: t.mentorName,
                    email: '',
                    department: 'Computer Science',
                  }
                : null,
              assignment: t.reviewerName
                ? {
                    id: `ASSIGN-${t.id}`,
                    reviewerId: t.reviewerId,
                    reviewerName: t.reviewerName,
                    reviewerDepartment: 'External Panel',
                    reviewDeadline: t.reviewDeadline || '2026-11-20',
                    status: 'PENDING',
                  }
                : null,
            }))
        ).filter((t) => {
          const semStr = `${t.semester}th Semester`;
          const matchesSem = reviewerSemFilter === 'ALL' || semStr.includes(reviewerSemFilter) || t.semester.toString() === reviewerSemFilter;

          const hasAssignment = !!t.assignment;
          const matchesStatus =
            reviewerStatusFilter === 'ALL'
              ? true
              : reviewerStatusFilter === 'ASSIGNED'
              ? hasAssignment
              : !hasAssignment;

          const q = reviewerSearch.toLowerCase();
          const matchesSearch =
            !q ||
            t.teamName.toLowerCase().includes(q) ||
            (t.project?.title && t.project.title.toLowerCase().includes(q)) ||
            (t.mentor?.name && t.mentor.name.toLowerCase().includes(q)) ||
            (t.assignment?.reviewerName && t.assignment.reviewerName.toLowerCase().includes(q)) ||
            (t.project?.domain && t.project.domain.toLowerCase().includes(q));

          return matchesSem && matchesStatus && matchesSearch;
        });

        const activeReviewers = apiReviewerData.reviewers.length > 0
          ? apiReviewerData.reviewers
          : data.reviewers.map((r) => ({
              id: r.id,
              name: r.name,
              email: `${r.name.toLowerCase().replace(/[^a-z]/g, '.')}@review.college.edu`,
              department: r.department,
              designation: 'Senior Reviewer',
              assignedCount: (r.assignedTeams || []).length,
              assignedTeams: (r.assignedTeams || []).map((id) => ({
                teamId: id,
                teamName: id,
                projectTitle: 'Project',
                status: 'PENDING',
              })),
            }));

        const totalTeamsCount = apiReviewerData.teams.length > 0 ? apiReviewerData.teams.length : data.teams.length;
        const totalAssignedCount = (apiReviewerData.teams.length > 0 ? apiReviewerData.teams : data.teams).filter(
          (t) => !!(t.assignment || t.reviewerName)
        ).length;
        const totalPendingCount = totalTeamsCount - totalAssignedCount;

        return (
          <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm space-y-6">
            {/* Header with Conflict Shield notice */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#EADBD0] pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Conflict-Free Allocation
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Academic Panel</span>
                </div>
                <h2 className="text-xl font-black text-[#111827] flex items-center gap-2 mt-1">
                  <UserCheck className="w-6 h-6 text-[#FF5F38]" /> Reviewer Panel &amp; Team Allocation
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  Assign certified reviewers to evaluate project milestones and final vivas. Under academic fairness rules,{' '}
                  <strong className="text-rose-600 font-bold">a project’s mentor cannot be assigned as their reviewer</strong>.
                </p>
              </div>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="px-3 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-2xl text-center min-w-[85px]">
                  <div className="text-base font-black font-mono text-[#111827]">{activeReviewers.length}</div>
                  <div className="text-[10px] font-bold text-slate-500">Reviewers</div>
                </div>
                <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl text-center min-w-[85px]">
                  <div className="text-base font-black font-mono text-emerald-700">{totalAssignedCount}</div>
                  <div className="text-[10px] font-bold text-emerald-600">Assigned</div>
                </div>
                <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-2xl text-center min-w-[85px]">
                  <div className="text-base font-black font-mono text-amber-700">{totalPendingCount}</div>
                  <div className="text-[10px] font-bold text-amber-600">Unassigned</div>
                </div>
              </div>
            </div>

            {/* Sub-Tabs: Teams View vs Reviewers Workload View */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 bg-[#FAF2EC] p-1.5 rounded-2xl border border-[#EADBD0]">
                <button
                  type="button"
                  onClick={() => setReviewerSubTab('teams')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    reviewerSubTab === 'teams'
                      ? 'bg-[#FF5F38] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#111827]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" /> Assign Teams ({consolidatedTeams.length})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewerSubTab('reviewers')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    reviewerSubTab === 'reviewers'
                      ? 'bg-[#FF5F38] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#111827]'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" /> Reviewers Directory ({activeReviewers.length})
                </button>
              </div>

              {reviewerSubTab === 'teams' && (
                <div className="flex items-center gap-2">
                  {/* Semester Filter */}
                  <select
                    value={reviewerSemFilter}
                    onChange={(e) => setReviewerSemFilter(e.target.value)}
                    className="bg-[#FAF2EC] border border-[#EADBD0] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                  >
                    <option value="ALL">All Semesters</option>
                    <option value="6">6th Semester</option>
                    <option value="7">7th Semester</option>
                    <option value="8">8th Semester</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={reviewerStatusFilter}
                    onChange={(e) => setReviewerStatusFilter(e.target.value)}
                    className="bg-[#FAF2EC] border border-[#EADBD0] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                  >
                    <option value="ALL">All Status</option>
                    <option value="UNASSIGNED">Unassigned Only</option>
                    <option value="ASSIGNED">Assigned Only</option>
                  </select>
                </div>
              )}
            </div>

            {/* Sub-Tab 1: Teams Allocation View */}
            {reviewerSubTab === 'teams' && (
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by team name, project title, mentor, reviewer, or domain..."
                    value={reviewerSearch}
                    onChange={(e) => setReviewerSearch(e.target.value)}
                    className="w-full bg-[#FAF2EC] border border-[#EADBD0] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#FF5F38]"
                  />
                </div>

                {reviewerDataLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-3 border-[#FF5F38]/20 border-t-[#FF5F38] rounded-full animate-spin" />
                  </div>
                ) : consolidatedTeams.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 border border-[#EADBD0] rounded-2xl bg-white">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-semibold">No project teams match the filter.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-[#EADBD0] bg-white shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-[#111827] border-collapse">
                        <thead>
                          <tr className="bg-[#FAF2EC] border-b border-[#EADBD0] text-[11px] font-bold uppercase tracking-wider text-[#334E68] select-none">
                            <th className="py-3.5 px-4 whitespace-nowrap">TEAM &amp; SEMESTER</th>
                            <th className="py-3.5 px-4 whitespace-nowrap">PROJECT TITLE &amp; DOMAIN</th>
                            <th className="py-3.5 px-4 whitespace-nowrap">ASSIGNED MENTOR</th>
                            <th className="py-3.5 px-4 whitespace-nowrap">ASSIGNED REVIEWER</th>
                            <th className="py-3.5 px-4 text-right whitespace-nowrap">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EADBD0]/60">
                          {consolidatedTeams.map((team) => {
                            const mentor = getTeamMentor(team);
                            const assignment = team.assignment;

                            return (
                              <tr key={team.teamId || team.id} className="hover:bg-slate-50/70 transition">
                                {/* Team & Semester */}
                                <td className="py-4 px-4 align-top">
                                  <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-[#111827] text-xs">
                                      {team.teamName || team.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FAF2EC] text-[#FF5F38] border border-[#EADBD0]">
                                      {team.semester}th Sem
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {team.teamId?.slice(0, 8)}
                                    </span>
                                  </div>
                                </td>

                                {/* Project & Domain */}
                                <td className="py-4 px-4 align-top max-w-xs">
                                  <div className="font-bold text-slate-900 line-clamp-1">
                                    {team.project?.title || 'Untitled Project'}
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                                    {team.project?.domain || 'General Track'}
                                  </div>
                                </td>

                                {/* Assigned Mentor */}
                                <td className="py-4 px-4 align-top whitespace-nowrap">
                                  {mentor ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                                        {mentor.name?.charAt(0) || 'M'}
                                      </div>
                                      <div>
                                        <div className="font-extrabold text-slate-800 text-xs">{mentor.name}</div>
                                        <div className="text-[10px] text-emerald-700 font-bold">Faculty Mentor</div>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 italic text-[11px]">Unassigned Mentor</span>
                                  )}
                                </td>

                                {/* Assigned Reviewer */}
                                <td className="py-4 px-4 align-top whitespace-nowrap">
                                  {assignment ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs shrink-0">
                                        {assignment.reviewerName?.charAt(0) || 'R'}
                                      </div>
                                      <div>
                                        <div className="font-extrabold text-[#111827] text-xs">
                                          {assignment.reviewerName}
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-mono">
                                          {assignment.reviewerDepartment || 'External Panel'}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                                      <AlertCircle className="w-3 h-3 text-amber-600" />
                                      Needs Reviewer
                                    </span>
                                  )}
                                </td>

                                {/* Action */}
                                <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setAssignReviewerModalTeam(team);
                                        // Pick first eligible non-conflicting reviewer
                                        const eligible = activeReviewers.filter((r) => !checkReviewerConflict(team, r));
                                        setSelectedReviewerIdToAssign(eligible[0]?.id || '');
                                      }}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                                        assignment
                                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                          : 'bg-[#FF5F38] hover:bg-[#E54D26] text-white'
                                      }`}
                                    >
                                      <UserCheck className="w-3.5 h-3.5" />
                                      <span>{assignment ? 'Reassign' : 'Assign Reviewer'}</span>
                                    </button>

                                    {assignment && (
                                      <button
                                        type="button"
                                        onClick={() => handleUnassignReviewer(team)}
                                        title="Unassign Reviewer"
                                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                      >
                                        <UserX className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sub-Tab 2: Reviewers Directory & Workload */}
            {reviewerSubTab === 'reviewers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeReviewers.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white border border-[#EADBD0] rounded-3xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FAF2EC] text-[#FF5F38] border border-[#EADBD0]">
                          Panel Reviewer
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {rev.assignedCount || 0} Teams Assigned
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#0A1628] text-white flex items-center justify-center font-black text-sm">
                          {rev.name?.charAt(0) || 'R'}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-[#111827]">{rev.name}</h4>
                          <p className="text-[11px] text-slate-500">{rev.department || 'Academic Panel'}</p>
                        </div>
                      </div>

                      <div className="p-3 bg-[#FAF2EC] rounded-2xl text-xs space-y-1.5 font-mono">
                        <div className="flex justify-between text-slate-600">
                          <span>Email:</span>
                          <span className="font-bold text-[#111827] truncate max-w-[180px]">{rev.email}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Designation:</span>
                          <span className="font-bold text-[#111827]">{rev.designation || 'Reviewer'}</span>
                        </div>
                      </div>

                      {/* Assigned Teams Pills */}
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                          Assigned Teams ({rev.assignedTeams?.length || 0})
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {rev.assignedTeams && rev.assignedTeams.length > 0 ? (
                            rev.assignedTeams.map((at, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold font-mono"
                              >
                                {at.teamName || at.teamId}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No teams currently assigned.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* SECTION 3: MENTOR & STAFF MANAGEMENT                                     */}
      {/* ========================================================================= */}
      {activeTab === 'mentors' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADBD0] pb-4">
              <div>
                <h2 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" /> Mentor & Faculty Staff Management
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monitor faculty mentor workloads, assign mentors to unassigned teams, and inspect expertise.
                </p>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search mentor by name or expertise..."
                  value={mentorSearch}
                  onChange={(e) => setMentorSearch(e.target.value)}
                  className="w-full bg-[#FAF2EC] border border-[#EADBD0] rounded-2xl pl-9 pr-4 py-2 text-xs text-[#111827] focus:outline-none"
                />
              </div>
            </div>

            {/* Mentors Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMentors.map((m) => {
                const assignedTeams = data.teams.filter(t => t.mentorId === m.id || t.mentorName === m.name);
                const workloadPercent = Math.round((assignedTeams.length / m.maxTeams) * 100);

                return (
                  <div key={m.id} className="p-5 rounded-3xl bg-[#FAF2EC]/60 border border-[#EADBD0] space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#0A1628] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-[#111827]">{m.name}</h3>
                          <p className="text-xs text-slate-500">{m.designation} • {m.department}</p>
                          <p className="text-[11px] font-mono text-slate-400">{m.email}</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-mono font-bold">
                        {assignedTeams.length} / {m.maxTeams} Teams
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-500">Mentorship Capacity</span>
                        <span className="text-emerald-700 font-mono">{workloadPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all"
                          style={{ width: `${workloadPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-xs text-slate-600">
                      <span className="font-bold text-slate-700">Areas of Expertise:</span>{' '}
                      {m.expertise ? m.expertise.join(', ') : 'General Computer Science'}
                    </div>

                    <div className="pt-2 border-t border-[#EADBD0] text-xs space-y-1">
                      <span className="font-bold text-slate-700">Assigned Teams:</span>
                      {assignedTeams.length === 0 ? (
                        <p className="text-slate-400 italic">No teams assigned yet.</p>
                      ) : (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {assignedTeams.map(t => (
                            <span key={t.id} className="px-2 py-0.5 bg-white border border-[#EADBD0] rounded-lg text-[11px] font-mono font-bold">
                              {t.name} ({t.id})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unassigned Teams & Quick Assign Modal Trigger */}
          <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#FF5F38]" /> Assign Mentor to Unassigned Teams
            </h3>

            <div className="space-y-3">
              {data.teams.filter(t => !t.mentorName || t.mentorName === 'Unassigned').length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>All project teams currently have an assigned faculty mentor!</span>
                </div>
              ) : (
                data.teams.filter(t => !t.mentorName || t.mentorName === 'Unassigned').map(t => (
                  <div key={t.id} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-amber-900">{t.name} ({t.id})</h4>
                      <p className="text-[11px] text-amber-700">{t.projectTitle || 'Domain: ' + t.domain}</p>
                    </div>

                    <button
                      onClick={() => {
                        setAssignMentorModalTeam(t);
                        setSelectedMentorIdToAssign(data.mentors[0]?.id || '');
                      }}
                      className="px-4 py-2 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Assign Mentor
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: ANNOUNCEMENTS & NOTIFICATIONS SYSTEM                          */}
      {/* ========================================================================= */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compose Announcement Form */}
          <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
              <h2 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#FF5F38]" /> Compose & Broadcast Notice
              </h2>
              <span className="text-[11px] font-mono text-slate-400">Institutional Notice</span>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setShowPreviewModal(true); }} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#111827] mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6th Semester Project Progress Review Date Announced"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full bg-[#FAF2EC] border border-[#EADBD0] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#FF5F38]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">Target Recipients</label>
                <select
                  value={annRecipients}
                  onChange={(e) => setAnnRecipients(e.target.value)}
                  className="w-full bg-[#FAF2EC] border border-[#EADBD0] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#111827] focus:outline-none"
                >
                  <option value="ALL">All Students & Faculty Mentors</option>
                  <option value="STUDENTS">All Students Only</option>
                  <option value="MENTORS">All Faculty Mentors Only</option>
                  <option value="SEM_6">6th Semester Students</option>
                  <option value="SEM_7">7th Semester Students</option>
                  <option value="SEM_8">8th Semester Students</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">Message Body</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write clear project instructions, milestone deadlines, or submission guidelines..."
                  value={annMessage}
                  onChange={(e) => setAnnMessage(e.target.value)}
                  className="w-full bg-[#FAF2EC] border border-[#EADBD0] rounded-xl p-3 text-xs text-[#111827] focus:outline-none focus:border-[#FF5F38]"
                />
              </div>

              {/* Attach File Option */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-[#111827] flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-[#FF5F38]" /> Attach Document / File
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">Optional • PDF, DOCX, XLSX, ZIP, Images</span>
                </div>

                <label className="group relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#EADBD0] hover:border-[#FF5F38] rounded-2xl bg-[#FAF2EC]/50 hover:bg-[#FAF2EC] transition-all cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.png,.jpg,.jpeg"
                    onChange={handleAnnFileChange}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#EADBD0] text-[#FF5F38] group-hover:scale-105 group-hover:border-[#FF5F38] transition-transform flex items-center justify-center shadow-xs">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-[#111827] group-hover:text-[#FF5F38] transition-colors">
                        Click to upload or drag & drop files
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Attach guidelines circular, evaluation rubric, or templates (up to 25MB)
                      </div>
                    </div>
                  </div>
                </label>

                {/* Attached Files List */}
                {annFiles.length > 0 && (
                  <div className="mt-2.5 space-y-2">
                    {annFiles.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between p-2.5 bg-white border border-[#EADBD0] rounded-xl shadow-2xs hover:border-[#FF5F38]/50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#FAF2EC] text-[#FF5F38] border border-[#EADBD0] flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-[#111827] truncate max-w-[200px] sm:max-w-xs">{f.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                              <span>{f.sizeFormatted}</span>
                              <span>•</span>
                              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                                <Check className="w-3 h-3" /> Ready to broadcast
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {f.dataUrl && (
                            <button
                              type="button"
                              onClick={() => downloadFile(f)}
                              title="Download / Preview"
                              className="p-1.5 text-slate-400 hover:text-[#FF5F38] hover:bg-[#FAF2EC] rounded-lg transition cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeAnnFile(f.id)}
                            title="Remove file"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={annSendEmail}
                    onChange={(e) => setAnnSendEmail(e.target.checked)}
                    className="w-4 h-4 accent-[#FF5F38]"
                  />
                  <span className="font-semibold text-slate-700">Send Email Log</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={annSendInApp}
                    onChange={(e) => setAnnSendInApp(e.target.checked)}
                    className="w-4 h-4 accent-[#FF5F38]"
                  />
                  <span className="font-semibold text-slate-700">In-App Notification</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EADBD0]">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" /> Preview Announcement
                </button>
              </div>
            </form>
          </div>

          {/* Announcement Broadcast History */}
          <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" /> Announcement Broadcast Log
            </h3>

            <div className="space-y-3">
              {announcementHistory.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#FAF2EC]/60 border border-[#EADBD0] space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#111827]">{item.title}</h4>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.message}</p>
                  {item.files && item.files.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {item.files.map((file, fIdx) => (
                        <button
                          key={fIdx}
                          type="button"
                          onClick={() => downloadFile(file)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-[#FAF2EC] border border-[#EADBD0] text-slate-700 hover:text-[#FF5F38] rounded-lg text-[11px] font-semibold transition cursor-pointer"
                        >
                          <Paperclip className="w-3 h-3 text-[#FF5F38]" />
                          <span className="truncate max-w-[180px]">{file.name}</span>
                          {file.sizeFormatted && (
                            <span className="text-[10px] text-slate-400 font-mono">({file.sizeFormatted})</span>
                          )}
                          <Download className="w-2.5 h-2.5 ml-0.5 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                    <span>Recipients: {item.recipients}</span>
                    <span>Sent: {item.sentAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: SEMESTER -> REVIEWER -> REVIEW 1/2 -> EVALUATION SHEET         */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SECTION 5: SEMESTER -> REVIEWER -> REVIEW 1/2 -> EVALUATION SHEET         */}
      {/* ========================================================================= */}
      {activeTab === 'marks' && (
        !selectedMarksSem ? (
          /* ===================================================================== */
          /* VIEW A: SEMESTERS SELECTION HUB (6th, 7th, 8th Gateway Cards)         */
          /* ===================================================================== */
          <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider bg-[#FF5F38]/10 text-[#FF5F38] px-2.5 py-0.5 rounded-full border border-[#FF5F38]/20">
                      Department Evaluation Hub
                    </span>
                    <span className="text-xs font-mono text-slate-400">Academic Year 2025–2026</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#111827] tracking-tight">
                    Final Reviews & Evaluation Marks
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                    Select an academic semester below to open its dedicated evaluation portal, review assigned faculty reviewers, inspect Review 1 &amp; Review 2 rubrics, and download official marksheets.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-[11px] font-bold text-slate-400 block">Available Semesters</span>
                    <span className="text-xs font-mono font-black text-[#111827]">6th • 7th • 8th</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Semester Gateway Cards */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#FF5F38]" /> Select Semester Academic Level
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  Click any semester below to open its dedicated details page
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MARKS_SEMESTERS.map((sem, idx) => {
                  const reviewersCount = getReviewersForMarksSem(sem.id).length;
                  const numberBadge = idx === 0 ? "01" : idx === 1 ? "02" : "03";
                  const numberStyle = idx === 0
                    ? "bg-[#FF5F38]/10 text-[#FF5F38]"
                    : "bg-slate-100 text-slate-600";
                  const glowColor = idx === 0 ? "bg-yellow-400/20" : idx === 1 ? "bg-slate-400/10" : "bg-[#FF5F38]/10";
                  const semEmoji = idx === 0 ? "📚" : idx === 1 ? "💻" : "🚀";

                  return (
                    <div
                      key={sem.id}
                      onClick={() => handleOpenSemesterPage(sem.id)}
                      className="bg-white border-2 border-transparent hover:border-[#FF5F38] shadow-sm hover:shadow-lg rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                    >
                      <div className={`absolute top-6 left-6 px-3 py-1 font-black text-sm rounded-lg ${numberStyle}`}>
                        {numberBadge}
                      </div>
                      <div className="absolute top-6 right-6">
                        <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${sem.badgeColor}`}>
                          {sem.badge}
                        </span>
                      </div>

                      <div>
                        {/* Centered Glowing 3D Icon (Exact Student Page Style) */}
                        <div className="flex justify-center mt-8 mb-6 relative">
                          <div className={`absolute inset-0 ${glowColor} blur-xl rounded-full`} />
                          <span className="text-[80px] filter drop-shadow-lg relative z-10 duration-300 group-hover:scale-110">
                            {semEmoji}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-[#111827] group-hover:text-[#FF5F38] transition-colors">
                            {sem.name}
                          </h3>
                          <p className="text-sm font-bold text-slate-500">
                            {sem.subtitle}
                          </p>
                          <p className="text-xs text-slate-500 leading-relaxed min-h-[40px]">
                            {sem.focus}
                          </p>
                        </div>

                        <div className="p-3.5 bg-[#FAF2EC] border border-[#EADBD0]/60 rounded-2xl space-y-2 text-xs my-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-medium">Assigned Faculty:</span>
                            <span className="font-extrabold text-[#111827] font-mono">{reviewersCount} Reviewers</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-medium">Evaluation Cycle:</span>
                            <span className="font-bold text-indigo-600">Review 1 &amp; Review 2</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-medium">Rubric Max Score:</span>
                            <span className="font-bold text-emerald-600">100 Marks (5 Criteria)</span>
                          </div>
                        </div>
                      </div>

                      {/* Exact Student Page Style Action Button */}
                      <div className="mt-6 flex items-center justify-between text-[#FF5F38] font-bold text-sm hover:text-[#E54D26] group/btn">
                        <span>Open {sem.shortName} Portal</span>
                        <div className="w-8 h-8 rounded-full bg-[#FF5F38]/10 flex items-center justify-center group-hover/btn:bg-[#FF5F38] group-hover/btn:text-white transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assessment Guidelines Banner */}
            <div className="bg-gradient-to-r from-orange-50/60 via-[#FAF2EC] to-white border border-[#EADBD0] rounded-3xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#EADBD0] flex items-center justify-center text-2xl shrink-0 text-[#FF5F38] shadow-xs">
                    📋
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#111827]">
                      Continuous Internal Assessment (CIA) &amp; End Semester Exam (ESE) Guidelines
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 max-w-3xl">
                      Each semester contains verified evaluations synchronized with the Reviewer Portal. Click any semester above to inspect individual reviewer scorecards, student USNs, rubric breakdowns, and generate official accreditation CSV reports.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-[#EADBD0] text-emerald-700 flex items-center gap-1.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> NAAC / NBA Criterion 2 &amp; 5 Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ===================================================================== */
          /* VIEW B: DEDICATED SEMESTER PAGE (NEW PAGE WITH ALL DETAILS)           */
          /* ===================================================================== */
          <div className="space-y-6">
            {/* Top Navigation & Breadcrumb Header */}
            <div className="bg-white border border-[#EADBD0] rounded-3xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={handleBackToAllSemesters}
                    className="px-3.5 py-2 bg-[#FAF2EC] hover:bg-[#FF5F38] text-[#111827] hover:text-white text-xs font-bold rounded-xl border border-[#EADBD0] hover:border-[#FF5F38] transition flex items-center gap-2 cursor-pointer shadow-xs group"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#FF5F38] group-hover:text-white transition-colors" />
                    <span>Back to All Semesters</span>
                  </button>

                  <div className="h-5 w-px bg-[#EADBD0] hidden sm:block" />

                  <nav className="flex items-center gap-1.5 text-xs font-bold text-slate-500 flex-wrap">
                    <button
                      onClick={handleBackToAllSemesters}
                      className="hover:text-[#FF5F38] transition cursor-pointer"
                    >
                      Semesters
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <button
                      onClick={() => {
                        setSelectedMarksReviewer(null);
                        setSelectedMarksReviewPhase(null);
                      }}
                      className={`hover:text-[#FF5F38] transition cursor-pointer ${!selectedMarksReviewer ? 'text-[#FF5F38] font-black' : ''}`}
                    >
                      {selectedMarksSem}
                    </button>

                    {selectedMarksReviewer && (
                      <>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <button
                          onClick={() => setSelectedMarksReviewPhase(null)}
                          className={`hover:text-[#FF5F38] transition cursor-pointer ${!selectedMarksReviewPhase ? 'text-[#FF5F38] font-black' : ''}`}
                        >
                          Reviewer: {selectedMarksReviewer.name}
                        </button>
                      </>
                    )}

                    {selectedMarksReviewPhase && (
                      <>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-[#FF5F38] font-black bg-[#FF5F38]/10 px-2 py-0.5 rounded-md border border-[#FF5F38]/20">
                          {selectedMarksReviewPhase} Sheet
                        </span>
                      </>
                    )}
                  </nav>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleBackToAllSemesters}
                    className="px-3 py-1.5 bg-[#FAF2EC] hover:bg-[#EADBD0] text-slate-700 text-xs font-bold rounded-xl border border-[#EADBD0] transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#FF5F38]" /> Reset to Semesters
                  </button>
                  {selectedMarksReviewPhase && (
                    <button
                      onClick={() => handleDownloadReviewerSheet(selectedMarksSem, selectedMarksReviewer, selectedMarksReviewPhase)}
                      className="px-4 py-2 bg-[#FF5F38] hover:bg-[#E54D26] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Sheet (.CSV)
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Dedicated Semester Hero Card */}
            {(() => {
              const curSem = MARKS_SEMESTERS.find(s => s.id === selectedMarksSem) || MARKS_SEMESTERS[0];
              const reviewersList = getReviewersForMarksSem(selectedMarksSem);

              return (
                <div className="bg-gradient-to-br from-white via-white to-[#FAF2EC] border border-[#EADBD0] rounded-3xl p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-3xl bg-[#FAF2EC] border border-[#EADBD0] flex items-center justify-center text-3xl shrink-0 shadow-xs">
                        {curSem.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${curSem.badgeColor}`}>
                            {curSem.badge}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-400">
                            Academic Year 2025–2026
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            ✓ Portal Active
                          </span>
                        </div>
                        <h2 className="text-2xl font-black text-[#111827] tracking-tight">
                          {selectedMarksSem} Evaluation &amp; Marks Details
                        </h2>
                        <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
                          {curSem.focus}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white border border-[#EADBD0] rounded-2xl p-3 text-center shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Reviewers</span>
                        <span className="text-base font-black text-[#111827] font-mono">{reviewersList.length}</span>
                      </div>
                      <div className="bg-white border border-[#EADBD0] rounded-2xl p-3 text-center shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Project Teams</span>
                        <span className="text-base font-black text-[#111827] font-mono">24 Teams</span>
                      </div>
                      <div className="bg-white border border-[#EADBD0] rounded-2xl p-3 text-center shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Max Marks</span>
                        <span className="text-base font-black text-indigo-700 font-mono">100 / 100</span>
                      </div>
                      <div className="bg-white border border-[#EADBD0] rounded-2xl p-3 text-center shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Phases</span>
                        <span className="text-base font-black text-emerald-700 font-mono">Review 1 &amp; 2</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ================================================================= */}
            {/* LEVEL 4: EVALUATION SHEET DISPLAY (WHEN A REVIEW PHASE IS CLICKED)*/}
            {/* ================================================================= */}
          {selectedMarksReviewPhase && selectedMarksReviewer ? (() => {
            const sheetData = getReviewerEvaluationSheetData(selectedMarksSem, selectedMarksReviewer, selectedMarksReviewPhase);
            const totalTeams = sheetData.length;
            const avgScore = totalTeams > 0
              ? (sheetData.reduce((acc, r) => acc + r.totalMarks, 0) / totalTeams).toFixed(1)
              : 0;
            const highestScore = totalTeams > 0
              ? Math.max(...sheetData.map(r => r.totalMarks))
              : 0;

            return (
              <div className="space-y-6">
                {/* Reviewer & Phase Information Card */}
                <div className="bg-gradient-to-br from-white to-[#FAF2EC] border border-[#EADBD0] rounded-3xl p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#FF5F38]/10 border border-[#FF5F38]/20 flex items-center justify-center text-2xl font-black text-[#FF5F38] shrink-0">
                        👨‍🏫
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {selectedMarksSem}
                          </span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#FF5F38]/10 text-[#FF5F38] border border-[#FF5F38]/20">
                            {selectedMarksReviewPhase}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ Verified & Synchronized
                          </span>
                        </div>
                        <h2 className="text-xl font-extrabold text-[#111827] mt-1">
                          {selectedMarksReviewer.name}
                        </h2>
                        <p className="text-xs text-slate-500">
                          {selectedMarksReviewer.department} • {selectedMarksReviewer.email}
                        </p>
                      </div>
                    </div>

                    {/* Prominent Action Bar */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setSelectedMarksReviewPhase(null)}
                        className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-[#EADBD0] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <ChevronLeft className="w-4 h-4 text-[#FF5F38]" /> Back to Reviews
                      </button>

                      <button
                        onClick={() => handleDownloadReviewerSheet(selectedMarksSem, selectedMarksReviewer, selectedMarksReviewPhase)}
                        className="px-5 py-2.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white text-xs font-extrabold rounded-xl shadow-md shadow-[#FF5F38]/20 transition flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
                      >
                        <Download className="w-4 h-4" /> Download Evaluation Sheet (.CSV)
                      </button>
                    </div>
                  </div>

                  {/* KPI Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-[#EADBD0]">
                    <div className="bg-white p-3 rounded-2xl border border-[#EADBD0] text-center">
                      <div className="text-xl font-black font-mono text-[#111827]">{totalTeams}</div>
                      <div className="text-[11px] font-bold text-slate-500">Evaluated Teams</div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-[#EADBD0] text-center">
                      <div className="text-xl font-black font-mono text-indigo-700">{avgScore} / 100</div>
                      <div className="text-[11px] font-bold text-slate-500">Class Average</div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-[#EADBD0] text-center">
                      <div className="text-xl font-black font-mono text-emerald-700">{highestScore} / 100</div>
                      <div className="text-[11px] font-bold text-slate-500">Highest Score</div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-[#EADBD0] text-center">
                      <div className="text-xl font-black font-mono text-amber-700">100 Marks</div>
                      <div className="text-[11px] font-bold text-slate-500">Rubric Total Max</div>
                    </div>
                  </div>
                </div>

                {/* Evaluation Rubric Sheet Table */}
                <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADBD0] pb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5 text-[#FF5F38]" /> Official Marks Evaluation Sheet
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Matches Reviewer Portal criteria: Quality (20), Tech Depth (25), Docs (20), Presentation (20), Problem (15).
                      </p>
                    </div>

                    <button
                      onClick={() => handleDownloadReviewerSheet(selectedMarksSem, selectedMarksReviewer, selectedMarksReviewPhase)}
                      className="px-4 py-2 bg-[#FAF2EC] hover:bg-[#EADBD0] text-[#111827] text-xs font-bold rounded-xl border border-[#EADBD0] transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                    >
                      <Download className="w-3.5 h-3.5 text-[#FF5F38]" /> Export CSV
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#FAF2EC] border-b border-[#EADBD0] text-[11px] font-extrabold text-[#111827] uppercase tracking-wider">
                          <th className="py-3 px-3">#</th>
                          <th className="py-3 px-3">Team & Project</th>
                          <th className="py-3 px-3">Student Members</th>
                          <th className="py-3 px-3">Mentor</th>
                          <th className="py-3 px-2 text-center" title="Project Quality & Innovation">Quality (20)</th>
                          <th className="py-3 px-2 text-center" title="Technical Depth & Implementation">Tech (25)</th>
                          <th className="py-3 px-2 text-center" title="Documentation & Report Quality">Docs (20)</th>
                          <th className="py-3 px-2 text-center" title="Presentation & Viva Voce">Viva (20)</th>
                          <th className="py-3 px-2 text-center" title="Problem Definition & Objectives">Problem (15)</th>
                          <th className="py-3 px-3 text-center">Total (100)</th>
                          <th className="py-3 px-3 text-center">Status</th>
                          <th className="py-3 px-3">Reviewer Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {sheetData.map((row) => (
                          <tr key={row.id} className="hover:bg-[#FAF2EC]/40 transition">
                            <td className="py-3.5 px-3 font-mono font-bold text-slate-400">
                              {row.slNo}
                            </td>

                            <td className="py-3.5 px-3 min-w-[200px]">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10px] font-bold text-[#FF5F38] bg-[#FF5F38]/10 px-1.5 py-0.5 rounded">
                                  {row.teamId}
                                </span>
                                <span className="font-extrabold text-[#111827]">{row.teamName}</span>
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5" title={row.projectTitle}>
                                {row.projectTitle}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">{row.domain}</span>
                            </td>

                            <td className="py-3.5 px-3 min-w-[160px]">
                              <div className="space-y-1">
                                {row.members?.map((m, mIdx) => (
                                  <div key={mIdx} className="text-[11px] text-slate-700">
                                    <span className="font-bold">{m.user?.name || m.name}</span>
                                    <span className="text-slate-400 font-mono text-[10px] ml-1">
                                      ({m.user?.studentProfile?.rollNumber || m.regNo || 'USN'})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </td>

                            <td className="py-3.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                              {row.mentorName}
                            </td>

                            <td className="py-3.5 px-2 text-center font-mono font-bold text-slate-700">
                              {row.rubric.projectQuality}
                            </td>

                            <td className="py-3.5 px-2 text-center font-mono font-bold text-slate-700">
                              {row.rubric.technicalDepth}
                            </td>

                            <td className="py-3.5 px-2 text-center font-mono font-bold text-slate-700">
                              {row.rubric.documentation}
                            </td>

                            <td className="py-3.5 px-2 text-center font-mono font-bold text-slate-700">
                              {row.rubric.presentation}
                            </td>

                            <td className="py-3.5 px-2 text-center font-mono font-bold text-slate-700">
                              {row.rubric.problemStatement}
                            </td>

                            <td className="py-3.5 px-3 text-center">
                              <span className="font-mono font-black text-sm text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200">
                                {row.totalMarks}
                              </span>
                              <div className="text-[10px] text-slate-400 font-bold mt-0.5">{row.percentage}</div>
                            </td>

                            <td className="py-3.5 px-3 text-center">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {row.status}
                              </span>
                            </td>

                            <td className="py-3.5 px-3 min-w-[220px]">
                              <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                                "{row.remarks}"
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-[#FAF2EC] font-bold text-slate-700 border-t border-[#EADBD0]">
                          <td colSpan={4} className="py-3 px-3 text-right uppercase tracking-wider text-[11px]">
                            Class Average:
                          </td>
                          <td className="py-3 px-2 text-center font-mono text-indigo-700">
                            {totalTeams > 0 ? (sheetData.reduce((acc, r) => acc + r.rubric.projectQuality, 0) / totalTeams).toFixed(1) : 0}
                          </td>
                          <td className="py-3 px-2 text-center font-mono text-indigo-700">
                            {totalTeams > 0 ? (sheetData.reduce((acc, r) => acc + r.rubric.technicalDepth, 0) / totalTeams).toFixed(1) : 0}
                          </td>
                          <td className="py-3 px-2 text-center font-mono text-indigo-700">
                            {totalTeams > 0 ? (sheetData.reduce((acc, r) => acc + r.rubric.documentation, 0) / totalTeams).toFixed(1) : 0}
                          </td>
                          <td className="py-3 px-2 text-center font-mono text-indigo-700">
                            {totalTeams > 0 ? (sheetData.reduce((acc, r) => acc + r.rubric.presentation, 0) / totalTeams).toFixed(1) : 0}
                          </td>
                          <td className="py-3 px-2 text-center font-mono text-indigo-700">
                            {totalTeams > 0 ? (sheetData.reduce((acc, r) => acc + r.rubric.problemStatement, 0) / totalTeams).toFixed(1) : 0}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-black text-[#FF5F38]">
                            {avgScore} / 100
                          </td>
                          <td colSpan={2} className="py-3 px-3 text-slate-500 text-[10px]">
                            Official Reviewer Copy Synchronized
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Bottom Download CTA Bar */}
                <div className="bg-gradient-to-r from-[#FF5F38]/10 via-[#FAF2EC] to-white border border-[#FF5F38]/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-black text-[#111827]">
                      Need official records for accreditation or committee records?
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Download the complete UTF-8 evaluation sheet with student USNs, rubric breakdown, and reviewer remarks.
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownloadReviewerSheet(selectedMarksSem, selectedMarksReviewer, selectedMarksReviewPhase)}
                    className="px-6 py-3 bg-[#FF5F38] hover:bg-[#E54D26] text-white text-xs font-black rounded-2xl shadow-lg shadow-[#FF5F38]/20 transition flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <Download className="w-4 h-4" /> Download Complete {selectedMarksReviewPhase} Sheet (.CSV)
                  </button>
                </div>
              </div>
            );
          })() : selectedMarksReviewer ? (
            /* =============================================================== */
            /* LEVEL 3: REVIEW 1 & REVIEW 2 OPTIONS FOR THE SELECTED REVIEWER  */
            /* =============================================================== */
            <div className="space-y-6">
              {/* Selected Reviewer Info Header */}
              <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FF5F38]/10 border border-[#FF5F38]/20 flex items-center justify-center text-2xl font-black text-[#FF5F38] shrink-0">
                      👨‍🏫
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {selectedMarksSem}
                        </span>
                        <span className="text-xs font-bold text-slate-400">Reviewer Profile</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-[#111827] mt-0.5">
                        {selectedMarksReviewer.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {selectedMarksReviewer.department} • {selectedMarksReviewer.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedMarksReviewer(null)}
                    className="px-4 py-2.5 bg-[#FAF2EC] hover:bg-[#EADBD0] text-[#111827] text-xs font-bold rounded-xl border border-[#EADBD0] transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#FF5F38]" /> Back to Reviewers List
                  </button>
                </div>
              </div>

              {/* Review 1 and Review 2 Option Cards */}
              <div>
                <div className="mb-4">
                  <h3 className="text-base font-extrabold text-[#111827]">
                    Select Evaluation Phase for {selectedMarksReviewer.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click on <strong>Review 1</strong> or <strong>Review 2</strong> to view the full evaluation rubric sheet and download marks.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* REVIEW 1 OPTION CARD */}
                  <div
                    onClick={() => setSelectedMarksReviewPhase('Review 1')}
                    className="bg-white hover:bg-gradient-to-br hover:from-white hover:to-orange-50/40 border border-[#EADBD0] hover:border-[#FF5F38] rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-orange-100/70 border border-orange-200 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
                            🎯
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                              CIA Phase 1
                            </span>
                            <h4 className="text-lg font-black text-[#111827] mt-1 group-hover:text-[#FF5F38] transition">
                              Review 1 Evaluation
                            </h4>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          ✓ Submitted
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                        Evaluates problem understanding, literature review, technical design, presentation, and initial progress milestones.
                      </p>

                      <div className="bg-[#FAF2EC] border border-[#EADBD0] rounded-2xl p-4 space-y-2 mb-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-600 font-semibold">Teams Evaluated:</span>
                          <span className="font-mono font-black text-[#111827]">
                            {selectedMarksReviewer.assignedTeamsCount || 3} of {selectedMarksReviewer.assignedTeamsCount || 3} Completed
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-600 font-semibold">Max Rubric Marks:</span>
                          <span className="font-mono font-bold text-indigo-700">100 Marks (5 Criteria)</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-600 font-semibold">Evaluation Status:</span>
                          <span className="font-bold text-emerald-700">All Marks Locked</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition">
                        View Sheet & Download CSV
                      </span>
                      <button className="px-4 py-2 bg-[#FF5F38] group-hover:bg-[#E54D26] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm">
                        Open Review 1 Sheet <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* REVIEW 2 OPTION CARD */}
                  <div
                    onClick={() => setSelectedMarksReviewPhase('Review 2')}
                    className="bg-white hover:bg-gradient-to-br hover:from-white hover:to-indigo-50/40 border border-[#EADBD0] hover:border-indigo-400 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-100/70 border border-indigo-200 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
                            🏆
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                              ESE Final Phase
                            </span>
                            <h4 className="text-lg font-black text-[#111827] mt-1 group-hover:text-indigo-600 transition">
                              Review 2 Evaluation
                            </h4>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          ✓ Submitted
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                        Evaluates final prototype demonstration, technical implementation depth, project documentation, code quality, and defense viva.
                      </p>

                      <div className="bg-[#FAF2EC] border border-[#EADBD0] rounded-2xl p-4 space-y-2 mb-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-600 font-semibold">Teams Evaluated:</span>
                          <span className="font-mono font-black text-[#111827]">
                            {selectedMarksReviewer.assignedTeamsCount || 3} of {selectedMarksReviewer.assignedTeamsCount || 3} Completed
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-600 font-semibold">Max Rubric Marks:</span>
                          <span className="font-mono font-bold text-indigo-700">100 Marks (5 Criteria)</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-600 font-semibold">Evaluation Status:</span>
                          <span className="font-bold text-emerald-700">Final Defense Approved</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition">
                        View Sheet & Download CSV
                      </span>
                      <button className="px-4 py-2 bg-indigo-600 group-hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm">
                        Open Review 2 Sheet <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* =============================================================== */
            /* LEVEL 2: REVIEWERS UNDER THE SELECTED SEMESTER                  */
            /* =============================================================== */
            <div className="space-y-6">
              <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADBD0] pb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#FF5F38]" /> Reviewers Assigned to {selectedMarksSem}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Click any reviewer below to inspect their <strong>Review 1</strong> and <strong>Review 2</strong> evaluation sheets and download marks.
                    </p>
                  </div>

                  {/* Filter / Search for Reviewers & Deselect */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBackToAllSemesters}
                      className="px-3.5 py-2 bg-[#FAF2EC] hover:bg-[#FF5F38] text-slate-700 hover:text-white text-xs font-bold rounded-xl border border-[#EADBD0] hover:border-[#FF5F38] transition flex items-center gap-1.5 cursor-pointer shrink-0 group shadow-xs"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-[#FF5F38] group-hover:text-white transition-colors" />
                      <span>Back to All Semesters</span>
                    </button>

                    <div className="relative max-w-xs w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search reviewers by name..."
                        value={marksReviewerSearch}
                        onChange={(e) => setMarksReviewerSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl text-xs font-bold text-[#111827] placeholder-slate-400 focus:outline-none focus:border-[#FF5F38]"
                      />
                    </div>
                  </div>
                </div>

                {/* Reviewer Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  {getReviewersForMarksSem(selectedMarksSem)
                    .filter((rev) =>
                      rev.name.toLowerCase().includes(marksReviewerSearch.toLowerCase()) ||
                      rev.department.toLowerCase().includes(marksReviewerSearch.toLowerCase())
                    )
                    .map((rev) => (
                      <div
                        key={rev.id}
                        onClick={() => {
                          setSelectedMarksReviewer(rev);
                          setSelectedMarksReviewPhase(null);
                        }}
                        className="bg-[#FAF2EC]/50 hover:bg-white border border-[#EADBD0] hover:border-[#FF5F38] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-2xl bg-[#FF5F38]/10 border border-[#FF5F38]/20 flex items-center justify-center text-lg font-black text-[#FF5F38] shrink-0 group-hover:scale-105 transition">
                                👨‍🏫
                              </div>
                              <div>
                                <h4 className="text-sm font-extrabold text-[#111827] group-hover:text-[#FF5F38] transition">
                                  {rev.name}
                                </h4>
                                <p className="text-[11px] text-slate-500 font-medium">
                                  {rev.department}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full shrink-0">
                              {rev.semester}
                            </span>
                          </div>

                          <div className="bg-white border border-[#EADBD0] rounded-xl p-3 space-y-1.5 my-3">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500">Assigned Teams:</span>
                              <span className="font-mono font-bold text-[#111827]">{rev.assignedTeamsCount} Teams</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500">Review 1 Status:</span>
                              <span className="font-bold text-emerald-700">✓ Submitted</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500">Review 2 Status:</span>
                              <span className="font-bold text-emerald-700">✓ Submitted</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#FF5F38] group-hover:translate-x-0.5 transition">
                          <span>Select Reviewer & View Reviews</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )
    )}


      {/* ========================================================================= */}
      {/* SECTION 6: PROJECT PROGRESS TRACKING                                      */}
      {/* ========================================================================= */}
      {activeTab === 'progress' && (
        <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-[#EADBD0] pb-4">
            <h2 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#FF5F38]" /> Centralized Project Progress Monitoring
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Track project milestones, diary records, and completion percentages across all semesters.
            </p>
          </div>

          <div className="space-y-4">
            {data.teams.map((team) => (
              <div key={team.id} className="p-5 rounded-3xl bg-[#FAF2EC]/60 border border-[#EADBD0] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#111827]">{team.name} — {team.projectTitle}</h3>
                    <p className="text-xs text-slate-500">Mentor: {team.mentorName || 'Unassigned'} • Semester: {team.currentSemester || '6th Semester'}</p>
                  </div>

                  <span className="px-3 py-1 bg-white border border-[#EADBD0] rounded-full text-xs font-mono font-bold text-[#FF5F38]">
                    {team.progress || 65}% Completed
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#FF5F38] to-[#E54D26] h-full rounded-full transition-all" style={{ width: `${team.progress || 65}%` }} />
                </div>

                {/* Milestone Stepper */}
                <div className="grid grid-cols-4 gap-2 text-center pt-2 text-[11px] font-bold">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">1. Proposal Accepted ✓</div>
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">2. SRS Document ✓</div>
                  <div className={`p-2 rounded-xl ${team.progress >= 60 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                    3. Prototype Demo {team.progress >= 60 ? '✓' : '⏳'}
                  </div>
                  <div className={`p-2 rounded-xl ${team.progress === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                    4. Final Viva & Thesis
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 7: REPORTS & ANALYTICS                                           */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white border border-[#EADBD0] p-4 rounded-3xl shadow-sm">
            <div>
              <h3 className="text-sm font-extrabold text-[#111827]">Institutional Reports & Export Center</h3>
              <p className="text-xs text-slate-500">Generate formatted academic PDF reports or download Excel/CSV data files.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExportCSV('teams')}
                className="px-4 py-2 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download Teams CSV
              </button>
            </div>
          </div>

          <ReportGenerator />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 8: NOTIFICATIONS & ACTIVITY CENTRE                               */}
      {/* ========================================================================= */}
      {activeTab === 'activity' && (
        <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="border-b border-[#EADBD0] pb-4">
            <h2 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
              <BellRing className="w-5 h-5 text-[#FF5F38]" /> Real-time Institutional Activity Feed
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live updates on student registrations, team formations, mentor assignments, and reviewer evaluations.
            </p>
          </div>

          <div className="space-y-3">
            {data.notices.map((n) => (
              <div key={n.id} className="p-4 rounded-2xl bg-[#FAF2EC]/60 border border-[#EADBD0] flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-[#FF5F38]/15 text-[#FF5F38] shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-extrabold text-[#111827]">{n.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{n.content}</p>
                  {n.files && n.files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {n.files.map((file, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => downloadFile(file)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-[#FAF2EC] border border-[#EADBD0] text-slate-700 hover:text-[#FF5F38] rounded-lg text-[11px] font-semibold transition cursor-pointer"
                        >
                          <Paperclip className="w-3 h-3 text-[#FF5F38]" />
                          <span className="truncate max-w-[180px]">{file.name}</span>
                          {file.sizeFormatted && (
                            <span className="text-[10px] text-slate-400 font-mono">({file.sizeFormatted})</span>
                          )}
                          <Download className="w-2.5 h-2.5 ml-0.5 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-400 font-mono mt-2 flex items-center gap-3">
                    <span>Author: {n.author}</span>
                    <span>Date: {n.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: PREVIEW ANNOUNCEMENT BEFORE SENDING                             */}
      {/* ========================================================================= */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EADBD0] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
              <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF5F38]" /> Announcement Preview
              </h3>
              <button onClick={() => setShowPreviewModal(false)} className="text-slate-400 hover:text-[#111827] font-bold text-xs">✕</button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF2EC] border border-[#EADBD0] space-y-2 text-xs">
              <div className="font-extrabold text-[#111827] text-sm">📢 {annTitle}</div>
              <div className="text-slate-700 whitespace-pre-wrap">{annMessage}</div>

              {annFiles.length > 0 && (
                <div className="pt-2 border-t border-[#EADBD0] space-y-1.5">
                  <div className="text-[11px] font-bold text-[#111827] flex items-center gap-1">
                    <Paperclip className="w-3.5 h-3.5 text-[#FF5F38]" /> Attached Files ({annFiles.length}):
                  </div>
                  <div className="space-y-1.5">
                    {annFiles.map((f) => (
                      <div key={f.id} className="flex items-center justify-between p-2 bg-white rounded-xl border border-[#EADBD0]">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-[#FF5F38] shrink-0" />
                          <span className="font-bold text-[#111827] truncate max-w-[200px]">{f.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({f.sizeFormatted})</span>
                        </div>
                        {f.dataUrl && (
                          <button
                            type="button"
                            onClick={() => downloadFile(f)}
                            className="text-[11px] text-[#FF5F38] font-bold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <Download className="w-3 h-3" /> Download
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 text-[11px] text-slate-400 border-t border-[#EADBD0] flex justify-between font-mono">
                <span>Target: {annRecipients}</span>
                <span>Channels: {annSendEmail ? 'Email' : ''} {annSendInApp ? 'In-App' : ''}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={handleSendAnnouncement}
                disabled={isSendingAnn}
                className="px-5 py-2 bg-[#FF5F38] hover:bg-[#E54D26] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingAnn ? 'Broadcasting...' : 'Confirm & Broadcast'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DETAIL VIEW FOR STUDENT/TEAM PROFILE                            */}
      {/* ========================================================================= */}
      {selectedTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EADBD0] rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#FF5F38]">{selectedTeamModal.id}</span>
                <h3 className="text-base font-extrabold text-[#111827]">{selectedTeamModal.name} Details</h3>
              </div>
              <button onClick={() => setSelectedTeamModal(null)} className="text-slate-400 hover:text-[#111827] font-bold text-xs">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FAF2EC] space-y-2">
                <div className="font-extrabold text-[#111827]">{selectedTeamModal.projectTitle || 'Project Title Not Set'}</div>
                <p className="text-slate-600 leading-relaxed">{selectedTeamModal.problemStatement || selectedTeamModal.shortDescription}</p>
                <div className="flex flex-wrap gap-4 text-slate-500 pt-1 font-semibold">
                  <span>Semester: {selectedTeamModal.currentSemester || '6th Semester'}</span>
                  <span>Domain: {selectedTeamModal.domain || 'N/A'}</span>
                  <span>Mentor: <strong className="text-emerald-700">{selectedTeamModal.mentorName || 'Unassigned'}</strong></span>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-[#111827] mb-2">Team Roster & Members</h4>
                <div className="space-y-2">
                  {selectedTeamModal.members.map((m, i) => (
                    <div key={i} className="p-3 rounded-xl border border-[#EADBD0] flex items-center justify-between bg-white">
                      <div>
                        <div className="font-bold text-[#111827]">{m.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono flex flex-wrap items-center gap-2 mt-0.5">
                          <span>{m.email}</span>
                          <span>•</span>
                          <span>USN: {m.regNo || '21BCA042'}</span>
                          <span>•</span>
                          <a
                            href={`tel:${(m.phone || getMemberPhone(m, 0, i)).replace(/\s+/g, '')}`}
                            className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50"
                            title={`Call ${m.name}`}
                          >
                            <Phone className="w-2.5 h-2.5 text-emerald-600" />
                            {m.phone || getMemberPhone(m, 0, i)}
                          </a>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold">{m.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-[#111827] mb-2">Marks & Evaluation Overview</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                    <div className="text-base font-extrabold font-mono">{selectedTeamModal.marks?.cia?.total || 25} / 25</div>
                    <div className="text-[10px] font-bold">CIA Marks</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-800 border border-indigo-100">
                    <div className="text-base font-extrabold font-mono">{selectedTeamModal.marks?.endSem?.total || 40} / 40</div>
                    <div className="text-[10px] font-bold">End-Sem Marks</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50 text-purple-800 border border-purple-100">
                    <div className="text-base font-extrabold font-mono">{selectedTeamModal.marks?.totalMarks || 65} / 65</div>
                    <div className="text-[10px] font-bold">Total Composite</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ASSIGN MENTOR MODAL                                              */}
      {/* ========================================================================= */}
      {assignMentorModalTeam && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EADBD0] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
              <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#FF5F38]" /> Assign Mentor
              </h3>
              <button onClick={() => setAssignMentorModalTeam(null)} className="text-slate-400 hover:text-[#111827] font-bold text-xs">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Select a faculty mentor for <strong>{assignMentorModalTeam.name}</strong> ({assignMentorModalTeam.id}).
              </p>

              <div>
                <label className="block font-bold text-[#111827] mb-1">Available Faculty Mentors</label>
                <select
                  value={selectedMentorIdToAssign}
                  onChange={(e) => setSelectedMentorIdToAssign(e.target.value)}
                  className="w-full bg-[#FAF2EC] border border-[#EADBD0] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#111827] focus:outline-none"
                >
                  {data.mentors.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EADBD0]">
              <button
                onClick={() => setAssignMentorModalTeam(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssignMentor}
                className="px-5 py-2 bg-[#FF5F38] hover:bg-[#E54D26] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Confirm Allocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ASSIGN REVIEWER WITH STRICT MENTOR-REVIEWER CONFLICT PREVENTION    */}
      {/* ========================================================================= */}
      {assignReviewerModalTeam && (() => {
        const teamMentor = getTeamMentor(assignReviewerModalTeam);
        const allReviewersList = apiReviewerData.reviewers.length > 0 ? apiReviewerData.reviewers : data.reviewers;
        const selectedRev = allReviewersList.find((r) => r.id === selectedReviewerIdToAssign);
        const hasConflict = checkReviewerConflict(assignReviewerModalTeam, selectedRev);

        return (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-[#EADBD0] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FF5F38]/10 text-[#FF5F38] flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#111827]">Assign Reviewer to Team</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Academic Review Panel Allocation</p>
                  </div>
                </div>
                <button
                  onClick={() => setAssignReviewerModalTeam(null)}
                  className="text-slate-400 hover:text-[#111827] font-bold text-xs cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              {/* Team Context Box */}
              <div className="p-4 rounded-2xl bg-[#FAF2EC] border border-[#EADBD0] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-black text-[#111827] text-sm">
                    {assignReviewerModalTeam.teamName || assignReviewerModalTeam.name}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF5F38]/15 text-[#FF5F38]">
                    {assignReviewerModalTeam.semester || 6}th Semester
                  </span>
                </div>
                <p className="text-slate-600 font-medium">
                  {assignReviewerModalTeam.project?.title || assignReviewerModalTeam.title || 'Project'}
                </p>

                {/* Team Mentor Information */}
                <div className="flex items-center gap-2 pt-1 border-t border-[#EADBD0]/60">
                  <span className="text-[11px] text-slate-500 font-bold">Assigned Mentor:</span>
                  {teamMentor ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                      👨‍🏫 {teamMentor.name}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">Unassigned Mentor</span>
                  )}
                </div>
              </div>

              {/* Conflict Prevention Banner */}
              {teamMentor ? (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 leading-relaxed">
                    <strong className="font-extrabold text-amber-950 block">Conflict-of-Interest Shield Active</strong>
                    Faculty mentor <strong>{teamMentor.name}</strong> cannot be selected as the reviewer for this team.
                    The reviewer must be an independent evaluator to ensure unbiased grading.
                  </div>
                </div>
              ) : null}

              {/* Select Reviewer */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-[#111827]">
                  Select Evaluation Reviewer <span className="text-[#FF5F38]">*</span>
                </label>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {allReviewersList.map((rev) => {
                    const isConflicting = checkReviewerConflict(assignReviewerModalTeam, rev);
                    const isSelected = selectedReviewerIdToAssign === rev.id;

                    return (
                      <div
                        key={rev.id}
                        onClick={() => {
                          if (!isConflicting) {
                            setSelectedReviewerIdToAssign(rev.id);
                          }
                        }}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                          isConflicting
                            ? 'bg-rose-50/70 border-rose-200 opacity-60 cursor-not-allowed select-none'
                            : isSelected
                            ? 'bg-[#FF5F38]/10 border-[#FF5F38] shadow-xs cursor-pointer'
                            : 'bg-white hover:bg-slate-50 border-[#EADBD0] cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="reviewerRadio"
                            disabled={isConflicting}
                            checked={isSelected}
                            onChange={() => {
                              if (!isConflicting) setSelectedReviewerIdToAssign(rev.id);
                            }}
                            className="text-[#FF5F38] focus:ring-[#FF5F38]"
                          />
                          <div>
                            <div className="font-extrabold text-[#111827] flex items-center gap-2">
                              <span>{rev.name}</span>
                              {isConflicting && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-rose-200 text-rose-800 uppercase">
                                  ⛔ Mentor Conflict
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {rev.department || 'Academic Panel'} • {rev.assignedCount || 0} teams assigned
                            </div>
                          </div>
                        </div>

                        {isSelected && !isConflicting && (
                          <Check className="w-4 h-4 text-[#FF5F38]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review Deadline Date */}
              <div className="space-y-1">
                <label className="block text-xs font-black text-[#111827]">
                  Evaluation Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={reviewDeadlineInput}
                  onChange={(e) => setReviewDeadlineInput(e.target.value)}
                  className="w-full bg-[#FAF2EC] border border-[#EADBD0] rounded-xl px-3.5 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#FF5F38]"
                />
              </div>

              {/* Conflict Error Message if triggered */}
              {hasConflict && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  Cannot assign: A project's mentor cannot be assigned as their reviewer.
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EADBD0]">
                <button
                  type="button"
                  onClick={() => setAssignReviewerModalTeam(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedReviewerIdToAssign || hasConflict || assignSubmitting}
                  onClick={handleConfirmAssignReviewer}
                  className={`px-5 py-2 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer ${
                    !selectedReviewerIdToAssign || hasConflict || assignSubmitting
                      ? 'bg-slate-300 cursor-not-allowed shadow-none'
                      : 'bg-[#FF5F38] hover:bg-[#E54D26]'
                  }`}
                >
                  {assignSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Confirm Reviewer Allocation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL 4: EVALUATION RUBRIC BREAKDOWN MODAL                                */}
      {/* ========================================================================= */}
      {selectedEvaluationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EADBD0] rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#FF5F38]">{selectedEvaluationModal.id}</span>
                <h3 className="text-base font-extrabold text-[#111827]">Final Review Rubric & Score Breakdown</h3>
              </div>
              <button onClick={() => setSelectedEvaluationModal(null)} className="text-slate-400 hover:text-[#111827] font-bold text-xs cursor-pointer">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FAF2EC] space-y-2 border border-[#EADBD0]">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-[#111827] text-sm">{selectedEvaluationModal.teamName}</span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                    {selectedEvaluationModal.status}
                  </span>
                </div>
                <p className="text-slate-600 font-medium">{selectedEvaluationModal.projectTitle}</p>
                <div className="flex flex-wrap justify-between pt-1 text-[11px] text-slate-500 font-mono">
                  <span>Semester: <strong>{selectedEvaluationModal.semester}</strong></span>
                  <span>Reviewer: <strong>{selectedEvaluationModal.reviewerName}</strong> ({selectedEvaluationModal.reviewerDept})</span>
                </div>
              </div>

              {/* Rubric Table */}
              <div>
                <h4 className="font-extrabold text-[#111827] mb-2 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#FF5F38]" /> Criterion Breakdown (Max 10 per criterion)
                </h4>
                <div className="bg-slate-50 rounded-2xl border border-[#EADBD0] p-3 space-y-2">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200">
                    <span className="text-slate-700 font-medium">Problem Understanding & Need</span>
                    <span className="font-mono font-extrabold text-[#111827]">{selectedEvaluationModal.rubric.problemUnderstanding} / 10</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200">
                    <span className="text-slate-700 font-medium">Literature & Competitive Analysis</span>
                    <span className="font-mono font-extrabold text-[#111827]">{selectedEvaluationModal.rubric.literatureReview} / 10</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200">
                    <span className="text-slate-700 font-medium">Technical Depth & Code Quality</span>
                    <span className="font-mono font-extrabold text-[#111827]">{selectedEvaluationModal.rubric.technicalKnowledge} / 10</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200">
                    <span className="text-slate-700 font-medium">Execution & Progress Completion</span>
                    <span className="font-mono font-extrabold text-[#111827]">{selectedEvaluationModal.rubric.progress} / 10</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-700 font-medium">Viva Presentation & Defense</span>
                    <span className="font-mono font-extrabold text-[#111827]">{selectedEvaluationModal.rubric.presentation} / 10</span>
                  </div>
                </div>
              </div>

              {/* Total Summary */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                  <div className="text-base font-extrabold font-mono">{selectedEvaluationModal.ciaMarks} / 25</div>
                  <div className="text-[10px] font-bold">CIA Score</div>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-800 border border-indigo-100">
                  <div className="text-base font-extrabold font-mono">{selectedEvaluationModal.endSemMarks}</div>
                  <div className="text-[10px] font-bold">End-Sem Marks</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF2EC] text-[#111827] border border-[#EADBD0]">
                  <div className="text-base font-extrabold font-mono text-[#FF5F38]">{selectedEvaluationModal.totalMarks}</div>
                  <div className="text-[10px] font-bold">Composite Total</div>
                </div>
              </div>

              {/* Reviewer Feedback & Recommendation */}
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-1">
                  <span className="font-extrabold block">Reviewer Feedback Remarks:</span>
                  <p className="italic font-medium">"{selectedEvaluationModal.comments}"</p>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 space-y-1">
                  <span className="font-extrabold block">Official Recommendation:</span>
                  <p className="font-semibold">{selectedEvaluationModal.recommendation}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#EADBD0]">
              <button
                onClick={() => setSelectedEvaluationModal(null)}
                className="px-5 py-2 bg-[#0A1628] hover:bg-[#1E293B] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Close Rubric
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
