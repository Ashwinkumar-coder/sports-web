import React from 'react';
import { Card, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Users, Trophy } from 'lucide-react';

export default function CoachView({ activeTab, dashboardData }) {
  if (activeTab === 'dashboard') {
    return (
      <div className="space-y-6 text-xs">
        {/* Aggregates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-default)] p-5 rounded-2xl flex flex-col justify-center">
            <span className="text-[var(--text-secondary)] text-[10px] font-extrabold uppercase tracking-widest">Teams Trained</span>
            <span className="text-3xl font-black text-[var(--accent)] mt-1 font-display">{dashboardData.teams_trained_count}</span>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-default)] p-5 rounded-2xl flex flex-col justify-center">
            <span className="text-[var(--text-secondary)] text-[10px] font-extrabold uppercase tracking-widest">Total Mentored Players</span>
            <span className="text-3xl font-black text-[var(--accent)] mt-1 font-display">{dashboardData.players_trained_count}</span>
          </div>
        </div>

        {/* Leaderboard of coached players */}
        <Card>
          <CardHeader className="mb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[var(--accent)]" />
              Player Performance Leaderboard
            </CardTitle>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Review performance calculations of your trained players sorted from highest to lowest index score.
            </p>
          </CardHeader>
          
          {dashboardData.players.length === 0 ? (
            <p className="text-[var(--text-muted)] text-xs italic py-4 text-center">No players are currently registered in your squads.</p>
          ) : (
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs text-[var(--text-primary)] border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-default)] text-[var(--text-secondary)] uppercase tracking-wider font-extrabold text-[10px]">
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Player Name</th>
                    <th className="py-2.5 px-3 text-right">Runs</th>
                    <th className="py-2.5 px-3 text-right">Balls</th>
                    <th className="py-2.5 px-3 text-right">Wickets</th>
                    <th className="py-2.5 px-3 text-right">Conceded</th>
                    <th className="py-2.5 px-3 text-right">Index Score</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.players.map((p, idx) => (
                    <tr key={p.player_id} className="border-b border-[var(--border-default)] hover:bg-[var(--bg-sidebar-hover)] transition-colors">
                      <td className="py-3 px-3 font-mono text-[var(--accent)] font-bold">#{idx + 1}</td>
                      <td className="py-3 px-3 font-bold">
                        {p.full_name}
                        <span className="block text-[10px] text-[var(--text-secondary)] font-normal">{p.teams.join(', ')}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono">{p.runs_scored}</td>
                      <td className="py-3 px-3 text-right font-mono text-[var(--text-secondary)]">{p.balls_faced}</td>
                      <td className="py-3 px-3 text-right font-mono text-[var(--accent)] font-bold">{p.wickets_taken}</td>
                      <td className="py-3 px-3 text-right font-mono text-[var(--text-secondary)]">{p.runs_conceded}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[var(--accent)]">{p.performance_score.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    );
  }

  if (activeTab === 'squads') {
    const squads = dashboardData.coached_teams || [];
    return (
      <div className="space-y-6 text-xs">
        <Card>
          <CardHeader className="mb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--accent)]" />
              Training Squads
            </CardTitle>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Review all the cricket squads/teams currently registered under your training and coaching mentorship.
            </p>
          </CardHeader>
          
          {squads.length === 0 ? (
            <p className="text-[var(--text-muted)] text-xs italic py-4 text-center">You are not currently registered as the coach for any team.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {squads.map(s => (
                <div key={s.id} className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-default)] space-y-2.5 relative overflow-hidden group hover:border-[var(--border-card-hover)] transition-all">
                  <div className="absolute top-0 right-0 bg-[var(--accent-glow)] text-[var(--accent)] px-2.5 py-0.5 rounded-bl font-mono text-[9px] uppercase tracking-widest font-extrabold border-l border-b border-[var(--border-navbar)]">
                    Squad
                  </div>
                  <div className="font-extrabold text-[var(--text-primary)] text-sm group-hover:text-[var(--accent)] transition duration-200">
                    🏏 {s.name}
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)]">
                    <span className="text-[var(--text-muted)] uppercase tracking-wider font-extrabold text-[9px]">Tournament:</span> {s.tournament_name}
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)]">
                    <span className="text-[var(--text-muted)] uppercase tracking-wider font-extrabold text-[9px]">Squad Size:</span> {s.player_count} Players
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  }

  return null;
}
