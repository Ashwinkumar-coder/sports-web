import React, { useState } from 'react';
import { Award, MapPin, TrendingUp, Activity, BarChart2, MessageSquare, CheckCircle, Sliders, RotateCw, RefreshCw, Users, Compass } from 'lucide-react';
import { Card, CardHeader, CardTitle } from './ui/Card';
import TamilNaduMap from './TamilNaduGeoMap';

export default function StaticCharts() {
  // Exploded Pie Chart States
  const [rotationAngle, setRotationAngle] = useState(0);
  const [hoveredPieIndex, setHoveredPieIndex] = useState(null);

  // Gender Pie Chart States
  const [genderRotationAngle, setGenderRotationAngle] = useState(0);
  const [hoveredGenderIndex, setHoveredGenderIndex] = useState(null);

  // Map States
  const [selectedMapDistrict, setSelectedMapDistrict] = useState(null);

  // Demographic Chart Tab State
  const [activeDemographicTab, setActiveDemographicTab] = useState('line');

  // Hover states for various charts
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredComplaint, setHoveredComplaint] = useState(null);
  const [hoveredAgeBar, setHoveredAgeBar] = useState(null);

  // ─── Tamil Nadu 38 Districts – real geographic SVG paths ───────────────────
  // viewBox: "0 0 310 395"
  // Projection: x = (lon - 76.20) * 73.8,  y = (13.55 - lat) * 70.9
  // State boundary reference:
  // M 6,113 L 7,102 L 59,74 L 114,46 L 144,14 L 173,18 L 221,0 L 269,7
  //   L 301,32 L 306,50 L 295,82 L 280,131 L 269,173 L 269,202 L 280,223
  //   L 265,262 L 243,294 L 218,308 L 192,322 L 148,354 L 122,372 L 103,386
  //   L 74,386 L 74,368 L 55,340 L 38,290 L 13,262 L 2,226 L 1,180 L 2,148
  //   L 6,134 Z
  const districts38 = [
    // ── NORTH BORDER STRIP ──────────────────────────────────────────────────
    { name: 'Krishnagiri',   registrations: 2310, color: '#ef4444', percentage: 5,
      path: 'M 59,74 L 114,46 L 144,14 L 162,14 L 162,92 L 60,92 Z' },
    { name: 'Tirupattur',    registrations: 1540, color: '#f97316', percentage: 3,
      path: 'M 144,14 L 173,18 L 200,10 L 200,92 L 162,92 L 162,14 Z' },
    { name: 'Vellore',       registrations: 2710, color: '#f59e0b', percentage: 6,
      path: 'M 173,18 L 221,0 L 244,0 L 244,92 L 200,92 L 200,10 Z' },
    { name: 'Ranipet',       registrations: 1850, color: '#eab308', percentage: 4,
      path: 'M 221,0 L 258,6 L 250,70 L 244,70 L 244,0 Z' },
    { name: 'Tiruvallur',    registrations: 3450, color: '#84cc16', percentage: 8,
      path: 'M 244,70 L 250,70 L 258,6 L 269,7 L 288,38 L 285,92 L 256,92 L 244,92 Z' },
    { name: 'Chennai',       registrations: 8420, color: '#22c55e', percentage: 19,
      path: 'M 285,92 L 288,38 L 301,32 L 306,50 L 295,82 L 280,92 Z' },
    // ── NORTH-WEST STRIP ────────────────────────────────────────────────────
    { name: 'Nilgiris',      registrations: 1250, color: '#10b981', percentage: 2,
      path: 'M 6,113 L 7,102 L 59,74 L 62,92 L 62,162 L 2,162 L 6,134 Z' },
    // ── SECOND ROW INTERIOR ─────────────────────────────────────────────────
    { name: 'Dharmapuri',    registrations: 1890, color: '#14b8a6', percentage: 4,
      path: 'M 62,92 L 162,92 L 162,138 L 100,138 L 62,130 Z' },
    { name: 'Salem',         registrations: 3210, color: '#06b6d4', percentage: 7,
      path: 'M 100,138 L 162,138 L 200,92 L 210,138 L 200,175 L 160,175 L 100,165 Z' },
    { name: 'Tiruvannamalai',registrations: 2430, color: '#0ea5e9', percentage: 5,
      path: 'M 200,92 L 244,92 L 256,92 L 260,138 L 245,175 L 210,175 L 210,138 Z' },
    { name: 'Kanchipuram',   registrations: 2900, color: '#3b82f6', percentage: 6,
      path: 'M 256,92 L 285,92 L 295,82 L 280,131 L 268,138 L 260,138 Z' },
    { name: 'Chengalpattu',  registrations: 3120, color: '#6366f1', percentage: 7,
      path: 'M 260,138 L 268,138 L 280,131 L 275,175 L 256,180 L 245,175 Z' },
    // ── THIRD ROW ───────────────────────────────────────────────────────────
    { name: 'Coimbatore',    registrations: 6150, color: '#8b5cf6', percentage: 14,
      path: 'M 2,162 L 62,162 L 90,162 L 90,215 L 2,215 L 1,180 Z' },
    { name: 'Erode',         registrations: 2540, color: '#a855f7', percentage: 5,
      path: 'M 62,130 L 100,138 L 100,165 L 118,175 L 118,205 L 90,205 L 90,162 L 62,162 Z' },
    { name: 'Namakkal',      registrations: 2150, color: '#d946ef', percentage: 5,
      path: 'M 100,165 L 160,175 L 158,210 L 118,205 L 118,175 Z' },
    { name: 'Karur',         registrations: 1720, color: '#ec4899', percentage: 4,
      path: 'M 118,205 L 158,210 L 158,245 L 118,245 Z' },
    { name: 'Tiruchirappalli',registrations:3950, color: '#f43f5e', percentage: 9,
      path: 'M 158,175 L 200,175 L 215,200 L 205,245 L 158,245 L 158,210 Z' },
    { name: 'Perambalur',    registrations: 1120, color: '#4ade80', percentage: 2,
      path: 'M 200,175 L 245,175 L 245,205 L 220,210 L 215,200 Z' },
    { name: 'Ariyalur',      registrations: 1340, color: '#2dd4bf', percentage: 3,
      path: 'M 215,200 L 220,210 L 245,205 L 255,228 L 225,235 L 205,225 Z' },
    { name: 'Kallakurichi',  registrations: 1980, color: '#38bdf8', percentage: 4,
      path: 'M 245,175 L 256,180 L 262,205 L 245,205 Z' },
    { name: 'Villupuram',    registrations: 2890, color: '#ef4444', percentage: 6,
      path: 'M 256,180 L 275,175 L 275,202 L 269,202 L 262,205 Z' },
    { name: 'Cuddalore',     registrations: 2650, color: '#f97316', percentage: 6,
      path: 'M 262,205 L 269,202 L 280,223 L 270,230 L 255,228 L 245,205 Z' },
    // ── FOURTH ROW ──────────────────────────────────────────────────────────
    { name: 'Tiruppur',      registrations: 2780, color: '#f59e0b', percentage: 6,
      path: 'M 90,205 L 118,205 L 118,245 L 90,245 L 90,215 Z' },
    { name: 'Dindigul',      registrations: 2300, color: '#eab308', percentage: 5,
      path: 'M 90,245 L 118,245 L 158,245 L 158,285 L 118,285 L 90,268 Z' },
    { name: 'Theni',         registrations: 1670, color: '#84cc16', percentage: 3,
      path: 'M 38,290 L 90,268 L 90,245 L 90,215 L 55,225 L 38,260 Z' },
    { name: 'Thanjavur',     registrations: 2450, color: '#22c55e', percentage: 5,
      path: 'M 205,225 L 225,235 L 230,262 L 195,268 L 190,248 Z' },
    { name: 'Mayiladuthurai',registrations: 1590, color: '#10b981', percentage: 3,
      path: 'M 225,235 L 255,228 L 258,255 L 235,262 L 230,262 Z' },
    { name: 'Tiruvarur',     registrations: 1680, color: '#14b8a6', percentage: 4,
      path: 'M 235,262 L 258,255 L 265,262 L 248,275 L 235,272 Z' },
    { name: 'Nagapattinam',  registrations: 1450, color: '#06b6d4', percentage: 3,
      path: 'M 248,275 L 265,262 L 270,275 L 256,290 L 248,285 Z' },
    { name: 'Pudukkottai',   registrations: 2210, color: '#0ea5e9', percentage: 5,
      path: 'M 158,245 L 205,245 L 190,248 L 195,268 L 175,285 L 158,285 Z' },
    // ── FIFTH ROW ───────────────────────────────────────────────────────────
    { name: 'Madurai',       registrations: 4890, color: '#3b82f6', percentage: 11,
      path: 'M 90,268 L 158,285 L 155,315 L 115,318 L 90,300 L 90,268 Z' },
    { name: 'Sivagangai',    registrations: 2010, color: '#6366f1', percentage: 4,
      path: 'M 158,285 L 175,285 L 195,268 L 218,285 L 218,308 L 192,322 L 160,322 L 155,315 Z' },
    { name: 'Ramanathapuram',registrations: 1950, color: '#8b5cf6', percentage: 4,
      path: 'M 218,285 L 243,294 L 256,290 L 248,285 L 248,318 L 192,322 L 218,308 Z' },
    // ── SIXTH ROW ───────────────────────────────────────────────────────────
    { name: 'Tenkasi',       registrations: 1780, color: '#a855f7', percentage: 4,
      path: 'M 38,290 L 55,290 L 78,310 L 78,345 L 55,340 Z' },
    { name: 'Virudhunagar',  registrations: 2240, color: '#d946ef', percentage: 5,
      path: 'M 78,310 L 115,318 L 155,315 L 160,322 L 148,354 L 110,348 L 78,345 Z' },
    { name: 'Thoothukudi',   registrations: 1950, color: '#ec4899', percentage: 4,
      path: 'M 160,322 L 192,322 L 192,322 L 148,354 L 160,322 Z' },
    // ── SOUTH TIP ───────────────────────────────────────────────────────────
    { name: 'Tirunelveli',   registrations: 2800, color: '#f43f5e', percentage: 6,
      path: 'M 78,345 L 110,348 L 122,372 L 103,386 L 78,372 L 74,368 Z' },
    { name: 'Kanyakumari',   registrations: 2100, color: '#4ade80', percentage: 5,
      path: 'M 78,372 L 103,386 L 74,386 L 74,368 Z' },
  ];

  // Active top districts list for rendering list values
  const activeDistrictsList = districts38.slice(0, 8);

  // Sports registration distribution (Solid Exploded Pie data)
  const sportsRegistrationData = [
    { sport: 'Cricket', count: '17,128 Players', percentage: 40, color: '#84cc16' },
    { sport: 'Kabaddi', count: '10,705 Players', percentage: 25, color: '#22c55e' },
    { sport: 'Athletics', count: '6,423 Players', percentage: 15, color: '#10b981' },
    { sport: 'Football', count: '5,138 Players', percentage: 12, color: '#14b8a6' },
    { sport: 'Basketball', count: '3,426 Players', percentage: 8, color: '#06b6d4' },
  ];

  // Gender Participation Statistics: Total 42,820
  const genderParticipationData = [
    { gender: 'Male', count: '26.5k', percentage: 62, color: '#0ea5e9' },
    { gender: 'Female', count: '15.9k', percentage: 37, color: '#3b82f6' },
    { gender: 'Other', count: '350', percentage: 1, color: '#6366f1' },
  ];

  // Age Category Distribution: Total 42,820
  const ageCategoryData = [
    { ageGroup: 'Under-14', count: 6420, percentage: 15, color: '#8b5cf6' },
    { ageGroup: 'Under-17', count: 12840, percentage: 30, color: '#a855f7' },
    { ageGroup: 'Under-19', count: 10700, percentage: 25, color: '#d946ef' },
    { ageGroup: 'Under-25', count: 8560, percentage: 20, color: '#ec4899' },
    { ageGroup: 'Seniors', count: 4300, percentage: 10, color: '#f43f5e' },
  ];

  // Monthly Growth Data
  const monthlyGrowthData = [
    { month: 'Jan', count: 850, x: 30, y: 110 },
    { month: 'Feb', count: 1100, x: 80, y: 95 },
    { month: 'Mar', count: 1250, x: 130, y: 85 },
    { month: 'Apr', count: 1400, x: 180, y: 70 },
    { month: 'May', count: 1800, x: 230, y: 45 },
    { month: 'Jun', count: 2300, x: 280, y: 20 },
  ];

  // Sports performance points index (Sport Index Performance data)
  const sportsPointsData = [
    { sport: 'Cricket', score: 95, color: '#ef4444' },
    { sport: 'Athletics', score: 85, color: '#f97316' },
    { sport: 'Kabaddi', score: 78, color: '#f59e0b' },
    { sport: 'Football', score: 72, color: '#eab308' },
    { sport: 'Hockey', score: 65, color: '#84cc16' },
  ];

  // Complaints Data: Raised vs Actioned (Full Datasets)
  const complaintsData = [
    { month: 'Jan', raised: 45, actioned: 38 },
    { month: 'Feb', raised: 55, actioned: 48 },
    { month: 'Mar', raised: 70, actioned: 62 },
    { month: 'Apr', raised: 60, actioned: 58 },
    { month: 'May', raised: 85, actioned: 76 },
    { month: 'Jun', raised: 98, actioned: 92 },
  ];

  // Generate SVG path for interactive solid exploded slices (innerRadius = 0)
  const getSlicePath = (startPercent, endPercent, radius, innerRadius = 0) => {
    const startAngle = startPercent * 2 * Math.PI - Math.PI / 2;
    const endAngle = endPercent * 2 * Math.PI - Math.PI / 2;

    const x1 = 100 + radius * Math.cos(startAngle);
    const y1 = 100 + radius * Math.sin(startAngle);
    const x2 = 100 + radius * Math.cos(endAngle);
    const y2 = 100 + radius * Math.sin(endAngle);

    const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;

    if (innerRadius === 0) {
      return `
        M 100 100
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;
    }

    const ix1 = 100 + innerRadius * Math.cos(endAngle);
    const iy1 = 100 + innerRadius * Math.sin(endAngle);
    const ix2 = 100 + innerRadius * Math.cos(startAngle);
    const iy2 = 100 + innerRadius * Math.sin(startAngle);

    return `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${ix1} ${iy1}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix2} ${iy2}
      Z
    `;
  };

  // Calculate cumulative percentages for Sports segments
  let accumulatedPercent = 0;
  const pieSegments = sportsRegistrationData.map((item, index) => {
    const start = accumulatedPercent;
    const end = accumulatedPercent + item.percentage / 100;
    accumulatedPercent = end;

    const midAngle = ((start + end) / 2) * 2 * Math.PI - Math.PI / 2;
    const isHovered = hoveredPieIndex === index;
    const explodeDist = isHovered ? 12 : 5;
    const dx = Math.cos(midAngle) * explodeDist;
    const dy = Math.sin(midAngle) * explodeDist;

    return { ...item, start, end, dx, dy, index };
  });

  // Calculate cumulative percentages for Gender segments
  let accumulatedGenderPercent = 0;
  const genderSegments = genderParticipationData.map((item, index) => {
    const start = accumulatedGenderPercent;
    const end = accumulatedGenderPercent + item.percentage / 100;
    accumulatedGenderPercent = end;

    const midAngle = ((start + end) / 2) * 2 * Math.PI - Math.PI / 2;
    const isHovered = hoveredGenderIndex === index;
    const explodeDist = isHovered ? 12 : 5;
    const dx = Math.cos(midAngle) * explodeDist;
    const dy = Math.sin(midAngle) * explodeDist;

    return { ...item, start, end, dx, dy, index };
  });

  return (
    <div className="space-y-6 mt-6">
      {/* Brand Header */}
      <div className="border-t border-[var(--border-default)] pt-6">
        <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-[var(--accent)] animate-pulse" />
          ADVENIRE Sports Growth & Performance Analytics Dashboard
        </h3>
      </div>

      {/* Main Grid: exact Tamil Nadu Map & Demographic Plots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Map Panel: 5 columns */}
        <Card className="lg:col-span-5 p-5 bg-slate-900/40 border border-slate-800 shadow-xl hover:border-slate-700 transition duration-300 flex flex-col justify-between card-3d">
          <CardHeader className="p-0 mb-4 flex justify-between items-start">
            <div>
              <CardTitle className="text-xs uppercase tracking-wider font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--accent)]" />
                Tamil Nadu Map (Regional Players)
              </CardTitle>
              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-semibold">
                Exact geographic distribution of active players in Tamil Nadu
              </p>
            </div>
            <div className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-[9px] font-mono text-[var(--accent)] font-black">
              TOTAL: 93,620 PLAYERS
            </div>
          </CardHeader>

          <TamilNaduMap
            selectedMapDistrict={selectedMapDistrict}
            setSelectedMapDistrict={setSelectedMapDistrict}
            districts38={districts38}
          />

          <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-mono">
            {activeDistrictsList.map((d, i) => {
              const overallIdx = districts38.findIndex(item => item.name === d.name);
              return (
                <div
                  key={d.name}
                  className={`flex justify-between items-center px-2 py-1.5 rounded border transition cursor-pointer ${selectedMapDistrict === overallIdx ? 'bg-slate-950 border-[var(--accent)]' : 'bg-slate-950/40 border-slate-900/50'}`}
                  onMouseEnter={() => setSelectedMapDistrict(overallIdx)}
                  onMouseLeave={() => setSelectedMapDistrict(null)}
                >
                  <span className="text-slate-300 font-semibold">{d.name}</span>
                  <span className="text-[10px] text-[var(--accent)] font-bold">{d.registrations.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Demographics Tabbed Plots: 7 columns */}
        <Card className="lg:col-span-7 p-5 bg-slate-900/40 border border-slate-800 shadow-xl hover:border-slate-700 transition duration-300 flex flex-col justify-between card-3d">
          <CardHeader className="p-0 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <CardTitle className="text-xs uppercase tracking-wider font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
                District Demographics Analytics
              </CardTitle>
              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-semibold">
                Toggle plot views using district data to analyze concentrations
              </p>
            </div>

            {/* Total Badge & Controls */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[8px] font-mono text-[var(--accent)]">
                TOTAL SAMPLES: 31,520
              </div>
              <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5 font-mono text-[9px]">
                {['line', 'scatter', 'area', 'density'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveDemographicTab(tab)}
                    className={`px-2.5 py-1 rounded-md uppercase font-bold transition-all ${activeDemographicTab === tab ? 'bg-[var(--accent)] text-slate-950' : 'text-slate-400 hover:text-white'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          {/* Plot container */}
          <div className="relative h-64 w-full bg-slate-950/40 rounded-xl p-4 border border-slate-900 flex flex-col justify-end">
            <svg viewBox="0 0 400 180" className="w-full h-full">
              {/* Gradients */}
              <defs>
                <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity="0.4" />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="densityColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="30" y1="20" x2="380" y2="20" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
              <line x1="30" y1="60" x2="380" y2="60" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
              <line x1="30" y1="100" x2="380" y2="100" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
              <line x1="30" y1="140" x2="380" y2="140" stroke="rgba(255,255,255,0.05)" />

              {/* Left Y-axis labels */}
              <text x="22" y="23" fill="#64748b" fontSize="8" className="font-mono text-right">8K</text>
              <text x="22" y="63" fill="#64748b" fontSize="8" className="font-mono text-right">5K</text>
              <text x="22" y="103" fill="#64748b" fontSize="8" className="font-mono text-right">3K</text>
              <text x="22" y="143" fill="#64748b" fontSize="8" className="font-mono text-right">0</text>

              {/* Plot rendering logic based on active tab */}

              {/* Tab 1: Line Chart */}
              {activeDemographicTab === 'line' && (
                <g>
                  <path
                    d="M 50,25 L 100,55 L 150,75 L 200,90 L 250,105 L 300,112 L 350,114"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              )}

              {/* Tab 3: Area Chart */}
              {activeDemographicTab === 'area' && (
                <g>
                  <path
                    d="M 50,25 L 100,55 L 150,75 L 200,90 L 250,105 L 300,112 L 350,114 L 350,140 L 50,140 Z"
                    fill="url(#areaColor)"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* Tab 4: Density Curve (Bezier Splines) */}
              {activeDemographicTab === 'density' && (
                <g>
                  <path
                    d="M 50,140 C 70,10 100,30 150,65 C 200,100 230,85 280,108 C 320,130 330,138 350,140 Z"
                    fill="url(#densityColor)"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* Dynamic Interactive Scatter Points for all modes */}
              {activeDistrictsList.map((d, i) => {
                const step = 300 / (activeDistrictsList.length - 1);
                const plotX = 50 + i * step;

                // Scale registrations to height: max 8420 -> mapping to height range (20 to 140)
                const plotY = 140 - ((d.registrations) / 9000) * 120;
                const isHovered = hoveredPoint === i;

                return (
                  <g key={d.name}>
                    {/* Vertical guideline */}
                    {isHovered && (
                      <line x1={plotX} y1="20" x2={plotX} y2="140" stroke="rgba(255,255,255,0.15)" strokeDasharray="2,2" />
                    )}

                    {/* Scatter plot / Curve nodes */}
                    <circle
                      cx={plotX}
                      cy={plotY}
                      r={isHovered ? 7.5 : (activeDemographicTab === 'scatter' ? 6 : 4)}
                      fill={isHovered ? '#ffffff' : (activeDemographicTab === 'density' ? '#06b6d4' : 'var(--accent)')}
                      stroke="#041c32"
                      strokeWidth="2.5"
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredPoint(i)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />

                    {/* X Axis text labels */}
                    <text x={plotX} y="156" textAnchor="middle" fill="#64748b" fontSize="8" className="font-mono font-bold">
                      {d.name.substring(0, 3)}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Micro tooltip */}
            {hoveredPoint !== null && (
              <div className="absolute top-4 right-4 bg-slate-950 border border-[var(--border-default)] px-2.5 py-1 rounded-md text-[9px] font-mono shadow-xl z-20">
                <span className="text-slate-400">{activeDistrictsList[hoveredPoint].name}: </span>
                <span className="text-[var(--accent)] font-bold">{activeDistrictsList[hoveredPoint].registrations.toLocaleString()} Players</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Solid Exploded Pie Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Exploded Pie Chart: Discipline Distribution (Solid Pie Chart - No donut hole) */}
        <Card className="p-5 bg-slate-900/40 border border-slate-800 shadow-xl hover:border-slate-700 transition duration-300 card-3d">
          <CardHeader className="p-0 mb-4 flex justify-between items-start">
            <div>
              <CardTitle className="text-xs uppercase tracking-wider font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                <Award className="w-4 h-4 text-[var(--accent)]" />
                Discipline Distribution (Exploded Solid Pie)
              </CardTitle>
              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-semibold">
                Rotate manually to inspect precise ratios. Hover slices to explode segments outward.
              </p>
            </div>
            <div className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[8px] font-mono text-[var(--accent)] font-bold">
              TOTAL: 42,820 PLAYERS
            </div>
          </CardHeader>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">

            {/* SVG Interactive Solid Pie Graphic */}
            <div className="relative w-44 h-44 shrink-0 bg-slate-950/20 rounded-full border border-slate-900/50 p-2 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <g transform={`rotate(${rotationAngle}, 100, 100)`} className="transition-transform duration-200 ease-out">
                  {pieSegments.map((seg) => {
                    const isSelected = hoveredPieIndex === seg.index;
                    return (
                      <path
                        key={seg.sport}
                        d={getSlicePath(seg.start, seg.end, 85, 0)} // Solid pie: innerRadius = 0
                        fill={seg.color}
                        transform={`translate(${seg.dx}, ${seg.dy})`}
                        className="cursor-pointer transition-all duration-300 hover:brightness-110"
                        onMouseEnter={() => setHoveredPieIndex(seg.index)}
                        onMouseLeave={() => setHoveredPieIndex(null)}
                      />
                    );
                  })}
                </g>
              </svg>

              {/* Static overlay indicator */}
              <div className="absolute bottom-2 right-2 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-[8px] font-mono text-[var(--accent)]">
                {hoveredPieIndex !== null ? sportsRegistrationData[hoveredPieIndex].sport : 'Hover Slices'}
              </div>
            </div>

            {/* Slider & Legend panel */}
            <div className="flex-1 w-full space-y-4">

              {/* Rotation Slider widget */}
              <div className="bg-slate-950/70 border border-slate-900 rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-[var(--accent)]" />
                    MANUAL ROTATION:
                  </span>
                  <span className="text-[var(--accent)] font-bold">{rotationAngle}°</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotationAngle}
                  onChange={(e) => setRotationAngle(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => setRotationAngle((prev) => (prev - 30 + 360) % 360)}
                    className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-300 font-mono text-[9px] py-1 rounded border border-slate-800 flex items-center justify-center gap-1 hover:border-slate-700 transition"
                  >
                    <RotateCw className="w-2.5 h-2.5 transform -scale-x-100" />
                    -30° CCW
                  </button>
                  <button
                    onClick={() => setRotationAngle((prev) => (prev + 30) % 360)}
                    className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-300 font-mono text-[9px] py-1 rounded border border-slate-800 flex items-center justify-center gap-1 hover:border-slate-700 transition"
                  >
                    <RotateCw className="w-2.5 h-2.5" />
                    +30° CW
                  </button>
                </div>
              </div>

              {/* Legends list */}
              <div className="space-y-1.5 text-xs font-mono">
                {sportsRegistrationData.map((item, index) => (
                  <div
                    key={item.sport}
                    className={`flex justify-between items-center bg-slate-950/40 px-2 py-1 rounded border transition cursor-pointer ${hoveredPieIndex === index ? 'bg-slate-950 border-[var(--accent)]' : 'bg-slate-950/20 border-slate-900/50'}`}
                    onMouseEnter={() => setHoveredPieIndex(index)}
                    onMouseLeave={() => setHoveredPieIndex(null)}
                  >
                    <div className="flex items-center gap-2 font-sans">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="text-slate-300 font-semibold">{item.sport}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold font-mono"></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Gender Participation Statistics (Solid Exploded Pie Chart) */}
        <Card className="p-5 bg-slate-900/40 border border-slate-800 shadow-xl hover:border-slate-700 transition duration-300 card-3d">
          <CardHeader className="p-0 mb-4 flex justify-between items-center">
            <div>
              <CardTitle className="text-xs uppercase tracking-wider font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--accent)]" />
                Gender Participation Statistics
              </CardTitle>
              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-semibold">
                Distribution ratio out of 42,820 Total Players
              </p>
            </div>
            <div className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[8px] font-mono text-[var(--accent)] font-bold">
              TOTAL: 42,820 PLAYERS
            </div>
          </CardHeader>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">

            {/* SVG Interactive Solid Pie Graphic */}
            <div className="relative w-44 h-44 shrink-0 bg-slate-950/20 rounded-full border border-slate-900/50 p-2 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <g transform={`rotate(${genderRotationAngle}, 100, 100)`} className="transition-transform duration-200 ease-out">
                  {genderSegments.map((seg) => {
                    return (
                      <path
                        key={seg.gender}
                        d={getSlicePath(seg.start, seg.end, 85, 0)} // Solid pie: innerRadius = 0
                        fill={seg.color}
                        transform={`translate(${seg.dx}, ${seg.dy})`}
                        className="cursor-pointer transition-all duration-300 hover:brightness-110"
                        onMouseEnter={() => setHoveredGenderIndex(seg.index)}
                        onMouseLeave={() => setHoveredGenderIndex(null)}
                      />
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* Controls & Legends */}
            <div className="flex-1 w-full space-y-4">

              {/* Rotation Slider widget */}
              <div className="bg-slate-950/70 border border-slate-900 rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-400">ROTATION ANGLE:</span>
                  <span className="text-[var(--accent)] font-bold">{genderRotationAngle}°</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="360"
                  value={genderRotationAngle}
                  onChange={(e) => setGenderRotationAngle(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                />
              </div>

              {/* Legends list */}
              <div className="space-y-1.5 text-xs font-mono">
                {genderParticipationData.map((item, index) => (
                  <div
                    key={item.gender}
                    className={`flex justify-between items-center bg-slate-950/40 px-2 py-1 rounded border transition cursor-pointer ${hoveredGenderIndex === index ? 'bg-slate-950 border-[var(--accent)]' : 'bg-slate-950/20 border-slate-900/50'}`}
                    onMouseEnter={() => setHoveredGenderIndex(index)}
                    onMouseLeave={() => setHoveredGenderIndex(null)}
                  >
                    <div className="flex items-center gap-2 font-sans">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="text-slate-300 font-semibold">{item.gender}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold font-mono">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

      </div>

      {/* Age Category Distribution & Monthly Growth Trends Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Age Category Distribution */}
        <Card className="p-5 bg-slate-900/40 border border-slate-800 shadow-xl hover:border-slate-700 transition duration-300 card-3d">
          <CardHeader className="p-0 mb-4 flex justify-between items-start">
            <div>
              <CardTitle className="text-xs uppercase tracking-wider font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[var(--accent)]" />
                Age Category Distribution
              </CardTitle>
              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-semibold">
                Age concentrations across sports registries
              </p>
            </div>
            <div className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[8px] font-mono text-[var(--accent)] font-bold">
              TOTAL: 42,820 PLAYERS
            </div>
          </CardHeader>

          {/* Bar Chart wrapper with fixed height wrapper */}
          <div className="relative h-44 w-full bg-slate-950/40 rounded-xl p-4 border border-slate-900 flex items-end justify-around">
            {ageCategoryData.map((item, idx) => {
              const barHeight = `${(item.count / 14000) * 100}%`;
              return (
                <div key={item.ageGroup} className="flex flex-col items-center group w-1/6">
                  {/* Tooltip */}
                  <div className={`absolute bottom-32 bg-slate-950 border border-[var(--border-default)] px-2 py-0.5 rounded text-[8px] font-mono transition-opacity duration-200 ${hoveredAgeBar === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    {item.count.toLocaleString()} players
                  </div>

                  {/* Fixed height container for height percentage styling */}
                  <div className="h-28 w-full flex items-end justify-center">
                    <div
                      className="w-5 rounded-t bg-gradient-to-t hover:brightness-110 transition-all duration-300 cursor-pointer"
                      style={{
                        height: barHeight,
                        backgroundImage: `linear-gradient(to top, #0c1a30, ${item.color})`
                      }}
                      onMouseEnter={() => setHoveredAgeBar(idx)}
                      onMouseLeave={() => setHoveredAgeBar(null)}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 font-semibold truncate mt-2 w-full text-center font-mono">
                    {item.ageGroup}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Monthly Growth Trends (Graph Chart) */}
        <Card className="p-5 bg-slate-900/40 border border-slate-800 shadow-xl hover:border-slate-700 transition duration-300 card-3d">
          <CardHeader className="p-0 mb-4 flex justify-between items-start">
            <div>
              <CardTitle className="text-xs uppercase tracking-wider font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
                Monthly Growth Trends
              </CardTitle>
              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-semibold">
                Monthly player registration curve for 2026
              </p>
            </div>
            <div className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[8px] font-mono text-[var(--accent)] font-bold">
              TOTAL GROWTH: +9,700
            </div>
          </CardHeader>

          <div className="relative h-44 w-full bg-slate-950/40 rounded-xl p-2 border border-slate-900 flex flex-col justify-end">
            <svg viewBox="0 0 280 150" className="w-full h-full">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d6ff00" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#d6ff00" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="20" y1="25" x2="260" y2="25" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
              <line x1="20" y1="65" x2="260" y2="65" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
              <line x1="20" y1="105" x2="260" y2="105" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />

              {/* Area Under Curve */}
              <path
                d="M 30 130 L 30 110 L 80 95 L 130 85 L 180 70 L 230 45 L 280 20 L 280 130 Z"
                fill="url(#areaGradient)"
              />

              {/* Curve Line */}
              <path
                d="M 30 110 L 80 95 L 130 85 L 180 70 L 230 45 L 280 20"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Points */}
              {monthlyGrowthData.map((pt, i) => (
                <g key={pt.month}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint === i ? 6 : 4}
                    fill={hoveredPoint === i ? "#ffffff" : "var(--accent)"}
                    stroke="#041c32"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <text x={pt.x} y="142" textAnchor="middle" fill="#8fa0b0" fontSize="8" className="font-mono">
                    {pt.month}
                  </text>
                </g>
              ))}
            </svg>

            {/* Tooltip Overlay */}
            {hoveredPoint !== null && (
              <div className="absolute top-2 right-2 bg-slate-950 border border-[var(--border-default)] px-2 py-1 rounded-lg shadow-xl text-[9px] font-mono">
                <span className="text-slate-400">{monthlyGrowthData[hoveredPoint].month}: </span>
                <span className="text-[var(--accent)] font-bold">+{monthlyGrowthData[hoveredPoint].count} players</span>
              </div>
            )}
          </div>
        </Card>

      </div>

      {/* Sport Index Performance & Complaints Chart Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Sport Index Performance (Bar Chart) */}
        <Card className="p-5 bg-slate-900/40 border border-slate-800 shadow-xl hover:border-slate-700 transition duration-300 card-3d">
          <CardHeader className="p-0 mb-4 flex justify-between items-start">
            <div>
              <CardTitle className="text-xs uppercase tracking-wider font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[var(--accent)]" />
                Sport Index Performance (Bar Chart)
              </CardTitle>
              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-semibold">
                Comparative rating scores by sport category
              </p>
            </div>
            <div className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[8px] font-mono text-[var(--accent)] font-bold">
              CUMULATIVE SCORE: 395 PTS
            </div>
          </CardHeader>

          <div className="relative h-44 w-full bg-slate-950/40 rounded-xl p-4 border border-slate-900 flex items-end justify-around">
            {sportsPointsData.map((item, idx) => {
              const barHeight = `${item.score}%`;
              return (
                <div key={item.sport} className="flex flex-col items-center group w-1/6">
                  {/* Tooltip */}
                  <div className={`absolute bottom-32 bg-slate-950 border border-[var(--border-default)] px-2 py-0.5 rounded text-[8px] font-mono transition-opacity duration-200 ${hoveredBar === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    {item.score} pts
                  </div>

                  {/* Wrapper with fixed height to allow percentage height calculations */}
                  <div className="h-28 w-full flex items-end justify-center">
                    <div
                      className="w-5 rounded-t bg-gradient-to-t hover:brightness-110 transition-all duration-300 cursor-pointer"
                      style={{
                        height: barHeight,
                        backgroundImage: `linear-gradient(to top, #0b2948, ${item.color})`
                      }}
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 font-semibold truncate mt-2 w-full text-center">
                    {item.sport}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Complaints Raised vs Actioned */}
        <Card className="p-5 bg-slate-900/40 border border-slate-800 shadow-xl hover:border-slate-700 transition duration-300 card-3d">
          <CardHeader className="p-0 mb-4 flex justify-between items-start">
            <div>
              <CardTitle className="text-xs uppercase tracking-wider font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-red-400" />
                Complaints Raised vs Actioned Chart
              </CardTitle>
              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-semibold">
                Monthly resolution and response performance of complaints
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[8px] font-mono text-[var(--accent)] font-bold">
                TOTAL: 413 RAISED | 374 RESOLVED
              </div>
              <div className="flex items-center gap-3 font-mono text-[9px]">
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2 h-2 bg-red-500 rounded-sm"></span> Raised
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2 h-2 bg-[#d6ff00] rounded-sm"></span> Actioned
                </span>
              </div>
            </div>
          </CardHeader>

          {/* Dual bar chart container */}
          <div className="relative h-44 w-full bg-slate-950/40 rounded-xl p-4 border border-slate-900 flex items-end justify-around">
            {complaintsData.map((item, idx) => {
              const raisedHeight = `${(item.raised / 110) * 100}%`;
              const actionedHeight = `${(item.actioned / 110) * 100}%`;
              const isHovered = hoveredComplaint === idx;

              return (
                <div key={item.month} className="flex flex-col items-center group w-1/6">
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute bottom-36 bg-slate-950 border border-[var(--border-default)] px-2 py-1 rounded text-[8px] font-mono text-center shadow-xl z-20">
                      <span className="text-red-400 block font-bold">Raised: {item.raised}</span>
                      <span className="text-[var(--accent)] block font-bold">Actioned: {item.actioned}</span>
                    </div>
                  )}

                  {/* Dual columns wrapper with fixed height */}
                  <div className="h-28 w-full flex items-end gap-1.5 justify-center"
                    onMouseEnter={() => setHoveredComplaint(idx)}
                    onMouseLeave={() => setHoveredComplaint(null)}>

                    {/* Raised bar */}
                    <div
                      className="w-3.5 rounded-t bg-gradient-to-t from-red-950 to-red-500 hover:brightness-110 transition-all duration-300 cursor-pointer"
                      style={{ height: raisedHeight }}
                    />

                    {/* Actioned bar */}
                    <div
                      className="w-3.5 rounded-t bg-gradient-to-t from-emerald-950 to-[var(--accent)] hover:brightness-110 transition-all duration-300 cursor-pointer"
                      style={{ height: actionedHeight }}
                    />
                  </div>

                  {/* Label */}
                  <span className="text-[9px] text-slate-400 font-semibold mt-2 font-mono">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

      </div>
    </div>
  );
}
