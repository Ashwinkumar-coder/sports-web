import React from 'react';
import { Card, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Trophy, Activity, Users, Shield } from 'lucide-react';

export default function PlayerView({
  activeTab,
  dashboardData,
  tournaments,
  selectedTournament,
  setSelectedTournament,
  newTeam,
  setNewTeam,
  usersList,
  handleRegisterTeam,
  currentUser
}) {
  if (activeTab === 'dashboard') {
    return (
      <div className="space-y-6 text-xs">
        {/* Summary row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-default)] p-5 rounded-2xl flex flex-col justify-center text-center">
            <span className="text-[var(--text-secondary)] text-[10px] font-extrabold uppercase tracking-widest">Matches Played</span>
            <span className="text-2xl font-black text-[var(--accent)] mt-1 font-display">{dashboardData.matches_played}</span>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-default)] p-5 rounded-2xl flex flex-col justify-center text-center">
            <span className="text-[var(--text-secondary)] text-[10px] font-extrabold uppercase tracking-widest">Matches Won</span>
            <span className="text-2xl font-black text-[var(--accent)] mt-1 font-display">{dashboardData.matches_won}</span>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-default)] p-5 rounded-2xl flex flex-col justify-center text-center">
            <span className="text-[var(--text-secondary)] text-[10px] font-extrabold uppercase tracking-widest">Matches Lost</span>
            <span className="text-2xl font-black text-[var(--text-secondary)] mt-1 font-display">{dashboardData.matches_lost}</span>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-default)] p-5 rounded-2xl flex flex-col justify-center text-center">
            <span className="text-[var(--text-secondary)] text-[10px] font-extrabold uppercase tracking-widest">Performance Index</span>
            <span className="text-2xl font-black text-[var(--accent)] mt-1 font-display">
              {typeof dashboardData.overall_performance === 'number' 
                ? dashboardData.overall_performance.toFixed(1) 
                : '0.0'}
            </span>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--bg-input)] border border-[var(--border-default)] p-4 rounded-xl text-center">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-extrabold block">Total Runs</span>
            <span className="text-lg font-bold text-[var(--text-primary)] mt-1 block font-mono">{dashboardData.total_runs || 0}</span>
          </div>
          <div className="bg-[var(--bg-input)] border border-[var(--border-default)] p-4 rounded-xl text-center">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-extrabold block">Balls Faced</span>
            <span className="text-lg font-bold text-[var(--text-primary)] mt-1 block font-mono">{dashboardData.total_balls || 0}</span>
          </div>
          <div className="bg-[var(--bg-input)] border border-[var(--border-default)] p-4 rounded-xl text-center">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-extrabold block">Wickets Taken</span>
            <span className="text-lg font-bold text-[var(--accent)] mt-1 block font-mono">{dashboardData.total_wickets || 0}</span>
          </div>
          <div className="bg-[var(--bg-input)] border border-[var(--border-default)] p-4 rounded-xl text-center">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-extrabold block">Runs Conceded</span>
            <span className="text-lg font-bold text-[var(--text-secondary)] mt-1 block font-mono">{dashboardData.total_runs_conceded || 0}</span>
          </div>
        </div>

        {/* Teams played for */}
        <Card>
          <CardHeader className="mb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--accent)]" />
              Registered Teams
            </CardTitle>
          </CardHeader>
          {dashboardData.team_names.length === 0 ? (
            <p className="text-[var(--text-muted)] text-xs italic py-4 text-center">You have not registered for any tournament team yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2.5 mt-2">
              {dashboardData.team_names.map((name, i) => (
                <span key={i} className="bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] text-xs px-3.5 py-1.5 rounded-full font-bold">
                  🏏 {name}
                </span>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  }

  if (activeTab === 'register_team') {
    const openTournaments = tournaments.filter(t => t.is_approved && t.status === 'registration_open');
    return (
      <div className="space-y-6 text-xs">
        <Card>
          <CardHeader className="mb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--accent)]" />
              Register for Approved Tournaments
            </CardTitle>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Join an active cricket tournament by naming your team squad, selecting a certified Coach, and nominating team players.
            </p>
          </CardHeader>
          
          {openTournaments.length === 0 ? (
            <p className="text-[var(--text-muted)] text-xs italic py-4 text-center">No open tournaments available for registration at this time.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              {/* Tournaments list */}
              <div className="space-y-3">
                <span className="block text-[10px] text-[var(--text-secondary)] font-extrabold uppercase tracking-wider mb-1">Available Tournaments</span>
                {openTournaments.map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTournament(t)
                      setNewTeam({ name: '', coach_id: '', player_ids: [] })
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedTournament?.id === t.id 
                        ? 'border-[var(--accent)] bg-[var(--accent-glow)]' 
                        : 'border-[var(--border-default)] bg-[var(--bg-input)] hover:border-[var(--border-card-hover)]'
                    }`}
                  >
                    <div className="font-extrabold text-[var(--text-primary)] text-sm">{t.name}</div>
                    <div className="text-[10px] text-[var(--text-secondary)] mt-1.5">
                      Entry Fee: <span className="font-bold text-[var(--accent)]">₹{t.fee}</span> | Team Size: <span className="font-bold text-[var(--accent)]">{t.maximum_player_count} players</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected registration form */}
              {selectedTournament ? (
                <form onSubmit={handleRegisterTeam} autoComplete="off" className="bg-[var(--bg-input)] p-5 rounded-2xl border border-[var(--border-default)] space-y-4">
                  <h4 className="text-[10px] font-extrabold text-[var(--accent)] uppercase tracking-widest">Signing up for: {selectedTournament.name}</h4>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-[var(--text-secondary)] font-bold uppercase">Team Name</label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      placeholder="Enter Team Name"
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-[var(--text-secondary)] font-bold uppercase">Select Coach</label>
                    <select
                      required
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newTeam.coach_id}
                      onChange={(e) => setNewTeam({ ...newTeam, coach_id: e.target.value })}
                    >
                      <option value="">-- Select Coach --</option>
                      {usersList.filter(u => u.role === 'coach').map(c => (
                        <option key={c.id} value={c.id}>{c.full_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-[var(--text-secondary)] font-bold uppercase">
                      Select Teammates (Select {selectedTournament.maximum_player_count - 1} players)
                    </label>
                    <div className="max-h-36 overflow-y-auto border border-[var(--border-default)] p-3 rounded-xl space-y-2 bg-[var(--bg-page)]">
                      {usersList.filter(u => u.role === 'player' && u.id !== currentUser.id).map(p => (
                        <label key={p.id} className="flex items-center gap-2.5 text-xs text-[var(--text-primary)] cursor-pointer font-semibold">
                          <input
                            type="checkbox"
                            value={p.id}
                            checked={newTeam.player_ids.includes(p.id.toString())}
                            className="rounded border-[var(--border-default)] text-[var(--accent)] focus:ring-[var(--accent)]"
                            onChange={(e) => {
                              const id = e.target.value
                              let updated = [...newTeam.player_ids]
                              if (e.target.checked) {
                                updated.push(id)
                              } else {
                                updated = updated.filter(x => x !== id)
                              }
                              setNewTeam({ ...newTeam, player_ids: updated })
                            }}
                          />
                          {p.full_name}
                        </label>
                      ))}
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] font-semibold italic mt-1 block">
                      Selected: {newTeam.player_ids.length} of {selectedTournament.maximum_player_count - 1} required
                    </span>
                  </div>
                  <Button type="submit" className="w-full uppercase text-xs">
                    Complete Signup
                  </Button>
                </form>
              ) : (
                <div className="border border-dashed border-[var(--border-default)] rounded-2xl flex items-center justify-center p-6 text-center text-[var(--text-muted)] italic">
                  Select a tournament from the left to start registration.
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    );
  }

  return null;
}
