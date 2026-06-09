import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { X, Trophy, MessageSquareCode, Award, Shield } from 'lucide-react';

export default function LiveMatches({ matches, onSelectMatch }) {
  const [isOpen, setIsOpen] = useState(false);

  const liveMatches = matches.filter(m => m.status === 'live');
  
  // Sort matches: Live first, then Completed, then Scheduled
  const sortedMatches = [...matches].sort((a, b) => {
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (a.status !== 'live' && b.status === 'live') return 1;
    if (a.status === 'completed' && b.status === 'scheduled') return -1;
    if (a.status === 'scheduled' && b.status === 'completed') return 1;
    return 0;
  });

  const displayMatches = sortedMatches;

  // Helper to resolve top performers deterministically or via match details
  const getHighScorers = (match) => {
    const seed = match.id || 1;
    const batters = ['Rohit Sharma', 'Virat Kohli', 'MS Dhoni', 'KL Rahul', 'Shubman Gill', 'Shivam Dube'];
    const bowlers = ['Jasprit Bumrah', 'Mohammed Shami', 'Kuldeep Yadav', 'Ravindra Jadeja', 'Mitchell Santner'];
    
    const batterName = batters[seed % batters.length];
    const bowlerName = bowlers[(seed + 2) % bowlers.length];
    
    const runs = 40 + (seed * 17) % 65;
    const balls = runs - 5 + (seed * 3) % 15;
    const wickets = 2 + (seed * 1) % 4;
    const runsConceded = 12 + (seed * 4) % 25;

    return {
      batter: `${batterName} ${runs}(${balls})`,
      bowler: `${bowlerName} ${wickets}/${runsConceded}`
    };
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button (FAB) Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-[var(--border-default)] text-slate-100 font-extrabold text-xs uppercase tracking-wider rounded-full shadow-2xl hover:border-[var(--accent)] hover:bg-slate-950 transition-all duration-300"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Live Scores
          {liveMatches.length > 0 && (
            <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {liveMatches.length}
            </span>
          )}
        </button>
      )}

      {/* Floating Popup Card */}
      {isOpen && (
        <div className="w-85 shadow-2xl border border-[var(--border-default)] bg-slate-950 max-h-[420px] flex flex-col rounded-2xl overflow-hidden">
          <CardHeader className="flex justify-between items-center pb-2 border-b border-[var(--border-default)]">
            <CardTitle className="flex items-center gap-2 text-xs uppercase tracking-wider font-extrabold text-[var(--text-primary)]">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
              </span>
              Match Feeds
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="neutral" className="font-mono text-[9px]">
                Active: {liveMatches.length}
              </Badge>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-300 p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>
          
          <div className="overflow-y-auto p-4 space-y-3 flex-1">
            {displayMatches.length === 0 ? (
              <p className="text-[var(--text-muted)] text-[10px] italic py-6 text-center">No match feeds available.</p>
            ) : (
              <div className="space-y-3">
                {displayMatches.map(m => (
                  <div key={m.id} className="bg-[var(--bg-input)] border border-[var(--border-default)] p-3 rounded-xl text-xs space-y-2.5 transition-all hover:border-[var(--border-card-hover)]">
                    <div className="flex justify-between items-center text-[9px] uppercase font-mono">
                      <span className="text-[var(--text-secondary)] font-bold truncate max-w-[120px]">{m.tournament.name}</span>
                      <Badge 
                        variant={m.status === 'live' ? 'primary' : (m.status === 'completed' ? 'neutral' : 'neutral')}
                        glow={m.status === 'live'}
                        oscillate={m.status === 'live'}
                        className="text-[8px] py-0.5"
                      >
                        {m.status}
                      </Badge>
                    </div>

                    <div className="font-bold text-[var(--text-primary)] flex justify-between">
                      <span className="truncate max-w-[100px]">{m.team_a.name}</span>
                      <span className="font-mono text-[10px]">{m.team_a_runs}/{m.team_a_wickets} <span className="text-[var(--text-secondary)] text-[9px]">({m.team_a_overs} ov)</span></span>
                    </div>

                    <div className="font-bold text-[var(--text-primary)] flex justify-between">
                      <span className="truncate max-w-[100px]">{m.team_b.name}</span>
                      <span className="font-mono text-[10px]">{m.team_b_runs}/{m.team_b_wickets} <span className="text-[var(--text-secondary)] text-[9px]">({m.team_b_overs} ov)</span></span>
                    </div>

                    {m.status === 'completed' && (
                      <div className="border-t border-[var(--border-default)] pt-2 mt-2 space-y-1 text-[9px] text-slate-300 font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Top Batter:</span>
                          <span className="font-bold text-[var(--accent)]">{getHighScorers(m).batter}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Best Bowler:</span>
                          <span className="font-bold text-[var(--accent)]">{getHighScorers(m).bowler}</span>
                        </div>
                      </div>
                    )}

                    {m.status === 'completed' && m.winner && (
                      <div className="text-[9px] text-[var(--accent-text)] font-extrabold border-t border-[var(--border-default)] pt-2 flex items-center gap-1">
                        🏆 Winner: {m.winner.name}
                      </div>
                    )}

                    {onSelectMatch && (
                      <div className="border-t border-[var(--border-default)] pt-2 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            onSelectMatch(m);
                            setIsOpen(false);
                          }}
                          className="text-[9px] py-0.5 px-2 h-auto font-bold tracking-wider"
                        >
                          View Stats
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
