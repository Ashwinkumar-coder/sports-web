import { useState } from 'react';

// Seeded random helper for deterministic simulation
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function MatchDetailsModal({ match, usersList = [], onClose }) {
  const [activeSubTab, setActiveSubTab] = useState('summary');
  const [activeInningsTab, setActiveInningsTab] = useState(0); // 0: Innings 1 (Team A), 1: Innings 2 (Team B)
  const [statsTab, setStatsTab] = useState('wagon_wheel'); // wagon_wheel, over_comparison, run_comparison
  const [wagonFilter, setWagonFilter] = useState('all'); // all, boundaries, wickets, singles

  if (!match) return null;

  const teamA = match.team_a;
  const teamB = match.team_b;
  const matchId = match.id;

  // Resolve assigned scorer client-side if null
  const scorerUser = match.scorer || (usersList && usersList.find(u => u.id === match.scorer_id));

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
      
      const angle = Math.round(r1 * 360);
      
      let type = 'single'; // single, four, six, wicket, dot
      let shotRuns = 1;
      
      if (r1 < 0.1 && wicketsPlaced < wickets) {
        type = 'wicket';
        shotRuns = 0;
        wicketsPlaced++;
      } else if (r1 > 0.88) {
        type = 'six';
        shotRuns = 6;
      } else if (r1 > 0.68) {
        type = 'four';
        shotRuns = 4;
      } else if (r1 < 0.3) {
        type = 'dot';
        shotRuns = 0;
      } else if (r1 < 0.5) {
        type = 'single';
        shotRuns = 1;
      } else {
        type = 'double';
        shotRuns = 2;
      }
      
      list.push({ angle, runs: shotRuns, type });
    }
    
    // Fill remaining wickets if any
    while (wicketsPlaced < wickets) {
      const seed = matchId * 400 + wicketsPlaced;
      const r = seededRandom(seed);
      const angle = Math.round(r * 360);
      list.push({ angle, runs: 0, type: 'wicket' });
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
    if (wagonFilter === 'singles') return p.type === 'single' || p.type === 'double';
    return true;
  });

  // Generate Scorecards deterministically
  const generateScorecard = (seedOffset, teamName, teamPlayers, runs, wickets, totalOvers, opponentPlayers) => {
    const batting = [];
    const bowling = [];
    const yetToBat = [];
    const fow = [];
    const partnerships = [];

    // Default player templates if squad is empty
    const defaultNames = ["Rohit Sharma", "Shubman Gill", "Virat Kohli", "Shreyas Iyer", "KL Rahul", "Hardik Pandya", "Ravindra Jadeja", "Jasprit Bumrah", "Kuldeep Yadav", "Mohammed Siraj", "Mohammed Shami"];
    const opponentDefaultNames = ["MS Dhoni", "Ruturaj Gaikwad", "Shivam Dube", "Ravindra Jadeja", "Matheesha Pathirana", "Ajinkya Rahane", "Deepak Chahar", "Shardul Thakur", "Tushar Deshpande", "Mitchell Santner", "Sameer Rizvi"];

    // Dynamically build squad names from registered players or defaults
    const squad = (teamPlayers && teamPlayers.length > 0)
      ? teamPlayers.map(tp => tp.player?.full_name).filter(Boolean)
      : defaultNames;

    const squadLength = squad.length;
    let wicketsFallen = Math.min(wickets, squadLength - 1);

    // Opponent squad details for bowling attribution
    const opponentSquad = (opponentPlayers && opponentPlayers.length > 0)
      ? opponentPlayers.map(tp => tp.player?.full_name).filter(Boolean)
      : opponentDefaultNames;

    const opponentLength = opponentSquad.length;
    const bowlersCount = Math.min(5, opponentLength);

    // Calculate Extras first so batting runs + extras equals exactly total runs
    const extrasSeed = matchId * 250 + seedOffset;
    const extrasR = seededRandom(extrasSeed);
    const totalExtras = Math.max(1, Math.min(runs, Math.round(extrasR * 12)));
    const wd = Math.round(totalExtras * 0.5);
    const nb = totalExtras - wd; // Keep all extras as wides/no-balls so bowler runs = total runs
    const lb = 0;
    const bExtra = 0;

    let remainingRuns = Math.max(0, runs - totalExtras);

    // Calculate total deliveries for batting stats
    const oversInt = Math.floor(totalOvers);
    const ballsInOver = Math.round((totalOvers - oversInt) * 10);
    const validBalls = oversInt * 6 + ballsInOver;
    let remainingBalls = validBalls + wd + nb;

    // Batting
    for (let i = 0; i < squadLength; i++) {
      const pName = squad[i];
      let pRuns = 0;
      let pBalls = 0;
      let fours = 0;
      let sixes = 0;
      let statusText = 'Yet to bat';

      const seed = matchId * 150 + seedOffset + i;
      const r = seededRandom(seed);

      if (i < wicketsFallen + 2) {
        if (i < wicketsFallen) {
          const bowlerIndex = i % bowlersCount;
          const bowlerName = opponentSquad[opponentLength - 1 - bowlerIndex];
          statusText = `c & b ${bowlerName}`;
          pRuns = Math.round(r * (remainingRuns / (wicketsFallen - i + 1)));
          remainingRuns -= pRuns;
          
          pBalls = Math.round(r * (remainingBalls / (wicketsFallen - i + 1)));
          remainingBalls -= pBalls;
        } else {
          statusText = 'Not Out';
          if (i === wicketsFallen && wicketsFallen + 1 < squadLength) {
            pRuns = Math.round(r * remainingRuns);
            remainingRuns -= pRuns;
            
            pBalls = Math.round(r * remainingBalls);
            remainingBalls -= pBalls;
          } else {
            pRuns = remainingRuns;
            remainingRuns = 0;
            
            pBalls = remainingBalls;
            remainingBalls = 0;
          }
        }
        fours = Math.max(0, Math.floor(r * (pRuns / 4)));
        sixes = Math.max(0, Math.floor((pRuns - fours * 4) / 6));
      }

      if (statusText !== 'Yet to bat') {
        batting.push({
          name: pName,
          runs: pRuns,
          balls: pBalls,
          fours,
          sixes,
          status: statusText
        });
      } else {
        yetToBat.push(pName);
      }
    }

    // Fall of Wickets (FOW)
    let currentScore = 0;
    for (let i = 0; i < wicketsFallen; i++) {
      const batter = batting[i]?.name || squad[i];
      const overNum = ((i + 1) * (totalOvers / (wicketsFallen + 1))).toFixed(1);
      currentScore += Math.round((runs - totalExtras) / (wicketsFallen + 1));
      fow.push({
        batter,
        score: `${currentScore}/${i + 1}`,
        over: overNum
      });
    }

    // Partnerships
    for (let i = 0; i <= wicketsFallen; i++) {
      const pRuns = Math.round((runs - totalExtras) / (wicketsFallen + 1));
      const pBalls = Math.round(validBalls / (wicketsFallen + 1));
      partnerships.push({
        wicket: i === wicketsFallen ? 'Unbroken' : i + 1,
        runs: pRuns,
        balls: pBalls
      });
    }

    // Bowling (the opponent team's players bowl)
    let remainingWickets = wicketsFallen;
    let remainingConceded = runs - lb - bExtra; // Conceded runs
    
    // Distribute valid balls among bowlers
    let remainingValidBalls = validBalls;

    for (let i = 0; i < bowlersCount; i++) {
      const bowName = opponentSquad[opponentLength - 1 - i];
      const seed = matchId * 200 + seedOffset + i;
      const r = seededRandom(seed);
      
      let bBalls = 0;
      if (i === bowlersCount - 1) {
        bBalls = remainingValidBalls;
      } else {
        bBalls = Math.min(remainingValidBalls, Math.round(r * (remainingValidBalls / (bowlersCount - i) * 1.5)));
        bBalls = Math.floor(bBalls / 6) * 6; // Try to give complete overs where possible
        if (bBalls === 0 && remainingValidBalls >= 6) bBalls = 6;
        remainingValidBalls -= bBalls;
      }
      
      const bOvers = Math.floor(bBalls / 6) + (bBalls % 6) / 10;

      let bWickets = 0;
      if (i === bowlersCount - 1) {
        bWickets = remainingWickets;
      } else {
        bWickets = Math.min(remainingWickets, Math.round(r * (remainingWickets / (bowlersCount - i))));
        remainingWickets -= bWickets;
      }

      let bConceded = 0;
      if (i === bowlersCount - 1) {
        bConceded = remainingConceded;
      } else {
        bConceded = Math.min(remainingConceded, Math.round(r * (remainingConceded / (bowlersCount - i) * 1.3)));
        remainingConceded -= bConceded;
      }

      const bMaidens = r > 0.85 && bConceded < bOvers * 4 ? 1 : 0;

      bowling.push({
        name: bowName,
        overs: bOvers,
        maidens: bMaidens,
        runs: bConceded,
        wickets: bWickets,
        nb: Math.round(r * nb / bowlersCount),
        wd: Math.round(r * wd / bowlersCount)
      });
    }

    return {
      batting,
      bowling,
      extras: totalExtras,
      extrasDetail: `(wd ${wd}, nb ${nb}, lb ${lb}, b ${bExtra})`,
      yetToBat,
      fow,
      partnerships
    };
  };

  const teamAScorecard = generateScorecard(70, teamA.name, teamA.players, match.team_a_runs, match.team_a_wickets, match.team_a_overs, teamB.players);
  const teamBScorecard = generateScorecard(80, teamB.name, teamB.players, match.team_b_runs, match.team_b_wickets, match.team_b_overs, teamA.players);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[var(--bg-panel)] border border-[var(--border-default)] max-w-4xl w-full rounded-2xl shadow-[var(--shadow-card)] overflow-hidden text-xs flex flex-col max-h-[90vh]">
        {/* Header Title */}
        <div className="bg-[var(--bg-navbar)] p-5 border-b border-[var(--border-navbar)] flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)] uppercase tracking-wide">Match Analysis Center</h3>
            <p className="text-[10px] text-[var(--accent)] uppercase mt-0.5 font-mono">{match.tournament?.name || 'Tournament Matches'}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-lg font-bold p-1 cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Live / Finished Banner */}
        <div className="bg-[var(--bg-card)] p-4 border-b border-[var(--border-default)] shrink-0 flex flex-col sm:flex-row items-center justify-around gap-6">
          {/* Team A */}
          <div className="text-center sm:text-right space-y-1">
            <h4 className="font-extrabold text-sm text-[var(--text-primary)]">{teamA.name}</h4>
            <div className="text-xl font-mono font-black text-[var(--text-primary)]">
              {match.team_a_runs}/{match.team_a_wickets}
              <span className="text-[10px] text-[var(--text-muted)] font-normal ml-1">({match.team_a_overs} ov)</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className={`px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              match.status === 'live' 
                ? 'bg-[var(--accent-glow)] text-[var(--accent)] border-[var(--border-navbar)] animate-pulse' 
                : match.status === 'completed' 
                ? 'bg-[var(--success-bg)] text-[var(--success-text)] border-[var(--success-border)]' 
                : 'bg-[var(--bg-input)] text-[var(--text-secondary)] border-[var(--border-default)]'
            }`}>
              {match.status}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1">Match ID: #{matchId}</span>
          </div>

          {/* Team B */}
          <div className="text-center sm:text-left space-y-1">
            <h4 className="font-extrabold text-sm text-[var(--text-primary)]">{teamB.name}</h4>
            <div className="text-xl font-mono font-black text-[var(--text-primary)]">
              {match.team_b_runs}/{match.team_b_wickets}
              <span className="text-[10px] text-[var(--text-muted)] font-normal ml-1">({match.team_b_overs} ov)</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-[var(--bg-navbar)] border-b border-[var(--border-navbar)] p-1.5 gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          {['summary', 'scorecard', 'stats'].map(t => (
            <button
              key={t}
              onClick={() => setActiveSubTab(t)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                activeSubTab === t 
                  ? 'bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--border-navbar)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar-hover)]'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Nested Stats Tab Selection */}
        {activeSubTab === 'stats' && (
          <div className="flex bg-[var(--bg-panel)] border-b border-[var(--border-default)] p-1.5 gap-1.5 overflow-x-auto shrink-0 scrollbar-none justify-center">
            {[
              { id: 'wagon_wheel', label: 'Wagon Wheel' },
              { id: 'over_comparison', label: 'Over Comparison' },
              { id: 'run_comparison', label: 'Run Comparison' }
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => setStatsTab(sub.id)}
                className={`px-3 py-1.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest transition cursor-pointer ${
                  statsTab === sub.id 
                    ? 'bg-[var(--accent)] text-[var(--text-inverse)] shadow-sm' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar-hover)]'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-transparent">
          
          {/* Subtab: SUMMARY */}
          {activeSubTab === 'summary' && (
            <div className="space-y-6">
              {/* Outcome Banner */}
              {match.status === 'completed' && (
                <div className="bg-[var(--success-bg)] border border-[var(--success-border)] p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[var(--success-text)] font-bold uppercase tracking-wider font-mono">Official Outcome</span>
                    <h4 className="text-[var(--text-primary)] font-bold text-sm mt-0.5">
                      🏆 {match.winner ? `${match.winner.name} won the match` : 'Draw / No Outcome declared'}
                    </h4>
                  </div>
                  <span className="bg-[var(--success-bg)] text-[var(--success-text)] font-mono text-[10px] px-2.5 py-1 rounded-full border border-[var(--success-border)]">Finished</span>
                </div>
              )}

              {/* Match statistics key indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-default)] text-center">
                  <span className="text-[var(--text-secondary)] font-medium block">Team A Run Rate</span>
                  <span className="text-base font-extrabold text-[var(--text-primary)] mt-1 block font-mono">
                    {match.team_a_overs > 0 ? (match.team_a_runs / match.team_a_overs).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-default)] text-center">
                  <span className="text-[var(--text-secondary)] font-medium block">Team B Run Rate</span>
                  <span className="text-base font-extrabold text-[var(--text-primary)] mt-1 block font-mono">
                    {match.team_b_overs > 0 ? (match.team_b_runs / match.team_b_overs).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-default)] text-center">
                  <span className="text-[var(--text-secondary)] font-medium block">Match Format</span>
                  <span className="text-base font-extrabold text-[var(--accent)] mt-1 block uppercase font-mono">
                    {match.tournament?.overs ? `${match.tournament.overs} Overs` : 'T20 Limit'}
                  </span>
                </div>
                <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-default)] text-center">
                  <span className="text-[var(--text-secondary)] font-medium block">Venue Pitch</span>
                  <span className="text-base font-extrabold text-[var(--text-primary)] mt-1 block truncate">
                    {match.tournament?.ground_name || 'Standard Ground'}
                  </span>
                </div>
              </div>

              {/* Match details & Scorer info */}
              <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border-default)] space-y-3">
                <h4 className="font-bold text-[var(--text-primary)]">Official Match Personnel</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[var(--text-secondary)]">
                  <div className="bg-[var(--bg-input)] p-3 rounded-xl border border-[var(--border-default)]">
                    <span className="text-[10px] text-[var(--text-muted)] block">Assigned Scorer / Umpire</span>
                    <span className="font-semibold text-[var(--text-primary)] block mt-1">👤 {match.scorer?.full_name || 'Unassigned Official'}</span>
                    <span className="text-[10px] text-[var(--text-muted)] block font-mono mt-0.5">{match.scorer?.email || 'N/A'}</span>
                  </div>
                  <div className="bg-[var(--bg-input)] p-3 rounded-xl border border-[var(--border-default)]">
                    <span className="text-[10px] text-[var(--text-muted)] block">Supervising Federation</span>
                    <span className="font-semibold text-[var(--text-primary)] block mt-1">🏅 {match.tournament?.federation?.name || 'Authorized Cricket Council'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subtab: SCORECARD */}
          {activeSubTab === 'scorecard' && (() => {
            const currentInningsData = activeInningsTab === 0 ? teamAScorecard : teamBScorecard;
            const currentInningsTeam = activeInningsTab === 0 ? teamA : teamB;
            const currentInningsRuns = activeInningsTab === 0 ? match.team_a_runs : match.team_b_runs;
            const currentInningsWickets = activeInningsTab === 0 ? match.team_a_wickets : match.team_b_wickets;
            const currentInningsOvers = activeInningsTab === 0 ? match.team_a_overs : match.team_b_overs;
            const displayCRR = currentInningsOvers > 0 ? (currentInningsRuns / currentInningsOvers).toFixed(2) : '0.00';

            return (
              <div className="space-y-6">
                {/* Premium Innings Selector Tabs */}
                <div className="flex gap-2 w-full bg-[var(--bg-input)] p-1 rounded-xl border border-[var(--border-default)]">
                  <button
                    onClick={() => setActiveInningsTab(0)}
                    className={`flex-1 py-2 rounded-lg text-center transition cursor-pointer text-[10px] font-black uppercase tracking-wider ${
                      activeInningsTab === 0 
                        ? 'bg-[var(--accent)] text-[var(--text-inverse)] font-bold' 
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    1st Innings - {teamA.name}
                  </button>
                  <button
                    onClick={() => setActiveInningsTab(1)}
                    className={`flex-1 py-2 rounded-lg text-center transition cursor-pointer text-[10px] font-black uppercase tracking-wider ${
                      activeInningsTab === 1 
                        ? 'bg-[var(--accent)] text-[var(--text-inverse)] font-bold' 
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    2nd Innings - {teamB.name}
                  </button>
                </div>

                {/* Innings Header Banner */}
                <div className="bg-slate-900 border border-slate-800 py-3 px-4 rounded-xl flex justify-between items-center">
                  <span className="text-white font-black text-xs uppercase tracking-wider italic">
                    🏏 {currentInningsTeam.name} Batting
                  </span>
                  <span className="text-slate-400 font-extrabold text-[10px] uppercase font-mono tracking-wider">
                    {currentInningsRuns}/{currentInningsWickets} in {currentInningsOvers} ov
                  </span>
                </div>

                {/* Batting Scorecard */}
                <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 overflow-hidden">
                  <div className="flex py-2.5 bg-slate-900 px-3 items-center border-b border-slate-800 text-[10px] font-black tracking-widest text-slate-400 font-mono">
                    <div className="flex-1">BATTER</div>
                    <div className="w-12 text-center">R</div>
                    <div className="w-12 text-center">B</div>
                    <div className="w-12 text-center">4s</div>
                    <div className="w-12 text-center">6s</div>
                    <div className="w-16 text-right">SR</div>
                  </div>

                  <div className="divide-y divide-slate-800/50">
                    {currentInningsData.batting.map((bat, i) => (
                      <div key={i} className="flex py-3.5 px-3 items-center hover:bg-slate-900/60 transition duration-150">
                        <div className="flex-1">
                          <div className="text-[var(--text-primary)] font-extrabold text-xs">{bat.name}</div>
                          {bat.status && (
                            <div className={`text-[9px] font-bold mt-0.5 ${
                              bat.status.toLowerCase() === 'batting' || bat.status.toLowerCase() === 'not out' 
                                ? 'text-emerald-400' 
                                : 'text-slate-500'
                            }`}>
                              {bat.status}
                            </div>
                          )}
                        </div>
                        <div className="w-12 text-center text-[var(--text-primary)] font-black text-xs font-mono">{bat.runs}</div>
                        <div className="w-12 text-center text-slate-400 text-xs font-mono">{bat.balls}</div>
                        <div className="w-12 text-center text-slate-400 text-xs font-mono">{bat.fours}</div>
                        <div className="w-12 text-center text-slate-400 text-xs font-mono">{bat.sixes}</div>
                        <div className="w-16 text-right text-emerald-400 font-extrabold text-xs font-mono">
                          {bat.balls > 0 ? ((bat.runs / bat.balls) * 100).toFixed(2) : '0.00'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* EXTRAS ROW */}
                  <div className="flex justify-between items-center py-3 px-3 border-t border-slate-800/60 bg-slate-900/30 text-xs">
                    <span className="text-slate-400 font-bold">Extras</span>
                    <span className="text-[var(--text-primary)] font-black font-mono">
                      {currentInningsData.extras}{' '}
                      <span className="text-slate-500 font-normal text-[10px]">{currentInningsData.extrasDetail}</span>
                    </span>
                  </div>

                  {/* TOTAL RUNS SUMMARY */}
                  <div className="flex justify-between items-center py-3 px-3 bg-emerald-950/20 border-t border-emerald-500/10 text-xs">
                    <span className="text-white font-extrabold uppercase tracking-wide">Total Innings Score</span>
                    <span className="text-emerald-400 font-black text-sm italic font-mono">
                      {currentInningsRuns}/{currentInningsWickets}{' '}
                      <span className="text-slate-500 font-normal text-[10px] uppercase not-italic">in {currentInningsOvers} ov</span>
                    </span>
                  </div>

                  {/* YET TO BAT */}
                  {currentInningsData.yetToBat && currentInningsData.yetToBat.length > 0 && (
                    <div className="py-3 px-3 bg-slate-900/60 border-t border-slate-800">
                      <div className="text-slate-400 font-black text-[9px] uppercase tracking-widest mb-1.5 font-mono">Yet to Bat</div>
                      <div className="text-slate-500 text-xs font-semibold leading-5">
                        {currentInningsData.yetToBat.join(', ')}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bowling Scorecard */}
                <div className="bg-slate-900 border border-slate-800 py-3 px-4 rounded-xl">
                  <span className="text-white font-black text-xs uppercase tracking-wider italic">
                    🎯 {activeInningsTab === 0 ? teamB.name : teamA.name} Bowling
                  </span>
                </div>

                <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 overflow-hidden">
                  <div className="flex py-2.5 bg-slate-900 px-3 items-center border-b border-slate-800 text-[10px] font-black tracking-widest text-slate-400 font-mono">
                    <div className="flex-1">BOWLER</div>
                    <div className="w-10 text-center">O</div>
                    <div className="w-10 text-center">M</div>
                    <div className="w-10 text-center">R</div>
                    <div className="w-10 text-center">W</div>
                    <div className="w-10 text-center">NB</div>
                    <div className="w-10 text-center">WD</div>
                    <div className="w-16 text-right">ECO</div>
                  </div>

                  <div className="divide-y divide-slate-800/50">
                    {currentInningsData.bowling.map((bowl, i) => (
                      <div key={i} className="flex py-3.5 px-3 items-center hover:bg-slate-900/60 transition duration-150 font-mono text-xs text-slate-400">
                        <div className="flex-1 font-sans font-extrabold text-[var(--text-primary)]">{bowl.name}</div>
                        <div className="w-10 text-center text-[var(--text-primary)]">{bowl.overs.toFixed(1)}</div>
                        <div className="w-10 text-center">{bowl.maidens}</div>
                        <div className="w-10 text-center">{bowl.runs}</div>
                        <div className="w-10 text-center text-red-400 font-black">{bowl.wickets}</div>
                        <div className="w-10 text-center">{bowl.nb || 0}</div>
                        <div className="w-10 text-center">{bowl.wd || 0}</div>
                        <div className="w-16 text-right text-amber-400 font-extrabold">
                          {bowl.overs > 0 ? (bowl.runs / bowl.overs).toFixed(2) : '0.00'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FALL OF WICKETS */}
                {currentInningsData.fow && currentInningsData.fow.length > 0 && (
                  <div className="space-y-3">
                    <div className="bg-slate-900 border border-slate-800 py-3 px-4 rounded-xl">
                      <span className="text-white font-black text-xs uppercase tracking-wider italic">Fall of Wickets</span>
                    </div>
                    <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 overflow-hidden">
                      <div className="flex py-2.5 bg-slate-900 px-3 items-center border-b border-slate-800 text-[10px] font-black tracking-widest text-slate-400 font-mono">
                        <div className="flex-1">BATTER</div>
                        <div className="w-24 text-center">SCORE</div>
                        <div className="w-20 text-right">OVER</div>
                      </div>
                      <div className="divide-y divide-slate-800/50">
                        {currentInningsData.fow.map((f, i) => (
                          <div key={i} className="flex py-3 px-3 items-center text-xs">
                            <div className="flex-1 text-slate-300 font-bold">{f.batter}</div>
                            <div className="w-24 text-center text-emerald-400 font-black font-mono">{f.score}</div>
                            <div className="w-20 text-right text-slate-400 font-mono">{f.over}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* PARTNERSHIPS */}
                {currentInningsData.partnerships && currentInningsData.partnerships.length > 0 && (
                  <div className="space-y-3">
                    <div className="bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl">
                      <span className="text-white font-black text-xs uppercase tracking-wider italic">Partnerships</span>
                    </div>
                    <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 overflow-hidden">
                      <div className="flex py-2.5 bg-slate-900 px-3 items-center border-b border-slate-800 text-[10px] font-black tracking-widest text-slate-400 font-mono">
                        <div className="flex-1">WICKET</div>
                        <div className="w-36 text-right">PARTNERSHIP (RUNS)</div>
                      </div>
                      <div className="divide-y divide-slate-800/50">
                        {currentInningsData.partnerships.map((p, i) => (
                          <div key={i} className="flex py-3 px-3 items-center text-xs justify-between">
                            <div className="text-emerald-400 font-black text-[10px] uppercase font-mono">
                              {p.wicket === 'Unbroken' ? 'Unbroken' : `${p.wicket}${p.wicket === 1 ? 'st' : p.wicket === 2 ? 'nd' : p.wicket === 3 ? 'rd' : 'th'} Wicket`}
                            </div>
                            <div className="w-36 text-right text-white font-black font-mono">
                              {p.runs} <span className="text-slate-500 font-bold text-[9px]">({p.balls}b)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Subtab: WAGON WHEEL */}
          {activeSubTab === 'stats' && statsTab === 'wagon_wheel' && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] p-5 rounded-2xl flex flex-col md:flex-row gap-6 items-center justify-center">
                {/* Visual Field SVG representation */}
                <div className="relative w-[300px] h-[300px] bg-emerald-950/20 border border-emerald-500/25 rounded-full flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 300 300" className="w-[300px] h-[300px] absolute inset-0">
                    {/* Outer boundaries rings */}
                    <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="1" strokeDasharray="3" />
                    <circle cx="150" cy="150" r="135" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
                    {/* 30 yard circle */}
                    <circle cx="150" cy="150" r="85" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
                    {/* Center Pitch */}
                    <rect x="142" y="120" width="16" height="60" fill="rgba(6,78,59,0.8)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" rx="2" />
                    {/* Pitch Crease Lines */}
                    <line x1="142" y1="128" x2="158" y2="128" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                    <line x1="142" y1="172" x2="158" y2="172" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />

                    {/* Radiating lines starting from pitch center, color-coded for Boundaries, Singles, Dots, Wickets */}
                    {filteredWagonPoints.map((shot, idx) => {
                      const angleRad = (shot.angle * Math.PI) / 180;
                      let shotLength = 25;
                      if (shot.runs === 1) shotLength = 50;
                      else if (shot.runs === 2) shotLength = 75;
                      else if (shot.runs === 3) shotLength = 90;
                      else if (shot.runs === 4) shotLength = 115;
                      else if (shot.runs === 6) shotLength = 135;
                      else if (shot.runs > 0) shotLength = 65;

                      const x2 = 150 + shotLength * Math.cos(angleRad);
                      const y2 = 150 + shotLength * Math.sin(angleRad);

                      let shotColor = '#3b82f6'; // Blue for singles
                      if (shot.runs >= 4) shotColor = '#10b981'; // Emerald for boundaries
                      else if (shot.type === 'wicket') shotColor = '#ef4444'; // Red for wickets
                      else if (shot.runs === 0) shotColor = '#fbbf24'; // Amber for dots

                      const strokeWidth = shot.runs >= 4 ? 2 : shot.type === 'wicket' ? 1.5 : 1;
                      const strokeDash = shot.runs === 0 && shot.type !== 'wicket' ? '2' : 'none';

                      return (
                        <line
                          key={idx}
                          x1="150"
                          y1="150"
                          x2={x2}
                          y2={y2}
                          stroke={shotColor}
                          strokeWidth={strokeWidth}
                          strokeDasharray={strokeDash}
                          opacity={shot.runs >= 4 ? 0.95 : shot.type === 'wicket' ? 0.9 : 0.6}
                        />
                      );
                    })}
                  </svg>
                  
                  {/* Score Banner in Pitch Center */}
                  <div className="absolute bottom-4 bg-blue-600/90 border border-blue-400/30 px-4 py-1.5 rounded-lg shadow-lg pointer-events-none">
                    <span className="text-white font-extrabold text-[9px] uppercase tracking-wider italic">
                      WAGON WHEEL ACTIVE
                    </span>
                  </div>
                </div>

                {/* Filters & Information panel */}
                <div className="flex-1 space-y-4 max-w-sm w-full">
                  <h4 className="font-bold text-[var(--text-primary)]">Interactive Broadcast Wagon Wheel</h4>
                  <p className="text-[var(--text-secondary)] text-xs font-semibold">Custom field-radiation lines showing shot directions. Filter to inspect categories:</p>
                  
                  {/* Filter selector */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {['all', 'singles', 'boundaries', 'wickets'].map(f => (
                      <button
                        key={f}
                        onClick={() => setWagonFilter(f)}
                        className={`px-3 py-1.5 rounded border text-[10px] font-semibold uppercase tracking-wider transition cursor-pointer ${
                          wagonFilter === f 
                            ? 'bg-[var(--accent)] text-[var(--text-inverse)] border-[var(--accent)] font-bold' 
                            : 'bg-[var(--bg-input)] border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  {/* Legend list */}
                  <div className="grid grid-cols-2 gap-2 border-t border-[var(--border-default)] pt-4 font-mono text-[9px] uppercase font-bold">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                      <span className="text-[var(--text-secondary)]">Boundaries (4s/6s)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></span>
                      <span className="text-[var(--text-secondary)]">Singles & Runs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]"></span>
                      <span className="text-[var(--text-secondary)]">Dots (Amber)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
                      <span className="text-[var(--text-secondary)]">Wickets (Red)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subtab: OVER COMPARISON */}
          {activeSubTab === 'stats' && statsTab === 'over_comparison' && (
            <div className="space-y-6">
              {/* Over comparison charts (side-by-side RPO representation) */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] p-5 rounded-xl space-y-4">
                <h4 className="font-bold text-[var(--text-primary)]">Over-by-Over Runs Comparison</h4>
                <p className="text-[var(--text-secondary)] text-xs font-semibold">Comparison of runs scored in individual overs. Displays up to the total overs bowled in this match.</p>

                <div className="space-y-3 pt-2">
                  {Array.from({ length: Math.max(teamAOverRuns.length, teamBOverRuns.length) }).map((_, index) => {
                    const overNum = index + 1;
                    const runsA = teamAOverRuns[index] || 0;
                    const runsB = teamBOverRuns[index] || 0;

                    return (
                      <div key={index} className="flex items-center gap-4 text-[10px] font-mono">
                        <span className="w-14 text-[var(--text-secondary)] font-bold text-right">Over {overNum}</span>
                        
                        <div className="flex-1 flex flex-col gap-1.5">
                          {/* Team A Over Run Bar */}
                          <div className="flex items-center gap-2">
                            <div 
                              style={{ width: `${Math.min(100, (runsA / 18) * 100)}%` }} 
                              className="h-2.5 bg-[var(--accent)] rounded-sm min-w-[4px]"
                            ></div>
                            <span className="text-[var(--text-primary)] font-bold">{runsA} runs</span>
                            <span className="text-[var(--text-muted)] text-[8px] uppercase">{teamA.name.substring(0, 3)}</span>
                          </div>
                          
                          {/* Team B Over Run Bar */}
                          <div className="flex items-center gap-2">
                            <div 
                              style={{ width: `${Math.min(100, (runsB / 18) * 100)}%` }} 
                              className="h-2.5 bg-[var(--text-secondary)] rounded-sm min-w-[4px]"
                            ></div>
                            <span className="text-[var(--text-primary)] font-bold">{runsB} runs</span>
                            <span className="text-[var(--text-muted)] text-[8px] uppercase">{teamB.name.substring(0, 3)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Subtab: RUN COMPARISON */}
          {activeSubTab === 'stats' && statsTab === 'run_comparison' && (
            <div className="space-y-6">
              {/* Cumulative Run Comparison progression */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] p-5 rounded-xl space-y-4">
                <h4 className="font-bold text-[var(--text-primary)]">Cumulative Innings Progression</h4>
                <p className="text-[var(--text-secondary)] text-xs font-semibold">Line-graph simulation comparison of cumulative scores over-by-over.</p>

                <div className="space-y-3.5 pt-2">
                  {Array.from({ length: Math.max(teamACumulative.length, teamBCumulative.length) }).map((_, index) => {
                    const overNum = index + 1;
                    const scoreA = teamACumulative[index] || match.team_a_runs;
                    const scoreB = teamBCumulative[index] || match.team_b_runs;

                    return (
                      <div key={index} className="flex items-center gap-4 text-[10px] font-mono">
                        <span className="w-14 text-[var(--text-secondary)] font-bold text-right">Over {overNum}</span>
                        
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div className="bg-[var(--bg-input)] p-2.5 rounded-xl border border-[var(--border-default)] flex justify-between items-center">
                            <span className="text-[var(--text-muted)] uppercase text-[9px]">{teamA.name.substring(0, 3)}</span>
                            <span className="font-bold text-[var(--accent)]">{scoreA} runs</span>
                          </div>
                          <div className="bg-[var(--bg-input)] p-2.5 rounded-xl border border-[var(--border-default)] flex justify-between items-center">
                            <span className="text-[var(--text-muted)] uppercase text-[9px]">{teamB.name.substring(0, 3)}</span>
                            <span className="font-bold text-[var(--text-primary)]">{scoreB} runs</span>
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
        <div className="bg-[var(--bg-navbar)] p-4 border-t border-[var(--border-navbar)] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[var(--bg-input)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-default)] text-[var(--text-primary)] font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}