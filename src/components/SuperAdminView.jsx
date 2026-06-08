import { useState } from 'react';
import { 
  Ban, UserCheck, Trash2, Award, MapPin, Users, TrendingUp, Activity, 
  FileText, Download, CheckCircle, AlertCircle, Filter, Search, Plus, 
  Edit2, Eye, Sliders, Calendar, DollarSign, Layers, BookOpen, Shield,
  Check, X, Briefcase, Trophy
} from 'lucide-react';
import StaticCharts from './StaticCharts';

// Mock/Static data for Super Admin dashboard analytics
const STATS = {
  totalRegisteredPlayers: 42820,
  totalFederations: 15,
  totalDepartments: 8,
  totalSports: 12,
  totalDistricts: 38,
  activeTournaments: 8,
  completedTournaments: 24,
  upcomingEvents: 15,
  totalCoaches: 240,
  totalReferees: 110,
  totalTeams: 320
};

const RECENT_ACTIVITIES = [
  { id: 1, type: 'registration', text: 'New player registration: Ashwin Kumar (Cricket - Chennai District)', time: '2 mins ago' },
  { id: 2, type: 'federation', text: 'New federation registration requested: Tamil Nadu Hockey Association', time: '15 mins ago' },
  { id: 3, type: 'tournament', text: 'Tournament created: State Under-19 Athletics Championship 2026', time: '1 hour ago' },
  { id: 4, type: 'department', text: 'Department update: Southern Zone Budget Allocation increased by 15%', time: '3 hours ago' },
  { id: 5, type: 'approval', text: 'Approval request: 24 new player entries from Coimbatore District', time: '5 hours ago' },
  { id: 6, type: 'notification', text: 'System notification: Database backup completed successfully', time: '12 hours ago' },
];

const INITIAL_DEPARTMENTS_DATA = [
  { id: '1', name: 'Youth Welfare and Sports Development', head: 'Dr. K. Vijayakarthikeyan IAS', athletes: 15200, coaches: 84, sports: 'Cricket, Football, Athletics', budget: '₹12.5 Crores', score: 92, assignedSportsList: ['Cricket', 'Football', 'Athletics'] },
  { id: '2', name: 'School Education Department', head: 'Thiru. T.S. Jawahar IAS', athletes: 18400, coaches: 96, sports: 'Kabaddi, Volleyball, Basketball', budget: '₹8.2 Crores', score: 87, assignedSportsList: ['Kabaddi', 'Volleyball', 'Basketball'] },
  { id: '3', name: 'Higher Education Sports Council', head: 'Dr. D. Karthikeyan IAS', athletes: 6200, coaches: 32, sports: 'Badminton, Tennis, Swimming', budget: '₹4.5 Crores', score: 79, assignedSportsList: ['Badminton', 'Tennis', 'Swimming'] },
  { id: '4', name: 'Police Sports Control Board', head: 'Shri. Shankar Jiwal IPS', athletes: 1820, coaches: 18, sports: 'Hockey, Athletics, Kabaddi', budget: '₹2.8 Crores', score: 85, assignedSportsList: ['Hockey', 'Athletics', 'Kabaddi'] },
  { id: '5', name: 'Revenue & Disaster Management Sports Club', head: 'Thiru. Kumar Jayant IAS', athletes: 1200, coaches: 10, sports: 'Carrom, Chess, Table Tennis', budget: '₹1.5 Crores', score: 72, assignedSportsList: ['Table Tennis'] },
];

const INITIAL_FEDERATIONS_DATA = [
  { id: 'f1', name: 'Tamil Nadu Cricket Association', president: 'Dr. P. Ashok Sigamani', secretary: 'R.I. Palani', status: 'Approved', players: 14250, coaches: 85, tournaments: 12, medals: 42, sports: 'Cricket' },
  { id: 'f2', name: 'Tamil Nadu Football Association', president: 'Thiru. Ravikumar David', secretary: 'S. Shanmugam', status: 'Approved', players: 7850, coaches: 48, tournaments: 8, medals: 18, sports: 'Football' },
  { id: 'f3', name: 'Tamil Nadu Kabaddi Association', president: 'Thiru. Solai M. Raja', secretary: 'Safulla Khan', status: 'Approved', players: 8400, coaches: 54, tournaments: 10, medals: 35, sports: 'Kabaddi' },
  { id: 'f4', name: 'Tamil Nadu Athletics Association', president: 'W.I. Davaram IPS', secretary: 'Latha', status: 'Approved', players: 9120, coaches: 32, tournaments: 6, medals: 56, sports: 'Athletics' },
  { id: 'f5', name: 'Tamil Nadu Basketball Association', president: 'Thiru. Aadhav Arjuna', secretary: 'R. Ananth', status: 'Pending', players: 4200, coaches: 18, tournaments: 4, medals: 12, sports: 'Basketball' },
  { id: 'f6', name: 'Tamil Nadu Badminton Association', president: 'Dr. Akhilesh Das Gupta', secretary: 'K.C. Muralidharan', status: 'Suspended', players: 2100, coaches: 12, tournaments: 2, medals: 9, sports: 'Badminton' },
];

const PLAYERS_STATISTICS = {
  total: 42820,
  active: 38400,
  newRegistrationsThisMonth: 1250,
  topPerforming: [
    { name: 'S. Vignesh', district: 'Madurai', sport: 'Kabaddi', medals: '3 Gold, 1 Silver', score: 98 },
    { name: 'P. Priyanka', district: 'Coimbatore', sport: 'Athletics (100m)', medals: '2 Gold, 1 Bronze', score: 96 },
    { name: 'K. Rahul', district: 'Chennai', sport: 'Cricket', medals: 'Tournament MVP', score: 95 },
    { name: 'M. Sneha', district: 'Trichy', sport: 'Badminton', medals: '2 Gold', score: 94 },
  ],
  byDistrict: [
    { name: 'Chennai', count: 8420 },
    { name: 'Coimbatore', count: 6150 },
    { name: 'Madurai', count: 4890 },
    { name: 'Trichy', count: 3950 },
    { name: 'Salem', count: 3210 },
  ],
  bySport: [
    { name: 'Cricket', count: 14250 },
    { name: 'Athletics', count: 9120 },
    { name: 'Kabaddi', count: 8400 },
    { name: 'Football', count: 7850 },
    { name: 'Basketball', count: 4200 },
  ],
  byAgeGroup: [
    { name: 'Under-14', count: 8600, percentage: 20 },
    { name: 'Under-17', count: 15400, percentage: 36 },
    { name: 'Under-19', count: 12100, percentage: 28 },
    { name: 'Seniors', count: 6720, percentage: 16 },
  ],
  byGender: [
    { name: 'Male', count: 26550, percentage: 62 },
    { name: 'Female', count: 15920, percentage: 37 },
    { name: 'Other', count: 350, percentage: 1 },
  ]
};

const RECORDS_ACHIEVEMENTS = {
  mostMedalsWon: [
    { name: 'Coimbatore Athletics Club', medals: '48 Golds', district: 'Coimbatore' },
    { name: 'Chennai Swimming Elite', medals: '36 Golds', district: 'Chennai' },
  ],
  mostActivePlayers: [
    { name: 'Chennai District School Board', activeCount: '2,400 Players' },
    { name: 'Madurai Sports Academy', activeCount: '1,850 Players' }
  ],
  bestFederation: 'Tamil Nadu Athletics Association (56 Medals)',
  bestDistrict: 'Chennai (8,420 Players, 88 Medals)',
  champions: [
    { event: 'State Senior Kabaddi Championship 2026', champion: 'Madurai Panthers' },
    { event: 'CM Trophy Football Tournament 2025', champion: 'Chennai FC Academy' }
  ],
  nationalRecordHolders: [
    { name: 'R. Saravanan (Coimbatore)', event: 'High Jump (2.21m)', date: 'Feb 2026' },
    { name: 'A. Mercy (Tirunelveli)', event: '100m Hurdles (13.44s)', date: 'Mar 2026' }
  ]
};

