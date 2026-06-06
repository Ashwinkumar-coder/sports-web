import { useState } from 'react';

// Seeded random helper for deterministic simulation
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function MatchDetailsModal({ match, onClose }) {
  const [activeSubTab, setActiveSubTab] = useState('summary');
  const [wagonFilter, setWagonFilter] = useState('all'); // all, boundaries, wickets, singles

  if (!match) return null;

  const teamA = match.team_a;
  const teamB = match.team_b;
  const matchId = match.id;

  // Generate deterministic over by over data
  const oversA = Math.max(1, Math.ceil(match.team_a_overs || 1));
  const oversB = Math.max(1, Math.ceil(match.team_b_overs || 1));
  
  const generateOversList = (seedOffset, totalRuns, totalOvers) => {
    const oversCount = Math.max(1, Math.ceil(totalOvers));
    const list = [];
    let remainingRuns = totalRuns;
    
    for (let i = 1; i <= oversCount; i++) {
      const seed = matchId * 100 + seedOffset + i;
      const r = seededRandom(seed);
      let overRuns = Math.round(r * 14); // 0 to 14 runs per over
      
      if (i === oversCount) {
        overRuns = remainingRuns;
      } else {
        overRuns = Math.min(remainingRuns, overRuns);
        remainingRuns -= overRuns;
      }
      list.push(overRuns);
    }
    return list;
  };

  const teamAOverRuns = generateOversList(10, match.team_a_runs, match.team_a_overs);
  const teamBOverRuns = generateOversList(20, match.team_b_runs, match.team_b_overs);

  // Cumulative runs
  const getCumulativeRuns = (overRuns) => {
    let sum = 0;
    return overRuns.map(r => {
      sum += r;
      return sum;
    });
  };

  const teamACumulative = getCumulativeRuns(teamAOverRuns);
  const teamBCumulative = getCumulativeRuns(teamBOverRuns);

  // Generate Wagon Wheel Coordinates
  const generateWagonWheel = (seedOffset, runs, wickets) => {
    const list = [];
    const totalPoints = Math.min(100, Math.floor(runs * 0.8) + wickets * 2);
    let wicketsPlaced = 0;
    
    for (let i = 0; i < totalPoints; i++) {
      const seed = matchId * 300 + seedOffset + i;
      const r1 = seededRandom(seed);
      const r2 = seededRandom(seed + 15);
      
      const angle = r1 * 2 * Math.PI;
      // Coordinates inside a 300x300 canvas
      const maxRadius = 130;
      const minRadius = 15;
      const radius = minRadius + r2 * (maxRadius - minRadius);
      
      const x = 150 + Math.cos(angle) * radius;
      const y = 150 + Math.sin(angle) * radius;
      
      let type = 'single'; // single, four, six, wicket
      if (r1 < 0.1 && wicketsPlaced < wickets) {
        type = 'wicket';
        wicketsPlaced++;
      } else if (r1 > 0.85) {
        type = 'six';
      } else if (r1 > 0.65) {
        type = 'four';
      }
      
      list.push({ x, y, type });
    }
    
    // Fill remaining wickets if any
    while (wicketsPlaced < wickets) {
      const seed = matchId * 400 + wicketsPlaced;
      const r = seededRandom(seed);
      const angle = r * 2 * Math.PI;
      const radius = 30 + r * 80;
      const x = 150 + Math.cos(angle) * radius;
      const y = 150 + Math.sin(angle) * radius;
      list.push({ x, y, type: 'wicket' });
      wicketsPlaced++;
    }
    
    return list;
  };

  const teamAWagon = generateWagonWheel(50, match.team_a_runs, match.team_a_wickets);
  const teamBWagon = generateWagonWheel(60, match.team_b_runs, match.team_b_wickets);
  const allWagonPoints = [...teamAWagon.map(p => ({ ...p, team: 'A' })), ...teamBWagon.map(p => ({ ...p, team: 'B' }))];

  const filteredWagonPoints = allWagonPoints.filter(p => {
    if (wagonFilter === 'all') return true;
    if (wagonFilter === 'boundaries') return p.type === 'four' || p.type === 'six';
    if (wagonFilter === 'wickets') return p.type === 'wicket';
    if (wagonFilter === 'singles') return p.type === 'single';
    return true;
  });

  // Generate Scorecards deterministically
  const generateScorecard = (seedOffset, teamName, teamPlayers, runs, wickets, opponentOvers) => {
    const list = [];
    const playersCount = teamPlayers?.length || 0;
    let remainingRuns = runs;
    let wicketsFallen = wickets;

    // Default player templates if squad is empty
    const defaultNames = ["Rohit Sharma", "Shubman Gill", "Virat Kohli", "Shreyas Iyer", "KL Rahul", "Hardik Pandya", "Ravindra Jadeja", "Jasprit Bumrah", "Kuldeep Yadav", "Mohammed Siraj", "Mohammed Shami"];

    for (let i = 0; i < 11; i++) {
      const pName = teamPlayers?.[i]?.player?.full_name || defaultNames[i];
      let pRuns = 0;
      let pBalls = 0;
      let pWickets = 0;
      let pConceded = 0;
      let statusText = 'Did not bat';

      const seed = matchId * 150 + seedOffset + i;
      const r = seededRandom(seed);

      // Batting
      if (i < wicketsFallen + 2 && i < 11) {
        if (i < wicketsFallen) {
          statusText = `c & b Bowler ${i + 1}`;
          pRuns = Math.round(r * (remainingRuns / (wicketsFallen - i + 1)));
          remainingRuns -= pRuns;
        } else {
          statusText = 'Not Out';
          pRuns = remainingRuns;
          remainingRuns = 0;
        }
        pBalls = Math.max(pRuns + 2, Math.round(r * 30) + 5);
      }

      // Bowling (mainly bottom 5 players)
      if (i >= 5) {
        const bowr = seededRandom(seed + 80);
        pWickets = bowr < 0.2 ? 2 : (bowr < 0.5 ? 1 : 0);
        pConceded = Math.round(bowr * 35) + 10;
      }

      list.push({
        name: pName,
        runs: pRuns,
        balls: pBalls,
        status: statusText,
        wickets: pWickets,
        conceded: pConceded
      });
    }

    return list;
  };

  const teamAScorecard = generateScorecard(70, teamA.name, teamA.players, match.team_a_runs, match.team_a_wickets, match.team_b_overs);
  const teamBScorecard = generateScorecard(80, teamB.name, teamB.players, match.team_b_runs, match.team_b_wickets, match.team_a_overs);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden text-xs flex flex-col max-h-[90vh]">
        {/* Header Title */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide">Match Analysis Center</h3>
            <p className="text-[10px] text-sports-cyan uppercase mt-0.5 font-mono">{match.tournament?.name || 'Tournament Matches'}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 text-lg font-bold p-1 cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Live / Finished Banner */}
        <div className="bg-slate-950/40 p-4 border-b border-slate-800 shrink-0 flex flex-col sm:flex-row items-center justify-around gap-6">
          {/* Team A */}
          <div className="text-center sm:text-right space-y-1">
            <h4 className="font-extrabold text-sm text-slate-100">{teamA.name}</h4>
            <div className="text-xl font-mono font-black text-slate-200">
              {match.team_a_runs}/{match.team_a_wickets}
              <span className="text-[10px] text-slate-500 font-normal ml-1">({match.team_a_overs} ov)</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              match.status === 'live' 
                ? 'bg-red-950 text-red-400 border border-red-900/60 animate-pulse' 
                : match.status === 'completed' 
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/60' 
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {match.status}
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-1">Match ID: #{matchId}</span>
          </div>

          {/* Team B */}
          <div className="text-center sm:text-left space-y-1">
            <h4 className="font-extrabold text-sm text-slate-100">{teamB.name}</h4>
            <div className="text-xl font-mono font-black text-slate-200">
              {match.team_b_runs}/{match.team_b_wickets}
              <span className="text-[10px] text-slate-500 font-normal ml-1">({match.team_b_overs} ov)</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-950/80 border-b border-slate-800 p-1.5 gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          {['summary', 'scorecard', 'wagon_wheel', 'charts'].map(t => (
            <button
              key={t}
              onClick={() => setActiveSubTab(t)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                activeSubTab === t 
                  ? 'bg-sports-cyan/15 text-sports-cyan border border-sports-cyan/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/20">
          
          {/* Subtab: SUMMARY */}
          {activeSubTab === 'summary' && (
            <div className="space-y-6">
              {/* Outcome Banner */}
              {match.status === 'completed' && (
                <div className="bg-emerald-950/30 border border-emerald-900/50 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">Official Outcome</span>
                    <h4 className="text-slate-100 font-bold text-sm mt-0.5">
                      🏆 {match.winner ? `${match.winner.name} won the match` : 'Draw / No Outcome declared'}
                    </h4>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 font-mono text-[10px] px-2.5 py-1 rounded-full border border-emerald-500/25">Finished</span>
                </div>
              )}

              {/* Match statistics key indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-850 text-center">
                  <span className="text-slate-500 font-medium block">Team A Run Rate</span>
                  <span className="text-base font-extrabold text-slate-200 mt-1 block font-mono">
                    {match.team_a_overs > 0 ? (match.team_a_runs / match.team_a_overs).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-850 text-center">
                  <span className="text-slate-500 font-medium block">Team B Run Rate</span>
                  <span className="text-base font-extrabold text-slate-200 mt-1 block font-mono">
                    {match.team_b_overs > 0 ? (match.team_b_runs / match.team_b_overs).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-850 text-center">
                  <span className="text-slate-500 font-medium block">Match Format</span>
                  <span className="text-base font-extrabold text-sports-cyan mt-1 block uppercase font-mono">
                    {match.tournament?.overs ? `${match.tournament.overs} Overs` : 'T20 Limit'}
                  </span>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-850 text-center">
                  <span className="text-slate-500 font-medium block">Venue Pitch</span>
                  <span className="text-base font-extrabold text-indigo-400 mt-1 block truncate">
                    {match.tournament?.ground_name || 'Standard Ground'}
                  </span>
                </div>
              </div>

              {/* Match details & Scorer info */}
              <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-850 space-y-3">
                <h4 className="font-bold text-slate-200">Official Match Personnel</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-400">
                  <div className="bg-slate-950/40 p-3 rounded border border-slate-900">
                    <span className="text-[10px] text-slate-500 block">Assigned Scorer / Umpire</span>
                    <span className="font-semibold text-slate-300 block mt-1">👤 {match.scorer?.full_name || 'Unassigned Official'}</span>
                    <span className="text-[10px] text-slate-500 block font-mono mt-0.5">{match.scorer?.email || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-950/40 p-3 rounded border border-slate-900">
                    <span className="text-[10px] text-slate-500 block">Supervising Federation</span>
                    <span className="font-semibold text-slate-300 block mt-1">🏅 {match.tournament?.federation?.name || 'Authorized Cricket Council'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subtab: SCORECARD */}
          {activeSubTab === 'scorecard' && (
            <div className="space-y-6">
              {/* Team A Batting Scorecard */}
              <div className="bg-slate-900/40 border border-slate-850 rounded-xl overflow-hidden">
                <div className="bg-slate-950 p-3.5 border-b border-slate-850 flex justify-between items-center">
                  <h4 className="font-bold text-slate-200">{teamA.name} Innings</h4>
                  <span className="font-mono text-slate-300 font-bold">{match.team_a_runs}/{match.team_a_wickets} ({match.team_a_overs} Ov)</span>
                </div>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 font-bold uppercase tracking-wider text-[9px] bg-slate-950/40">
                      <th className="py-2.5 px-3.5">Batter</th>
                      <th className="py-2.5 px-3.5">Status</th>
                      <th className="py-2.5 px-3.5 text-right">Runs</th>
                      <th className="py-2.5 px-3.5 text-right">Balls</th>
                      <th className="py-2.5 px-3.5 text-right">SR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60">
                    {teamAScorecard.map((p, i) => (
                      <tr key={i} className="hover:bg-slate-900/10">
                        <td className="py-2 px-3.5 font-semibold text-slate-300">{p.name}</td>
                        <td className="py-2 px-3.5 text-slate-500 italic text-[10px]">{p.status}</td>
                        <td className="py-2 px-3.5 text-right font-mono font-bold text-slate-200">{p.runs}</td>
                        <td className="py-2 px-3.5 text-right font-mono text-slate-400">{p.balls}</td>
                        <td className="py-2 px-3.5 text-right font-mono text-slate-400">
                          {p.balls > 0 ? ((p.runs / p.balls) * 100).toFixed(1) : '0.0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Team B Batting Scorecard */}
              <div className="bg-slate-900/40 border border-slate-850 rounded-xl overflow-hidden">
                <div className="bg-slate-950 p-3.5 border-b border-slate-850 flex justify-between items-center">
                  <h4 className="font-bold text-slate-200">{teamB.name} Innings</h4>
                  <span className="font-mono text-slate-300 font-bold">{match.team_b_runs}/{match.team_b_wickets} ({match.team_b_overs} Ov)</span>
                </div>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 font-bold uppercase tracking-wider text-[9px] bg-slate-950/40">
                      <th className="py-2.5 px-3.5">Batter</th>
                      <th className="py-2.5 px-3.5">Status</th>
                      <th className="py-2.5 px-3.5 text-right">Runs</th>
                      <th className="py-2.5 px-3.5 text-right">Balls</th>
                      <th className="py-2.5 px-3.5 text-right">SR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60">
                    {teamBScorecard.map((p, i) => (
                      <tr key={i} className="hover:bg-slate-900/10">
                        <td className="py-2 px-3.5 font-semibold text-slate-300">{p.name}</td>
                        <td className="py-2 px-3.5 text-slate-500 italic text-[10px]">{p.status}</td>
                        <td className="py-2 px-3.5 text-right font-mono font-bold text-slate-200">{p.runs}</td>
                        <td className="py-2 px-3.5 text-right font-mono text-slate-400">{p.balls}</td>
                        <td className="py-2 px-3.5 text-right font-mono text-slate-400">
                          {p.balls > 0 ? ((p.runs / p.balls) * 100).toFixed(1) : '0.0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Subtab: WAGON WHEEL */}
          {activeSubTab === 'wagon_wheel' && (
            <div className="space-y-6">
              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-xl flex flex-col md:flex-row gap-6 items-center justify-center">
                {/* Visual Field SVG representation */}
                <div className="relative w-[300px] h-[300px] bg-emerald-950/20 border border-emerald-800/65 rounded-full flex items-center justify-center overflow-hidden">
                  {/* Outer circle line */}
                  <div className="absolute w-[280px] h-[280px] border border-dashed border-emerald-800/40 rounded-full"></div>
                  {/* 30 yard inner circle */}
                  <div className="absolute w-[160px] h-[160px] border border-emerald-800/30 rounded-full"></div>
                  {/* Center pitch pitch box */}
                  <div className="absolute w-[16px] h-[40px] bg-amber-800/25 border border-amber-800/40 rounded-sm"></div>

                  {/* Draw points */}
                  {filteredWagonPoints.map((pt, index) => {
                    let dotColor = '#ca8a04'; // single
                    if (pt.type === 'four') dotColor = '#38bdf8'; // four
                    if (pt.type === 'six') dotColor = '#f43f5e'; // six
                    if (pt.type === 'wicket') dotColor = '#ffffff'; // wicket
                    
                    return (
                      <div
                        key={index}
                        style={{
                          left: pt.x - 3,
                          top: pt.y - 3,
                          backgroundColor: dotColor,
                        }}
                        className={`absolute w-1.5 h-1.5 rounded-full border border-slate-950/70`}
                        title={pt.type.toUpperCase()}
                      ></div>
                    );
                  })}
                </div>

                {/* Filters & Information panel */}
                <div className="flex-1 space-y-4 max-w-sm w-full">
                  <h4 className="font-bold text-slate-200">Interactive Shot Distribution</h4>
                  <p className="text-slate-400 text-xs">Simulated batting shot directions on field. Filter points below to inspect angles:</p>
                  
                  {/* Filter selector */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {['all', 'singles', 'boundaries', 'wickets'].map(f => (
                      <button
                        key={f}
                        onClick={() => setWagonFilter(f)}
                        className={`px-3 py-1.5 rounded border text-[10px] font-semibold uppercase tracking-wider transition cursor-pointer ${
                          wagonFilter === f 
                            ? 'bg-sports-cyan text-slate-950 border-sports-cyan' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  {/* Legend list */}
                  <div className="space-y-2 border-t border-slate-850 pt-4 font-mono text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span className="text-slate-400">Singles, Doubles & Triples</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                      <span className="text-slate-400">Four Boundaries (4s)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span className="text-slate-400">Six Boundaries (6s)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-800"></span>
                      <span className="text-slate-400">Wickets Felled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subtab: CHARTS (COMPARISONS) */}
          {activeSubTab === 'charts' && (
            <div className="space-y-6">
              {/* Over comparison charts (side-by-side RPO representation) */}
              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-xl space-y-4">
                <h4 className="font-bold text-slate-200">Over-by-Over Runs Comparison</h4>
                <p className="text-slate-400 text-xs">Comparison of runs scored in individual overs. Displays up to the total overs bowled in this match.</p>

                <div className="space-y-3 pt-2">
                  {Array.from({ length: Math.max(teamAOverRuns.length, teamBOverRuns.length) }).map((_, index) => {
                    const overNum = index + 1;
                    const runsA = teamAOverRuns[index] || 0;
                    const runsB = teamBOverRuns[index] || 0;

                    return (
                      <div key={index} className="flex items-center gap-4 text-[10px] font-mono">
                        <span className="w-14 text-slate-400 font-bold text-right">Over {overNum}</span>
                        
                        <div className="flex-1 flex flex-col gap-1.5">
                          {/* Team A Over Run Bar */}
                          <div className="flex items-center gap-2">
                            <div 
                              style={{ width: `${Math.min(100, (runsA / 18) * 100)}%` }} 
                              className="h-2.5 bg-sports-cyan rounded-sm min-w-[4px]"
                            ></div>
                            <span className="text-slate-300 font-bold">{runsA} runs</span>
                            <span className="text-slate-500 text-[8px] uppercase">{teamA.name.substring(0, 3)}</span>
                          </div>
                          
                          {/* Team B Over Run Bar */}
                          <div className="flex items-center gap-2">
                            <div 
                              style={{ width: `${Math.min(100, (runsB / 18) * 100)}%` }} 
                              className="h-2.5 bg-indigo-500 rounded-sm min-w-[4px]"
                            ></div>
                            <span className="text-slate-300 font-bold">{runsB} runs</span>
                            <span className="text-slate-500 text-[8px] uppercase">{teamB.name.substring(0, 3)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cumulative Run Comparison progression */}
              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-xl space-y-4">
                <h4 className="font-bold text-slate-200">Cumulative Innings Progression</h4>
                <p className="text-slate-400 text-xs">Line-graph simulation comparison of cumulative scores over-by-over.</p>

                <div className="space-y-3.5 pt-2">
                  {Array.from({ length: Math.max(teamACumulative.length, teamBCumulative.length) }).map((_, index) => {
                    const overNum = index + 1;
                    const scoreA = teamACumulative[index] || match.team_a_runs;
                    const scoreB = teamBCumulative[index] || match.team_b_runs;

                    return (
                      <div key={index} className="flex items-center gap-4 text-[10px] font-mono">
                        <span className="w-14 text-slate-400 font-bold text-right">Over {overNum}</span>
                        
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div className="bg-slate-950/40 p-2.5 rounded border border-slate-900 flex justify-between items-center">
                            <span className="text-slate-500 uppercase text-[9px]">{teamA.name.substring(0, 3)}</span>
                            <span className="font-bold text-sports-cyan">{scoreA} runs</span>
                          </div>
                          <div className="bg-slate-950/40 p-2.5 rounded border border-slate-900 flex justify-between items-center">
                            <span className="text-slate-500 uppercase text-[9px]">{teamB.name.substring(0, 3)}</span>
                            <span className="font-bold text-indigo-400">{scoreB} runs</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