const LEADERBOARDS = {
  players: [
    { rank: 1, name: 'S. Vignesh', sport: 'Kabaddi', district: 'Madurai', performancePoints: 980 },
    { rank: 2, name: 'P. Priyanka', sport: 'Athletics', district: 'Coimbatore', performancePoints: 965 },
    { rank: 3, name: 'K. Rahul', sport: 'Cricket', district: 'Chennai', performancePoints: 950 },
    { rank: 4, name: 'M. Sneha', sport: 'Badminton', district: 'Trichy', performancePoints: 940 },
    { rank: 5, name: 'T. Karthik', sport: 'Basketball', district: 'Salem', performancePoints: 915 },
  ],
  coaches: [
    { rank: 1, name: 'Ramanathan Swamy', sport: 'Athletics', athletesCount: 42, goldMedals: 14 },
    { rank: 2, name: 'Albert D’Souza', sport: 'Football', athletesCount: 65, goldMedals: 8 },
    { rank: 3, name: 'K. Senthil Kumar', sport: 'Kabaddi', athletesCount: 38, goldMedals: 10 },
  ],
  teams: [
    { rank: 1, name: 'Madurai Kabaddi Warriors', sport: 'Kabaddi', district: 'Madurai', wins: 18, losses: 2 },
    { rank: 2, name: 'Chennai Super Kings Acad.', sport: 'Cricket', district: 'Chennai', wins: 22, losses: 4 },
    { rank: 3, name: 'Coimbatore Sprinters club', sport: 'Athletics', district: 'Coimbatore', wins: 15, losses: 1 },
  ],
  districts: [
    { rank: 1, name: 'Chennai', totalPlayers: 8420, totalMedals: 88, rating: 'Outstanding' },
    { rank: 2, name: 'Coimbatore', totalPlayers: 6150, totalMedals: 64, rating: 'Excellent' },
    { rank: 3, name: 'Madurai', totalPlayers: 4890, totalMedals: 52, rating: 'Excellent' },
    { rank: 4, name: 'Trichy', totalPlayers: 3950, totalMedals: 36, rating: 'Good' },
    { rank: 5, name: 'Salem', totalPlayers: 3210, totalMedals: 28, rating: 'Good' },
  ],
  federations: [
    { rank: 1, name: 'Tamil Nadu Athletics Association', score: 96, athletes: 9120, tournamentsCount: 6 },
    { rank: 2, name: 'Tamil Nadu Cricket Association', score: 94, athletes: 14250, tournamentsCount: 12 },
    { rank: 3, name: 'Tamil Nadu Kabaddi Association', score: 91, athletes: 8400, tournamentsCount: 10 },
  ],
  sports: [
    { rank: 1, name: 'Cricket', participationIndex: 9.8, activeEvents: 24, growthPercent: '+15%' },
    { rank: 2, name: 'Athletics', participationIndex: 9.2, activeEvents: 16, growthPercent: '+22%' },
    { rank: 3, name: 'Kabaddi', participationIndex: 8.9, activeEvents: 18, growthPercent: '+8%' },
    { rank: 4, name: 'Football', participationIndex: 8.2, activeEvents: 14, growthPercent: '+12%' },
  ]
};

export default function SuperAdminView({
  activeTab,
  newDeptName,
  setNewDeptName,
  handleCreateDept,
  departments: propDepartments = [],
  federations: propFederations = [],
  newDeptAdmin,
  setNewDeptAdmin,
  handleCreateDeptAdmin,
  loading,
  usersList = [],
  tournaments = [],
  matches = [],
  handleDeleteUser,
  handleBlockUser,
  handleUnblockUser,
  handleDeleteMatch,
  handleDeleteFederation,
  handleDeleteTournament,
  notificationLogs = [],
  onSelectMatch
}) {
  const [expandedTournaments, setExpandedTournaments] = useState({});
  const [deptSearch, setDeptSearch] = useState('');
  const [fedSearch, setFedSearch] = useState('');
  const [playerSearch, setPlayerSearch] = useState('');
  const [analyticsFilter, setAnalyticsFilter] = useState('All');

  // Dynamic modules state tracking updates locally for UX actions (Suspend, Approve, Edit)
  const [federations, setFederations] = useState(INITIAL_FEDERATIONS_DATA);
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS_DATA);
  const [selectedFederationDetail, setSelectedFederationDetail] = useState(null);
  const [editingDept, setEditingDept] = useState(null);
  const [editingFed, setEditingFed] = useState(null);
  const [assigningSportsDept, setAssigningSportsDept] = useState(null);

  // Sync prop changes if needed
  useState(() => {
    if (propFederations.length > 0) {
      // merge with static ones
      const merged = [...INITIAL_FEDERATIONS_DATA];
      propFederations.forEach(pf => {
        if (!merged.find(m => m.name.toLowerCase() === pf.name.toLowerCase())) {
          merged.push({
            id: pf.id,
            name: pf.name,
            president: 'Not Assigned',
            secretary: 'Not Assigned',
            status: 'Approved',
            players: Math.floor(Math.random() * 1200) + 100,
            coaches: Math.floor(Math.random() * 30) + 5,
            tournaments: Math.floor(Math.random() * 5) + 1,
            medals: Math.floor(Math.random() * 20),
            sports: pf.name.replace('Tamil Nadu ', '').replace(' Association', '')
          });
        }
      });
      setFederations(merged);
    }
  }, [propFederations]);

  useState(() => {
    if (propDepartments.length > 0) {
      const merged = [...INITIAL_DEPARTMENTS_DATA];
      propDepartments.forEach(pd => {
        if (!merged.find(m => m.name.toLowerCase() === pd.name.toLowerCase())) {
          merged.push({
            id: pd.id,
            name: pd.name,
            head: 'N/A',
            athletes: Math.floor(Math.random() * 5000) + 500,
            coaches: Math.floor(Math.random() * 50) + 10,
            sports: 'General Sports',
            budget: '₹2.0 Crores',
            score: 80,
            assignedSportsList: ['Athletics']
          });
        }
      });
      setDepartments(merged);
    }
  }, [propDepartments]);

  const toggleTournament = (id) => {
    setExpandedTournaments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const deptAdmins = usersList.filter(u => u.role === 'department_admin');

  // CSV Downloader Helper
  const downloadReport = (filename, headers, rows) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export functions
  const handleExportPDF = (reportName) => {
    alert(`Generating & Downloading PDF Export for "${reportName}" Report...`);
    const docText = `
--------------------------------------------------
NATIONAL SPORTS MANAGEMENT SYSTEM - REPORT
Report Name: ${reportName.toUpperCase()}
Generated on: ${new Date().toLocaleString()}
Status: Official Release
--------------------------------------------------
This document serves as the official validated record for the multi-sports platform.
All values listed represent audited player lists, medal distributions, and financial structures.
    `;
    const blob = new Blob([docText], { type: 'application/pdf' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${reportName.replace(/\s+/g, '_')}_Report.pdf`;
    link.click();
  };

  const handleExportExcel = (reportName) => {
    alert(`Generating & Downloading Excel/CSV Export for "${reportName}" Report...`);
    let headers = [];
    let rows = [];
    if (reportName.includes('Registration')) {
      headers = ['Category', 'Value', 'Percentage'];
      rows = [
        ['Total Players', STATS.totalRegisteredPlayers, '100%'],
        ['Total Coaches', STATS.totalCoaches, '-'],
        ['Total Teams', STATS.totalTeams, '-'],
        ['Active Tournaments', STATS.activeTournaments, '-']
      ];
    } else if (reportName.includes('Federation')) {
      headers = ['Federation Name', 'President', 'Status', 'Total Players', 'Medals'];
      rows = federations.map(f => [f.name, f.president, f.status, f.players, f.medals]);
    } else if (reportName.includes('Department')) {
      headers = ['Department Name', 'Head', 'Budget', 'Score', 'Athletes Count'];
      rows = departments.map(d => [d.name, d.head, d.budget, d.score, d.athletes]);
    } else if (reportName.includes('Player')) {
      headers = ['Rank', 'Name', 'Sport', 'District', 'Points'];
      rows = LEADERBOARDS.players.map(p => [p.rank, p.name, p.sport, p.district, p.performancePoints]);
    } else {
      headers = ['Metric Key', 'Value'];
      rows = Object.entries(STATS).map(([k, v]) => [k.replace(/([A-Z])/g, ' $1').toUpperCase(), v]);
    }
    downloadReport(`${reportName.replace(/\s+/g, '_')}_Report.csv`, headers, rows);
  };

  // Federation management action handlers
  const handleApproveFederation = (id) => {
    setFederations(prev => prev.map(f => f.id === id ? { ...f, status: 'Approved' } : f));
  };
  const handleSuspendFederation = (id) => {
    setFederations(prev => prev.map(f => f.id === id ? { ...f, status: 'Suspended' } : f));
  };
  const handleSaveFederation = (e) => {
    e.preventDefault();
    setFederations(prev => prev.map(f => f.id === editingFed.id ? editingFed : f));
    setEditingFed(null);
  };

  // Department Action Handlers
  const handleSaveDept = (e) => {
    e.preventDefault();
    setDepartments(prev => prev.map(d => d.id === editingDept.id ? editingDept : d));
    setEditingDept(null);
  };
  const handleToggleSportInDept = (sportName) => {
    if (!assigningSportsDept) return;
    const currentList = assigningSportsDept.assignedSportsList || [];
    let updated = [];
    if (currentList.includes(sportName)) {
      updated = currentList.filter(s => s !== sportName);
    } else {
      updated = [...currentList, sportName];
    }
    setAssigningSportsDept({
      ...assigningSportsDept,
      assignedSportsList: updated,
      sports: updated.join(', ')
    });
  };
  const handleSaveDeptSports = () => {
    setDepartments(prev => prev.map(d => d.id === assigningSportsDept.id ? assigningSportsDept : d));
    setAssigningSportsDept(null);
  };

  // Overview Dashboard rendering
  if (activeTab === 'overview') {
    return (
      <div className="space-y-6">
        {/* Metric Summaries */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center shadow-lg transition hover:border-sports-cyan">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Registered Players</span>
            <span className="text-2xl font-black text-sports-cyan mt-1">{STATS.totalRegisteredPlayers.toLocaleString()}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center shadow-lg transition hover:border-indigo-400">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Federations</span>
            <span className="text-2xl font-black text-indigo-400 mt-1">{federations.length}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center shadow-lg transition hover:border-emerald-400">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Departments</span>
            <span className="text-2xl font-black text-emerald-400 mt-1">{departments.length}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center shadow-lg transition hover:border-amber-400">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Total Teams</span>
            <span className="text-2xl font-black text-amber-400 mt-1">{STATS.totalTeams}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center shadow-lg transition hover:border-pink-400">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Active Events</span>
            <span className="text-2xl font-black text-pink-400 mt-1">{STATS.activeTournaments}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center shadow-lg transition hover:border-purple-400">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Total Coaches</span>
            <span className="text-2xl font-black text-purple-400 mt-1">{STATS.totalCoaches}</span>
          </div>
        </div>

        {/* Second row metadata metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-lg flex justify-between items-center">
            <span className="text-[10px] font-mono text-slate-400">Active Sports:</span>
            <span className="text-sm font-bold text-slate-200">{STATS.totalSports}</span>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-lg flex justify-between items-center">
            <span className="text-[10px] font-mono text-slate-400">Districts Administered:</span>
            <span className="text-sm font-bold text-slate-200">{STATS.totalDistricts}</span>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-lg flex justify-between items-center">
            <span className="text-[10px] font-mono text-slate-400">Completed Tourneys:</span>
            <span className="text-sm font-bold text-emerald-400">{STATS.completedTournaments}</span>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-lg flex justify-between items-center">
            <span className="text-[10px] font-mono text-slate-400">Upcoming Fixtures:</span>
            <span className="text-sm font-bold text-blue-400">{STATS.upcomingEvents}</span>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-lg flex justify-between items-center">
            <span className="text-[10px] font-mono text-slate-400">Total Referees:</span>
            <span className="text-sm font-bold text-amber-400">{STATS.totalReferees}</span>
          </div>
        </div>

        {/* Content Section: Quick Lists & Recent Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Active Entities lists */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="font-extrabold text-sm text-slate-200 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-400" /> Active Departments
                  </h4>
                  <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded font-mono text-slate-400">{departments.length}</span>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  {departments.slice(0, 4).map(d => (
                    <div key={d.id} className="bg-slate-950/60 p-2.5 rounded border border-slate-900 flex justify-between items-center">
                      <span className="text-slate-300 font-semibold truncate max-w-[160px]">🏛️ {d.name}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{d.budget} Budget</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="font-extrabold text-sm text-slate-200 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-indigo-400" /> Active Federations
                  </h4>
                  <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded font-mono text-slate-400">{federations.length}</span>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  {federations.slice(0, 4).map(f => (
                    <div key={f.id} className="bg-slate-950/60 p-2.5 rounded border border-slate-900 flex justify-between items-center">
                      <span className="text-slate-300 font-semibold truncate max-w-[160px]">🏅 {f.name}</span>
                      <span className={`text-[10px] font-bold ${f.status === 'Approved' ? 'text-emerald-400' : 'text-amber-400'}`}>{f.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick summary chart preview */}
            <StaticCharts />
          </div>

          {/* Activity Feed Column */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
            <h4 className="font-extrabold text-sm text-slate-200 border-b border-slate-850 pb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500 animate-pulse" /> Recent Activity Feed
            </h4>
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {RECENT_ACTIVITIES.map((act) => (
                <div key={act.id} className="bg-slate-950/70 p-3 rounded-lg border border-slate-900 space-y-1 hover:border-slate-800 transition">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      act.type === 'registration' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' :
                      act.type === 'federation' ? 'bg-indigo-950 text-indigo-400 border border-indigo-900' :
                      act.type === 'tournament' ? 'bg-pink-950 text-pink-400 border border-pink-900' :
                      act.type === 'department' ? 'bg-amber-950 text-amber-400 border border-amber-900' :
                      'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}>
                      {act.type}
                    </span>
                    <span className="text-slate-500 font-semibold">{act.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-tight font-medium">
                    {act.text}
                  </p>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-850 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Real-time Stream Online</span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Sports & Analytics dashboard
  if (activeTab === 'sports_analytics') {
    const availableFilters = ['All', 'Popular', 'Fastest Growing', 'High Participation'];
    const filteredSports = LEADERBOARDS.sports.filter(s => {
      if (analyticsFilter === 'All') return true;
      if (analyticsFilter === 'Popular') return s.participationIndex >= 9.0;
      if (analyticsFilter === 'Fastest Growing') return s.growthPercent.includes('15') || s.growthPercent.includes('22');
      if (analyticsFilter === 'High Participation') return s.activeEvents > 15;
      return true;
    });

    return (
      <div className="space-y-6">
        {/* Title, Filters, and Export Bar */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-slate-900/50 p-4 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-sports-cyan" />
            <div>
              <h3 className="font-extrabold text-sm text-slate-200">Sports & District Performance Dashboard</h3>
              <p className="text-[10px] text-slate-400 font-medium">Detailed demographic growth indices and performance metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1"><Filter className="w-3.5 h-3.5" /> Filter:</span>
            <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800 font-mono">
              {availableFilters.map(f => (
                <button
                  key={f}
                  onClick={() => setAnalyticsFilter(f)}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition ${analyticsFilter === f ? 'bg-sports-cyan text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Part 1: Registration Analytics, Monthly Growth, Gender & Age */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gender Participation Donut Chart */}
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl space-y-4 shadow-lg hover:border-slate-700 transition duration-300">
            <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-2">
              Gender Participation Statistics
            </h4>
            <div className="flex flex-col items-center justify-center gap-4 py-2">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="var(--bg-page)" strokeWidth="4.5"></circle>
                  {/* Male: 62% */}
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#06b6d4" strokeWidth="4.5" strokeDasharray="62 38" strokeDashoffset="0"></circle>
                  {/* Female: 37% */}
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#ec4899" strokeWidth="4.5" strokeDasharray="37 63" strokeDashoffset="-62"></circle>
                  {/* Other: 1% */}
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray="1 99" strokeDashoffset="-99"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-slate-100">42,820</span>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 font-bold">Total Players</span>
                </div>
              </div>

              {/* Styled Interactive Legend Grid */}
              <div className="w-full grid grid-cols-3 gap-2 text-[10px] text-center font-mono">
                <div className="flex flex-col items-center bg-slate-950/60 p-2 rounded-lg border border-slate-900/60">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] mb-1 shadow-[0_0_8px_#06b6d4]"></span>
                  <span className="text-slate-300 font-bold">Male</span>
                  <span className="text-[9px] text-slate-500 font-semibold">26.5k (62%)</span>
                </div>
                <div className="flex flex-col items-center bg-slate-950/60 p-2 rounded-lg border border-slate-900/60">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899] mb-1 shadow-[0_0_8px_#ec4899]"></span>
                  <span className="text-slate-300 font-bold">Female</span>
                  <span className="text-[9px] text-slate-500 font-semibold">15.9k (37%)</span>
                </div>
                <div className="flex flex-col items-center bg-slate-950/60 p-2 rounded-lg border border-slate-900/60">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] mb-1 shadow-[0_0_8px_#f59e0b]"></span>
                  <span className="text-slate-300 font-bold">Other</span>
                  <span className="text-[9px] text-slate-500 font-semibold">350 (1%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Age Category Distribution Donut Chart */}
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl space-y-4 shadow-lg hover:border-slate-700 transition duration-300">
            <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-2">
              Age Category Distribution
            </h4>
            <div className="flex flex-col items-center justify-center gap-4 py-2">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="var(--bg-page)" strokeWidth="4.5"></circle>
                  {/* Under-14: 20% */}
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#a855f7" strokeWidth="4.5" strokeDasharray="20 80" strokeDashoffset="0"></circle>
                  {/* Under-17: 36% */}
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" strokeDasharray="36 64" strokeDashoffset="-20"></circle>
                  {/* Under-19: 28% */}
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10b981" strokeWidth="4.5" strokeDasharray="28 72" strokeDashoffset="-56"></circle>
                  {/* Seniors: 16% */}
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f43f5e" strokeWidth="4.5" strokeDasharray="16 84" strokeDashoffset="-84"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-slate-100">4 Categories</span>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 font-bold">Youth Pool</span>
                </div>
              </div>

              {/* Detailed Legend Grid */}
              <div className="w-full grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg border border-slate-900/60 justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#a855f7]"></span>
                  <span className="text-slate-300 font-bold">U14 (20%)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg border border-slate-900/60 justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                  <span className="text-slate-300 font-bold">U17 (36%)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg border border-slate-900/60 justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                  <span className="text-slate-300 font-bold">U19 (28%)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg border border-slate-900/60 justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#f43f5e]"></span>
                  <span className="text-slate-300 font-bold">Senior (16%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Growth of Registrations */}
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl space-y-4">
            <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-2">
              Monthly Growth Trends
            </h4>
            <div className="space-y-3.5 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-400">January 2026</span>
                <span className="text-emerald-400 font-bold">+850 Players</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-400">February 2026</span>
                <span className="text-emerald-400 font-bold">+1,100 Players</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-400">March 2026</span>
                <span className="text-emerald-400 font-bold">+1,250 Players</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-400">April 2026</span>
                <span className="text-emerald-400 font-bold">+1,400 Players</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-400">May 2026 (Est)</span>
                <span className="text-sports-cyan font-bold">+1,800 Players</span>
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: District Performance Dashboard & Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl space-y-4">
            <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-2">
              District Performance rankings & Sport Popularity
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 font-mono text-slate-400">
                    <th className="py-2 px-1">Rank</th>
                    <th className="py-2 px-2">District</th>
                    <th className="py-2 px-2 text-right">Player Count</th>
                    <th className="py-2 px-2 text-right">Medals</th>
                    <th className="py-2 px-2 text-right">Performance Score</th>
                  </tr>
                </thead>
                <tbody>
                  {LEADERBOARDS.districts.map(d => (
                    <tr key={d.name} className="border-b border-slate-900 text-slate-300 hover:bg-slate-900/10">
                      <td className="py-2 px-1 font-bold text-sports-cyan">{d.rank}</td>
                      <td className="py-2 px-2 font-semibold flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> {d.name}</td>
                      <td className="py-2 px-2 text-right font-mono">{d.totalPlayers.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right font-mono text-yellow-400 font-bold">{d.totalMedals}</td>
                      <td className="py-2 px-2 text-right font-mono">
                        <span className="bg-emerald-950/40 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-900/30 text-[10px]">
                          {d.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl space-y-4">
            <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-2">
              Sports Growth & Participation Index
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 font-mono text-slate-400">
                    <th className="py-2 px-1">Rank</th>
                    <th className="py-2 px-2">Sport Discipline</th>
                    <th className="py-2 px-2 text-right">Participation Index</th>
                    <th className="py-2 px-2 text-right">Active Tourneys</th>
                    <th className="py-2 px-2 text-right">Growth Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSports.map(s => (
                    <tr key={s.name} className="border-b border-slate-900 text-slate-300 hover:bg-slate-900/10">
                      <td className="py-2 px-1 font-bold text-indigo-400">{s.rank}</td>
                      <td className="py-2 px-2 font-semibold">{s.name}</td>
                      <td className="py-2 px-2 text-right font-mono text-slate-200">{s.participationIndex} / 10</td>
                      <td className="py-2 px-2 text-right font-mono">{s.activeEvents}</td>
                      <td className="py-2 px-2 text-right font-mono text-emerald-400 font-bold">{s.growthPercent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg text-[10px] text-slate-400 font-mono leading-tight">
              📊 <strong>District Popularity Trend:</strong> Cricket is most popular in urban coastal zones (Chennai), while Athletics and Kabaddi see maximum growth in Western and Southern Tamil Nadu (Coimbatore, Madurai, Tirunelveli).
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Departments list & operations
  if (activeTab === 'departments') {
    const filteredDepts = departments.filter(d => 
      d.name.toLowerCase().includes(deptSearch.toLowerCase()) ||
      d.head.toLowerCase().includes(deptSearch.toLowerCase())
    );

    return (
      <div className="space-y-6">
        {/* Search and Action Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-slate-900/40 p-4 border border-slate-800 rounded-xl">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-4 h-4 text-slate-500" />
            </span>
            <input
              type="text"
              placeholder="Search departments or heads..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sports-cyan placeholder-slate-500"
              value={deptSearch}
              onChange={(e) => setDeptSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleExportExcel('Department Performance')} 
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-900"
            >
              <Download className="w-3.5 h-3.5" /> Export Excel
            </button>
          </div>
        </div>

        {/* Create Department Form (Interactive) */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
          <h3 className="font-extrabold text-sm text-slate-200 flex items-center gap-2">
            <Plus className="w-4 h-4 text-sports-cyan" /> Add New High-Level Department
          </h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!newDeptName) return;
            const newId = String(departments.length + 1);
            const newObj = {
              id: newId,
              name: newDeptName,
              head: 'Thiru. Acting Director General',
              athletes: 0,
              coaches: 0,
              sports: 'None Assigned',
              budget: '₹0.5 Crores',
              score: 70,
              assignedSportsList: []
            };
            setDepartments([...departments, newObj]);
            setNewDeptName('');
            alert('Department added successfully!');
          }} className="flex gap-3 text-xs max-w-lg">
            <input
              type="text"
              required
              placeholder="e.g. Directorate of Collegiate Education Sports Wing"
              className="flex-1 bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
            />
            <button type="submit" className="px-4 py-1.5 rounded bg-sports-cyan text-slate-950 font-bold uppercase cursor-pointer">
              Add Department
            </button>
          </form>
        </div>

        {/* Department Table */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-900/50 text-slate-400 font-mono">
                  <th className="py-3 px-4">Department Name</th>
                  <th className="py-3 px-4">Department Head</th>
                  <th className="py-3 px-4 text-right">Athletes</th>
                  <th className="py-3 px-4 text-right">Coaches</th>
                  <th className="py-3 px-4">Assigned Sports</th>
                  <th className="py-3 px-4 text-right">Budget</th>
                  <th className="py-3 px-4 text-right">Perf Score</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepts.map(d => (
                  <tr key={d.id} className="border-b border-slate-900 hover:bg-slate-900/20 text-slate-300">
                    <td className="py-3 px-4 font-bold text-slate-200">🏛️ {d.name}</td>
                    <td className="py-3 px-4 text-slate-400">{d.head}</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold">{d.athletes.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-mono">{d.coaches}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] bg-slate-950 border border-slate-850 px-2 py-0.5 rounded font-medium text-indigo-300">
                        {d.sports}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-400 font-bold">{d.budget}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-sports-cyan">{d.score}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => setEditingDept(d)}
                          className="p-1 hover:bg-slate-950 rounded text-amber-400 transition"
                          title="Edit Department"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setAssigningSportsDept(d)}
                          className="px-2 py-0.5 text-[9px] bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 rounded border border-indigo-900/50"
                          title="Assign Sports"
                        >
                          Assign Sports
                        </button>
                        <button 
                          onClick={() => handleExportPDF(`Department_${d.name}`)}
                          className="p-1 hover:bg-slate-950 rounded text-slate-400 transition"
                          title="Generate Report"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal/Dialog for Assigning Sports to Department */}
        {assigningSportsDept && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 className="font-extrabold text-sm text-slate-200">Assign Disciplines to Dept</h4>
                <button onClick={() => setAssigningSportsDept(null)} className="text-slate-500 hover:text-slate-300"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-[11px] text-slate-400">Toggle active sports managed by <strong>{assigningSportsDept.name}</strong></p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Cricket', 'Football', 'Volleyball', 'Basketball', 'Athletics', 'Badminton', 'Hockey', 'Kabaddi', 'Swimming', 'Tennis'].map(sport => {
                  const isAssigned = (assigningSportsDept.assignedSportsList || []).includes(sport);
                  return (
                    <button
                      key={sport}
                      onClick={() => handleToggleSportInDept(sport)}
                      className={`p-2 rounded-lg border text-left font-semibold transition ${isAssigned ? 'bg-sports-cyan/10 border-sports-cyan text-sports-cyan' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                    >
                      {sport} {isAssigned && '✓'}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end gap-2 text-xs pt-3">
                <button onClick={() => setAssigningSportsDept(null)} className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300">Cancel</button>
                <button onClick={handleSaveDeptSports} className="px-4 py-1.5 bg-sports-cyan text-slate-950 font-bold rounded">Save Assignments</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Editing Department */}
        {editingDept && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={handleSaveDept} className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 className="font-extrabold text-sm text-slate-200">Edit Department Details</h4>
                <button type="button" onClick={() => setEditingDept(null)} className="text-slate-500 hover:text-slate-300"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Department Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200"
                    value={editingDept.name}
                    onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Director General / Head</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200"
                    value={editingDept.head}
                    onChange={(e) => setEditingDept({ ...editingDept, head: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Budget Allocation</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200"
                      value={editingDept.budget}
                      onChange={(e) => setEditingDept({ ...editingDept, budget: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Performance Score (0-100)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200"
                      value={editingDept.score}
                      onChange={(e) => setEditingDept({ ...editingDept, score: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 text-xs pt-2">
                <button type="button" onClick={() => setEditingDept(null)} className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-sports-cyan text-slate-950 font-bold rounded">Save Changes</button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  // Federations Module
  if (activeTab === 'federations') {
    const filteredFeds = federations.filter(f => 
      f.name.toLowerCase().includes(fedSearch.toLowerCase()) ||
      f.president.toLowerCase().includes(fedSearch.toLowerCase())
    );

    return (
      <div className="space-y-6">
        {/* Search, Filter & Export */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-slate-900/40 p-4 border border-slate-800 rounded-xl">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-4 h-4 text-slate-500" />
            </span>
            <input
              type="text"
              placeholder="Search federations or officials..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-400 placeholder-slate-500"
              value={fedSearch}
              onChange={(e) => setFedSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => handleExportExcel('Registered Federations')} 
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-900"
          >
            <Download className="w-3.5 h-3.5" /> Export Excel
          </button>
        </div>

        {/* Federations Table */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-900/50 text-slate-400 font-mono">
                  <th className="py-3 px-4">Federation Name</th>
                  <th className="py-3 px-4">President & Secretary</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Athletes</th>
                  <th className="py-3 px-4 text-right">Coaches</th>
                  <th className="py-3 px-4 text-right">Tourneys</th>
                  <th className="py-3 px-4 text-right">Medals</th>
                  <th className="py-3 px-4">Active Discipline</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeds.map(f => (
                  <tr key={f.id} className="border-b border-slate-900 hover:bg-slate-900/20 text-slate-300">
                    <td className="py-3 px-4 font-bold text-slate-200">🏅 {f.name}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      <div>Pres: {f.president}</div>
                      <div className="text-[10px] text-slate-500">Sec: {f.secretary}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase font-mono ${
                        f.status === 'Approved' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-900/40' :
                        f.status === 'Pending' ? 'bg-amber-950/80 text-amber-400 border border-amber-900/40' :
                        'bg-red-950/85 text-red-400 border border-red-900/40'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold">{f.players.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-mono">{f.coaches}</td>
                    <td className="py-3 px-4 text-right font-mono text-indigo-300 font-semibold">{f.tournaments}</td>
                    <td className="py-3 px-4 text-right font-mono text-yellow-400 font-bold">{f.medals}</td>
                    <td className="py-3 px-4 text-[11px] font-semibold text-slate-400">{f.sports}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1 items-center">
                        <button
                          onClick={() => setSelectedFederationDetail(f)}
                          className="p-1 hover:bg-slate-950 rounded text-sports-cyan"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingFed(f)}
                          className="p-1 hover:bg-slate-950 rounded text-amber-400"
                          title="Edit Federation"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {f.status !== 'Approved' && (
                          <button
                            onClick={() => handleApproveFederation(f.id)}
                            className="p-1 hover:bg-slate-950 text-emerald-400 rounded"
                            title="Approve Federation"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {f.status !== 'Suspended' && (
                          <button
                            onClick={() => handleSuspendFederation(f.id)}
                            className="p-1 hover:bg-slate-950 text-red-400 rounded"
                            title="Suspend Federation"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Federation Detail */}
        {selectedFederationDetail && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 className="font-extrabold text-sm text-slate-200">Federation Performance Records</h4>
                <button onClick={() => setSelectedFederationDetail(null)} className="text-slate-500 hover:text-slate-300"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-900">
                    <span className="text-slate-500 text-[10px]">ORGANIZATION</span>
                    <div className="text-slate-200 font-bold mt-1 text-xs">{selectedFederationDetail.name}</div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-900">
                    <span className="text-slate-500 text-[10px]">REGISTRATION STATUS</span>
                    <div className="text-emerald-400 font-bold mt-1 text-xs">{selectedFederationDetail.status}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                    <div className="text-[10px] text-slate-500">ATHLETES</div>
                    <div className="text-lg font-black text-slate-100">{selectedFederationDetail.players}</div>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                    <div className="text-[10px] text-slate-500">COACHES</div>
                    <div className="text-lg font-black text-slate-100">{selectedFederationDetail.coaches}</div>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                    <div className="text-[10px] text-slate-500">MEDALS</div>
                    <div className="text-lg font-black text-yellow-400">{selectedFederationDetail.medals}</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <div>• <strong>President:</strong> {selectedFederationDetail.president}</div>
                  <div>• <strong>Secretary General:</strong> {selectedFederationDetail.secretary}</div>
                  <div>• <strong>Active Discipline:</strong> {selectedFederationDetail.sports}</div>
                  <div>• <strong>Approved Events Organized:</strong> {selectedFederationDetail.tournaments} state tournaments</div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button onClick={() => setSelectedFederationDetail(null)} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded font-bold text-slate-300">Close</button>
                <button onClick={() => handleExportPDF(`FedRecord_${selectedFederationDetail.name}`)} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded">Print Report</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Editing Federation */}
        {editingFed && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={handleSaveFederation} className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 className="font-extrabold text-sm text-slate-200">Edit Federation Profile</h4>
                <button type="button" onClick={() => setEditingFed(null)} className="text-slate-500 hover:text-slate-300"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Federation Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200"
                    value={editingFed.name}
                    onChange={(e) => setEditingFed({ ...editingFed, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">President Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200"
                    value={editingFed.president}
                    onChange={(e) => setEditingFed({ ...editingFed, president: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Secretary Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200"
                    value={editingFed.secretary}
                    onChange={(e) => setEditingFed({ ...editingFed, secretary: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 text-xs pt-2">
                <button type="button" onClick={() => setEditingFed(null)} className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-sports-cyan text-slate-950 font-bold rounded">Save Changes</button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  // Player Statistics & Leaderboards
  if (activeTab === 'players') {
    return (
      <div className="space-y-6">
        {/* Core numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Total Players</span>
            <span className="text-2xl font-black text-sports-cyan mt-1">{PLAYERS_STATISTICS.total.toLocaleString()}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Active Players</span>
            <span className="text-2xl font-black text-emerald-400 mt-1">{PLAYERS_STATISTICS.active.toLocaleString()}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">New This Month</span>
            <span className="text-2xl font-black text-pink-400 mt-1">+{PLAYERS_STATISTICS.newRegistrationsThisMonth}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">National Pool Rating</span>
            <span className="text-2xl font-black text-yellow-400 mt-1">9.4 / 10</span>
          </div>
        </div>

        {/* Players by Demographic Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl space-y-4">
            <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-2">
              Players Distribution By District (Tamil Nadu Top 5)
            </h4>
            <div className="space-y-3 font-mono text-xs">
              {PLAYERS_STATISTICS.byDistrict.map(d => (
                <div key={d.name} className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-900">
                  <span className="text-slate-300">📍 {d.name} District</span>
                  <span className="text-sports-cyan font-bold">{d.count.toLocaleString()} Players</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl space-y-4">
            <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-2">
              Players Distribution By Sport Discipline
            </h4>
            <div className="space-y-3 font-mono text-xs">
              {PLAYERS_STATISTICS.bySport.map(s => (
                <div key={s.name} className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-900">
                  <span className="text-slate-300">🏃 {s.name}</span>
                  <span className="text-indigo-400 font-bold">{s.count.toLocaleString()} Players</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboards Tab: Players & Coaches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Players Leaderboard */}
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl space-y-4">
            <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-2 flex justify-between items-center">
              <span>🏆 Top Performers Leaderboard</span>
              <span className="text-[10px] font-mono text-slate-500">Points Rating</span>
            </h4>
            <div className="space-y-2">
              {LEADERBOARDS.players.map((p, idx) => (
                <div key={p.name} className="bg-slate-950/70 p-3 rounded-lg border border-slate-900 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono text-[10px] ${
                      idx === 0 ? 'bg-yellow-400 text-slate-950' :
                      idx === 1 ? 'bg-slate-300 text-slate-950' :
                      idx === 2 ? 'bg-amber-600 text-white' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {p.rank}
                    </span>
                    <div>
                      <div className="font-bold text-slate-200">{p.name}</div>
                      <div className="text-[10px] text-slate-500">{p.sport} | {p.district}</div>
                    </div>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">{p.performancePoints} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Teams Leaderboard */}
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl space-y-4">
            <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-2 flex justify-between items-center">
              <span>🛡️ Top Performing Teams</span>
              <span className="text-[10px] font-mono text-slate-500">Wins - Losses</span>
            </h4>
            <div className="space-y-2">
              {LEADERBOARDS.teams.map((t, idx) => (
                <div key={t.name} className="bg-slate-950/70 p-3 rounded-lg border border-slate-900 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono text-[10px] ${
                      idx === 0 ? 'bg-yellow-400 text-slate-950' :
                      idx === 1 ? 'bg-slate-300 text-slate-950' :
                      idx === 2 ? 'bg-amber-600 text-white' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {t.rank}
                    </span>
                    <div>
                      <div className="font-bold text-slate-200">{t.name}</div>
                      <div className="text-[10px] text-slate-500">{t.sport} | {t.district}</div>
                    </div>
                  </div>
                  <span className="font-mono text-sports-cyan font-bold">{t.wins}W - {t.losses}L</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Records & Achievements
  if (activeTab === 'records') {
    return (
      <div className="space-y-6">
        <div className="bg-slate-900/50 p-5 border border-slate-800 rounded-xl space-y-3">
          <h3 className="font-extrabold text-sm text-slate-200 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" /> State Records & Hall of Fame Achievements
          </h3>
          <p className="text-xs text-slate-400">Validated state and national record parameters established under Tamil Nadu Sports Development Authority guidance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Best Performers */}
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl space-y-4">
            <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-2">
              Outstanding Entities
            </h4>
            <div className="space-y-3">
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-900 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-mono">Best District Rating</span>
                  <div className="font-bold text-slate-200 mt-0.5">{RECORDS_ACHIEVEMENTS.bestDistrict}</div>
                </div>
                <MapPin className="w-5 h-5 text-sports-cyan" />
              </div>
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-900 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-mono">Best Performing Association</span>
                  <div className="font-bold text-slate-200 mt-0.5">{RECORDS_ACHIEVEMENTS.bestFederation}</div>
                </div>
                <Award className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
          </div>

          {/* National Record Holders */}
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl space-y-4">
            <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-2">
              National Record Holders (TN State Delegation)
            </h4>
            <div className="space-y-3 font-mono">
              {RECORDS_ACHIEVEMENTS.nationalRecordHolders.map(r => (
                <div key={r.name} className="bg-slate-950/70 p-3 rounded-lg border border-slate-900 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-200">{r.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Event Discipline: {r.event}</div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">{r.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tournament Champions */}
        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl space-y-4">
          <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-2">
            Recent Tournament Champions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            {RECORDS_ACHIEVEMENTS.champions.map(c => (
              <div key={c.event} className="bg-slate-950/60 p-3 rounded border border-slate-900 flex justify-between items-center">
                <div>
                  <div className="text-slate-400">{c.event}</div>
                  <div className="font-bold text-emerald-400 mt-1">🏆 Winner: {c.champion}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Reports Generation and Download section
  if (activeTab === 'reports') {
    const reportCategories = [
      { id: 'reg', title: 'Registration Summary Report', desc: 'Analyzes demographic growth, age indices, and participant participation ratios.' },
      { id: 'fed', title: 'Federation Performance Audit', desc: 'Contains medals tallies, active coach lists, and licensing compliance parameters.' },
      { id: 'dept', title: 'Department Budget & Athletes Allocation', desc: 'Outlines cash flows, sports assigned, and performance score benchmarks.' },
      { id: 'play', title: 'Statewide Player Leaderboards', desc: 'Shows complete player ranking directories sorted by achievements.' },
      { id: 'tour', title: 'Tournament Operations Log', desc: 'Reports on registration margins, team assignments, and final score updates.' },
      { id: 'medal', title: 'Medal Tally & Merit Standing', desc: 'Aggregated gold, silver, and bronze details by district and sport.' },
      { id: 'dist', title: 'District Performance Trends', desc: 'Highlights participation growth ratios across 38 Tamil Nadu districts.' }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-slate-900/50 p-5 border border-slate-800 rounded-xl">
          <h3 className="font-extrabold text-sm text-slate-200 flex items-center gap-2">
            <FileText className="w-5 h-5 text-sports-cyan" /> Downloadable Operations Reports
          </h3>
          <p className="text-xs text-slate-400 mt-1">Export comprehensive reports containing validated datasets into CSV format (compatible with Microsoft Excel) or print styled PDF logs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCategories.map(r => (
            <div key={r.id} className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl flex flex-col justify-between space-y-4 shadow-lg hover:border-slate-700 transition">
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider">{r.title}</h4>
                <p className="text-[11px] text-slate-400 leading-normal font-medium">{r.desc}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExportExcel(r.title)}
                  className="flex-1 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-300 rounded py-1.5 font-bold font-mono text-[10px] flex items-center justify-center gap-1 transition"
                >
                  <Download className="w-3 h-3 text-emerald-400" /> Excel (.CSV)
                </button>
                <button
                  onClick={() => handleExportPDF(r.title)}
                  className="flex-1 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-300 rounded py-1.5 font-bold font-mono text-[10px] flex items-center justify-center gap-1 transition"
                >
                  <FileText className="w-3 h-3 text-red-400" /> PDF Log
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Admins module
  if (activeTab === 'admins') {
    return (
      <div className="space-y-6">
        {/* Create Department Admin */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-4">
          <h3 className="font-extrabold text-sm text-slate-200">Create a Department Admin</h3>
          <p className="text-slate-400 text-xs font-semibold">Create and assign an administrator to manage a specific department's approvals and federations.</p>
          <form onSubmit={handleCreateDeptAdmin} autoComplete="off" className="space-y-4 text-xs max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none"
                  value={newDeptAdmin.full_name}
                  onChange={(e) => setNewDeptAdmin({ ...newDeptAdmin, full_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  autoComplete="off"
                  placeholder="e.g. admin@dept.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
                  value={newDeptAdmin.email}
                  onChange={(e) => setNewDeptAdmin({ ...newDeptAdmin, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none"
                  value={newDeptAdmin.password}
                  onChange={(e) => setNewDeptAdmin({ ...newDeptAdmin, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Associated Department</label>
                <select
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none"
                  value={newDeptAdmin.department_id}
                  onChange={(e) => setNewDeptAdmin({ ...newDeptAdmin, department_id: e.target.value })}
                >
                  <option value="">-- Choose Department --</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="px-4 py-2.5 rounded bg-sports-cyan text-slate-950 font-bold uppercase cursor-pointer">
              {loading ? 'Creating...' : 'Create Department Admin'}
            </button>
          </form>
        </div>

        {/* List of Department Admins */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl space-y-3">
          <h4 className="font-extrabold text-xs text-slate-200 flex justify-between items-center uppercase tracking-wider">
            <span>Active Department Admins</span>
            <span className="bg-emerald-950 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-900">Total: {deptAdmins.length}</span>
          </h4>
          {deptAdmins.length === 0 ? (
            <p className="text-slate-500 text-xs italic">No department admins created yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {deptAdmins.map(admin => {
                const dept = departments.find(d => d.id === admin.department_id);
                return (
                  <div key={admin.id} className="bg-slate-950/60 p-3 rounded border border-slate-900 text-slate-300">
                    <div className="font-bold text-slate-200">👤 {admin.full_name}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">{admin.email}</div>
                    <div className="text-[10px] text-sports-cyan mt-1">Managed Dept: {dept ? dept.name : `ID: ${admin.department_id}`}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Users tab
  if (activeTab === 'users') {
    const filteredUsers = usersList.filter(u => 
      u.full_name.toLowerCase().includes(playerSearch.toLowerCase()) || 
      u.email.toLowerCase().includes(playerSearch.toLowerCase())
    );

    return (
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-800 pb-4">
          <h3 className="font-extrabold text-sm text-slate-200">Manage Registered Users</h3>
          <div className="relative w-full max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-4 h-4 text-slate-500" />
            </span>
            <input
              type="text"
              placeholder="Search user profiles..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sports-cyan placeholder-slate-500"
              value={playerSearch}
              onChange={(e) => setPlayerSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Role</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="border-b border-slate-850 hover:bg-slate-900/20">
                  <td className="py-2 px-3 font-semibold">{u.full_name}</td>
                  <td className="py-2 px-3 font-mono">{u.email}</td>
                  <td className="py-2 px-3 capitalize">{u.role.replace('_', ' ')}</td>
                  <td className="py-2 px-3">
                    {u.is_approved ? (
                      <span className="text-emerald-400 font-bold bg-emerald-950/35 px-1.5 py-0.5 rounded">Active</span>
                    ) : (
                      <span className="text-amber-400 bg-amber-950/35 px-1.5 py-0.5 rounded">Pending/Blocked</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {u.role !== 'super_admin' && (
                        u.is_approved ? (
                          <button
                            type="button"
                            onClick={() => handleBlockUser(u.id)}
                            title="Block User"
                            className="w-8 h-8 flex items-center justify-center bg-slate-850 hover:bg-slate-800 text-amber-400 rounded-lg border border-slate-700/60 cursor-pointer transition duration-150"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUnblockUser(u.id)}
                            title="Unblock User"
                            className="w-8 h-8 flex items-center justify-center bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 rounded-lg border border-emerald-800/60 cursor-pointer transition duration-150"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )
                      )}
                      {u.role !== 'super_admin' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id)}
                          title="Delete User"
                          className="w-8 h-8 flex items-center justify-center bg-red-950/60 hover:bg-red-900 text-red-400 rounded-lg border border-red-900/60 cursor-pointer transition duration-150"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Tournaments view
  if (activeTab === 'tournaments') {
    return (
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl space-y-4">
        <h3 className="font-extrabold text-sm text-slate-200">Registered Tournaments</h3>
        <div className="space-y-4">
          {tournaments.map(t => {
            const isExpanded = !!expandedTournaments[t.id];
            return (
              <div key={t.id} className="bg-slate-950/60 p-5 rounded border border-slate-800 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <div className="font-bold text-slate-200 text-sm">🏆 {t.name}</div>
                    <div className="text-slate-400 mt-1">Status: <span className="capitalize font-semibold text-sports-cyan">{t.status.replace('_', ' ')}</span></div>
                    <div className="text-slate-500 mt-0.5 font-mono">Slots: {t.teams ? t.teams.length : 0} / {t.number_of_entry} Teams</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTournament(t.id)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-850 text-sports-cyan border border-slate-800 rounded font-semibold cursor-pointer transition duration-150"
                    >
                      {isExpanded ? 'Hide Details' : 'View Teams & Players'}
                    </button>
                    <button
                      onClick={() => handleDeleteTournament(t.id)}
                      className="px-3 py-1 bg-red-950 hover:bg-red-900 text-red-200 rounded border border-red-900/50 font-semibold cursor-pointer transition duration-150"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-900 pt-4 space-y-4">
                    <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Registered Teams ({t.teams ? t.teams.length : 0})</h4>
                    {(!t.teams || t.teams.length === 0) ? (
                      <p className="text-slate-500 italic text-[11px]">No teams registered in this tournament yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {t.teams.map(team => (
                          <div key={team.id} className="bg-slate-900/40 border border-slate-800/60 p-3 rounded space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-200 text-[11px]">🛡️ {team.name}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-mono font-bold ${team.status === 'approved'
                                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40'
                                : 'bg-amber-950/40 text-amber-400 border border-amber-900/40'
                                }`}>
                                {team.status}
                              </span>
                            </div>
                            {team.coach && (
                              <div className="text-[10px] text-slate-400">
                                <span className="text-slate-500">Coach:</span> {team.coach.full_name}
                              </div>
                            )}
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Players ({team.players ? team.players.length : 0})</span>
                              {(!team.players || team.players.length === 0) ? (
                                <p className="text-slate-500 italic text-[10px]">No players in squad.</p>
                              ) : (
                                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-slate-300 font-mono">
                                  {team.players.map(tp => (
                                    <div key={tp.id} className="truncate">
                                      • {tp.player.full_name}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {tournaments.length === 0 && (
            <p className="text-slate-500 italic">No tournaments available.</p>
          )}
        </div>
      </div>
    );
  }

  // Matches tab
  if (activeTab === 'matches') {
    const live = matches.filter(m => m.status === 'live');
    const upcoming = matches.filter(m => m.status === 'scheduled');
    const finished = matches.filter(m => m.status === 'completed');

    return (
      <div className="space-y-6 text-xs">
        {/* Live Matches */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
          <h3 className="font-bold text-red-500 text-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            Live Matches ({live.length})
          </h3>
          {live.length === 0 ? (
            <p className="text-slate-500 italic">No matches currently live.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {live.map(m => (
                <div key={m.id} className="bg-slate-950/60 p-4 rounded border border-red-950/40 space-y-2">
                  <div className="font-bold text-slate-100 flex justify-between items-center">
                    <span>{m.team_a.name} vs {m.team_b.name}</span>
                    <button
                      onClick={() => onSelectMatch(m)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-850 text-sports-cyan border border-slate-800 rounded font-bold text-[10px] cursor-pointer uppercase tracking-wider"
                    >
                      View
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    <div className="flex justify-between">
                      <span>{m.team_a.name}:</span>
                      <span className="text-slate-200 font-bold">{m.team_a_runs}/{m.team_a_wickets} ({m.team_a_overs} ov)</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>{m.team_b.name}:</span>
                      <span className="text-slate-200 font-bold">{m.team_b_runs}/{m.team_b_wickets} ({m.team_b_overs} ov)</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-1.5 font-mono">
                    League: {m.tournament.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Matches */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
          <h3 className="font-bold text-slate-200 text-sm">Upcoming Fixtures ({upcoming.length})</h3>
          {upcoming.length === 0 ? (
            <p className="text-slate-500 italic">No upcoming fixtures scheduled.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {upcoming.map(m => (
                <div key={m.id} className="bg-slate-950/60 p-4 rounded border border-slate-850 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-semibold text-slate-100">{m.team_a.name} vs {m.team_b.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Tournament: {m.tournament.name}</div>
                    <div className="text-[10px] text-sports-cyan font-bold uppercase tracking-wider font-mono mt-0.5">Status: Scheduled</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectMatch(m)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-850 text-sports-cyan border border-slate-800 rounded font-bold text-[10px] cursor-pointer uppercase tracking-wider"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteMatch(m.id)}
                      className="px-2 py-1 bg-red-950 hover:bg-red-900 text-red-200 rounded border border-red-900/50 font-semibold text-[10px] cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Finished Matches */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
          <h3 className="font-bold text-slate-200 text-sm">Finished Matches ({finished.length})</h3>
          {finished.length === 0 ? (
            <p className="text-slate-500 italic">No finished matches.</p>
          ) : (
            <div className="space-y-2.5">
              {finished.map(m => {
                const winnerName = m.winner_id === m.team_a_id ? m.team_a.name : (m.winner_id === m.team_b_id ? m.team_b.name : 'Draw / No Result');
                return (
                  <div key={m.id} className="bg-slate-950/60 p-4 rounded border border-slate-850 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-xs">
                    <div>
                      <div className="font-semibold text-slate-100">{m.team_a.name} vs {m.team_b.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">Tournament: {m.tournament.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Scores: {m.team_a.name} ({m.team_a_runs}/{m.team_a_wickets}) | {m.team_b.name} ({m.team_b_runs}/{m.team_b_wickets})
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onSelectMatch(m)}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-850 text-sports-cyan border border-slate-800 rounded font-bold text-[10px] cursor-pointer uppercase tracking-wider"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteMatch(m.id)}
                        className="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-200 rounded border border-red-900/50 font-semibold text-[10px] cursor-pointer"
                      >
                        Delete
                      </button>
                      <div className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider">
                        🏆 Winner: {winnerName}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mailbox logs
  if (activeTab === 'mailbox') {
    return (
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl space-y-4">
        <h3 className="font-bold text-lg text-slate-200 flex items-center gap-2">
          📬 Simulated Mailbox Logs
        </h3>
        <p className="text-xs text-slate-400">Emails triggered by the system register/invite flows will log here in real-time for verification purposes.</p>

        {notificationLogs.length === 0 ? (
          <p className="text-slate-500 text-xs italic">No email logs dispatched yet.</p>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {notificationLogs.map(log => (
              <div key={log.id} className="bg-slate-950/60 border border-slate-800 p-4 rounded text-xs space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span className="text-sports-cyan">To: {log.recipient_email}</span>
                  <span>{new Date(log.sent_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) + ' IST'}</span>
                </div>
                <div className="font-bold text-slate-200">{log.subject}</div>
                <div className="text-slate-400 whitespace-pre-wrap leading-tight text-xs bg-slate-950/90 p-3 rounded border border-slate-900 font-mono">
                  {log.body}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
