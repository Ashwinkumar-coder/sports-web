import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Calendar, Users, Award, PlusCircle, Check, 
  Play, Ban, ShieldCheck, HeartHandshake, UserCheck, 
  MapPin, Coins, Sparkles, Plus, Info, Clock, AlertCircle, Trash2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import StaticCharts from './StaticCharts';

// Framer Motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const tabVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } }
};

export default function DepartmentAdminView({
  activeTab,
  newFed,
  setNewFed,
  handleCreateFederation,
  usersList = [],
  pendingUsers = [],
  handleApproveUser,
  pendingTournaments = [],
  handleApproveTournament,
  departments = [],
  federations = [],
  tournaments = [],
  matches = [],
  handleDeleteUser,
  handleDeleteMatch,
  handleDeleteFederation,
  handleDeleteTournament,
  onSelectMatch
}) {

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

  const [usersSubView, setUsersSubView] = useState('profiles');

  const live = matches.filter(m => m.status === 'live');
  const upcoming = matches.filter(m => m.status === 'scheduled');
  const finished = matches.filter(m => m.status === 'completed');
  const cancelled = matches.filter(m => m.status === 'cancelled');

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        variants={tabVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full text-xs"
      >
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Metric Cards without icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] p-5 rounded-2xl flex flex-col justify-center">
                <span className="text-[var(--text-secondary)] text-[10px] font-extrabold uppercase tracking-widest">Pending Registrations</span>
                <span className="text-3xl font-black text-[var(--accent)] mt-1 font-display">{pendingUsers.length}</span>
              </div>
              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] p-5 rounded-2xl flex flex-col justify-center">
                <span className="text-[var(--text-secondary)] text-[10px] font-extrabold uppercase tracking-widest">Pending Tournaments</span>
                <span className="text-3xl font-black text-[var(--accent)] mt-1 font-display">{pendingTournaments.length}</span>
              </div>
            </div>

            {/* Platform Operations Summary */}
            <Card>
              <CardHeader className="mb-4">
                <CardTitle className="text-sm font-extrabold uppercase tracking-wider text-[var(--text-primary)]">
                  🏛️ Platform Operations Summary
                </CardTitle>
              </CardHeader>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mt-2">
                <div className="bg-[var(--bg-input)] border border-[var(--border-default)] p-4 rounded-xl">
                  <div className="text-[var(--text-muted)] text-[9px] font-black uppercase tracking-widest">Active Federations</div>
                  <div className="text-xl font-bold text-[var(--text-primary)] mt-1.5">{federations.length}</div>
                </div>
                <div className="bg-[var(--bg-input)] border border-[var(--border-default)] p-4 rounded-xl">
                  <div className="text-[var(--text-muted)] text-[9px] font-black uppercase tracking-widest">Supervised Tourneys</div>
                  <div className="text-xl font-bold text-[var(--text-primary)] mt-1.5">{tournaments.length}</div>
                </div>
                <div className="bg-[var(--bg-input)] border border-[var(--border-default)] p-4 rounded-xl">
                  <div className="text-[var(--text-muted)] text-[9px] font-black uppercase tracking-widest">Registered Coaches</div>
                  <div className="text-xl font-bold text-[var(--text-primary)] mt-1.5">
                    {usersList.filter(u => u.role === 'coach').length}
                  </div>
                </div>
                <div className="bg-[var(--bg-input)] border border-[var(--border-default)] p-4 rounded-xl">
                  <div className="text-[var(--text-muted)] text-[9px] font-black uppercase tracking-widest">Official Scorers</div>
                  <div className="text-xl font-bold text-[var(--text-primary)] mt-1.5">
                    {usersList.filter(u => u.role === 'scorer').length}
                  </div>
                </div>
              </div>
            </Card>



            {/* Static Analytics Charts */}
            <StaticCharts />
          </div>
        )}

        {activeTab === 'create_federation' && (
          <div className="space-y-6">
            {/* Federation Creation Form */}
            <Card>
              <CardHeader className="mb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-[var(--accent)]" />
                  Create a Federation
                </CardTitle>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Establish a new governing branch and assign an approved Federation Admin to manage it.</p>
              </CardHeader>
              <form onSubmit={handleCreateFederation} autoComplete="off" className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-2">
                {/* Dummy inputs to prevent Chrome autofill */}
                <input type="text" name="chrome-email-prevent-fed" style={{ display: 'none' }} autoComplete="off" />
                <input type="password" name="chrome-password-prevent-fed" style={{ display: 'none' }} autoComplete="new-password" />

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Federation Name</label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    placeholder="e.g. State Cricket Association"
                    className="w-full rounded-xl px-3 py-2 text-xs"
                    value={newFed.name}
                    onChange={(e) => setNewFed({ ...newFed, name: e.target.value })}
                  />
                </div>
                <div className="col-span-3 md:col-span-1 space-y-1">
                  <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Create Federation Admin</p>
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Full Name"
                    className="w-full rounded-xl px-3 py-1.5 text-xs mb-1"
                    value={newFed.new_admin_name || ''}
                    onChange={(e) => setNewFed({ ...newFed, new_admin_name: e.target.value })}
                  />
                  <input
                    type="email"
                    autoComplete="one-time-code"
                    placeholder="Email"
                    className="w-full rounded-xl px-3 py-1.5 text-xs mb-1 font-mono"
                    value={newFed.new_admin_email || ''}
                    onChange={(e) => setNewFed({ ...newFed, new_admin_email: e.target.value })}
                  />
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Password"
                    className="w-full rounded-xl px-3 py-1.5 text-xs"
                    value={newFed.new_admin_password || ''}
                    onChange={(e) => setNewFed({ ...newFed, new_admin_password: e.target.value })}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="w-full">
                    Create Federation
                  </Button>
                </div>
              </form>
            </Card>

            {/* Existing Federations */}
            <Card>
              <CardHeader className="mb-4">
                <CardTitle className="text-base">Active Federations</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-2">
                {federations.map(f => {
                  const dept = departments.find(d => d.id === f.department_id);
                  const adminUser = usersList.find(u => u.id === f.admin_id);
                  return (
                    <div key={f.id} className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-default)] flex justify-between items-center hover:border-[var(--border-card-hover)] transition-all">
                      <div>
                        <div className="font-extrabold text-[var(--text-primary)]">🏅 {f.name}</div>
                        <div className="text-[10px] text-[var(--text-secondary)] mt-1">Supervising Dept: {dept ? dept.name : 'None'}</div>
                        <div className="text-[10px] text-[var(--accent)] font-semibold mt-1">Admin: {adminUser ? adminUser.full_name : 'None'}</div>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteFederation(f.id)}
                        icon={Trash2}
                      >
                        Delete
                      </Button>
                    </div>
                  );
                })}
                {federations.length === 0 && (
                  <p className="text-[var(--text-muted)] italic py-2">No federations created yet.</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'approve_users' && (
          <Card>
            <CardHeader className="mb-4">
              <CardTitle className="text-base">Approve User Registrations</CardTitle>
            </CardHeader>
            {pendingUsers.length === 0 ? (
              <p className="text-[var(--text-muted)] text-xs italic py-4 text-center">No registrations currently awaiting approval.</p>
            ) : (
              <div className="space-y-2 mt-2">
                {pendingUsers.map(u => (
                  <div key={u.id} className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-default)] flex justify-between items-center text-xs hover:border-[var(--border-card-hover)] transition-all">
                    <div>
                      <span className="font-bold text-[var(--text-primary)]">{u.full_name}</span>
                      <span className="block text-[10px] text-[var(--text-secondary)] uppercase font-mono mt-0.5">{u.role}</span>
                      <span className="block text-[10px] text-[var(--text-secondary)] font-mono">{u.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveUser(u.id)}
                        icon={Check}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteUser(u.id)}
                        icon={Trash2}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'approve_tournaments' && (
          <Card>
            <CardHeader className="mb-4">
              <CardTitle className="text-base">Approve Federation Tournaments</CardTitle>
            </CardHeader>
            {pendingTournaments.length === 0 ? (
              <p className="text-[var(--text-muted)] text-xs italic py-4 text-center">No tournament requests currently awaiting approval.</p>
            ) : (
              <div className="space-y-2 mt-2">
                {pendingTournaments.map(t => (
                  <div key={t.id} className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-default)] flex justify-between items-center text-xs hover:border-[var(--border-card-hover)] transition-all">
                    <div>
                      <span className="font-bold text-[var(--text-primary)]">{t.name}</span>
                      <span className="block text-[10px] text-[var(--text-secondary)] mt-0.5 font-mono">Federation ID: {t.federation_id}</span>
                      <span className="block text-[10px] text-[var(--text-secondary)] font-mono">Fee: ₹{t.fee} | Entries: {t.number_of_entry}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveTournament(t.id)}
                        icon={Check}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteTournament(t.id)}
                        icon={Trash2}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'users' && (
          <Card>
            <CardHeader className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="space-y-1">
                <CardTitle className="text-base">All Department Users</CardTitle>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setUsersSubView('profiles')}
                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition ${
                      usersSubView === 'profiles'
                        ? 'bg-[var(--accent)] text-[var(--text-inverse)] font-black'
                        : 'bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    User Profiles
                  </button>
                  <button
                    onClick={() => setUsersSubView('teams')}
                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition ${
                      usersSubView === 'teams'
                        ? 'bg-[var(--accent)] text-[var(--text-inverse)] font-black'
                        : 'bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Players by Team
                  </button>
                </div>
              </div>
            </CardHeader>
            {usersSubView === 'profiles' ? (
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left text-xs text-[var(--text-primary)] border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-default)] text-[var(--text-secondary)] uppercase tracking-wider font-extrabold text-[10px]">
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Email</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(u => (
                      <tr key={u.id} className="border-b border-[var(--border-default)] hover:bg-[var(--bg-sidebar-hover)] transition-colors">
                        <td className="py-3 px-3 font-bold">{u.full_name}</td>
                        <td className="py-3 px-3 font-mono text-[var(--text-secondary)]">{u.email}</td>
                        <td className="py-3 px-3 capitalize text-[var(--text-secondary)]">{u.role.replace(/_/g, ' ')}</td>
                        <td className="py-3 px-3">
                          <Badge variant={u.is_approved ? "success" : "neutral"}>
                            {u.is_approved ? "Active" : "Pending/Blocked"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (() => {
              // Gather all teams across all tournaments
              const allTeams = [];
              tournaments.forEach(t => {
                if (t.teams) {
                  t.teams.forEach(team => {
                    allTeams.push({
                      ...team,
                      tournamentName: t.name
                    });
                  });
                }
              });

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {allTeams.map(team => (
                    <div key={team.id} className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-default)] space-y-3">
                      <div className="flex justify-between items-center border-b border-[var(--border-default)] pb-2">
                        <span className="font-extrabold text-[var(--text-primary)] text-xs">🛡️ {team.name}</span>
                        <span className="text-[9px] uppercase font-bold text-[var(--accent)] truncate max-w-[120px]" title={team.tournamentName}>
                          🏆 {team.tournamentName}
                        </span>
                      </div>
                      {team.coach && (
                        <div className="text-[10px] text-[var(--text-primary)]">
                          <span className="text-[var(--text-secondary)] font-bold">Coach: </span>
                          {team.coach.full_name}
                        </div>
                      )}
                      <div className="space-y-1.5">
                        <div className="text-[9px] font-extrabold uppercase text-[var(--text-secondary)] tracking-wider font-mono">Teammates ({team.players ? team.players.length : 0})</div>
                        {(!team.players || team.players.length === 0) ? (
                          <p className="text-[var(--text-secondary)] italic text-[10px]">No players in squad.</p>
                        ) : (
                          <div className="flex flex-col gap-1 max-h-36 overflow-y-auto scrollbar-none font-mono text-[10px] text-[var(--text-primary)]">
                            {team.players.map(tp => (
                              <div key={tp.id} className="bg-[var(--bg-page)] px-2 py-1 rounded border border-[var(--border-default)] truncate">
                                • {tp.player?.full_name || 'Registered Player'}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {allTeams.length === 0 && (
                    <p className="text-[var(--text-secondary)] italic text-center col-span-full py-8">No registered teams found.</p>
                  )}
                </div>
              );
            })()}
          </Card>
        )}

        {activeTab === 'tournaments' && (
          <Card>
            <CardHeader className="mb-4">
              <CardTitle className="text-base">Tournaments</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {tournaments.map(t => (
                <div key={t.id} className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-default)] flex justify-between items-center text-xs hover:border-[var(--border-card-hover)] transition-all">
                  <div>
                    <div className="font-bold text-[var(--text-primary)] text-sm">🏆 {t.name}</div>
                    <div className="text-[var(--text-secondary)] mt-1.5 capitalize">Status: <Badge variant="primary">{t.status.replace(/_/g, ' ')}</Badge></div>
                    <div className="text-[var(--text-secondary)] mt-0.5 font-mono">Slots: <span className="font-bold text-[var(--accent)]">{t.teams ? t.teams.length : 0}</span> / {t.number_of_entry} Teams</div>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteTournament(t.id)}
                    icon={Trash2}
                  >
                    Delete
                  </Button>
                </div>
              ))}
              {tournaments.length === 0 && (
                <p className="text-[var(--text-muted)] italic py-2 col-span-2 text-center">No tournaments available.</p>
              )}
            </div>
          </Card>
        )}

        {activeTab === 'matches' && (
          <div className="space-y-6 text-xs">
            {/* Live Matches */}
            <Card>
              <CardHeader className="mb-4">
                <CardTitle className="text-[var(--accent)] text-sm flex items-center gap-2 uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-ping"></span>
                  Live Matches ({live.length})
                </CardTitle>
              </CardHeader>
              {live.length === 0 ? (
                <p className="text-[var(--text-muted)] text-sm italic py-2">No matches currently live.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {live.map(m => (
                    <div key={m.id} className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-default)] space-y-3 transition-all hover:border-[var(--border-card-hover)]">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[var(--text-primary)]">{m.team_a.name} vs {m.team_b.name}</span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onSelectMatch(m)}
                        >
                          View
                        </Button>
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] font-mono bg-[var(--bg-page)] p-3 rounded-lg border border-[var(--border-default)] space-y-1.5">
                        <div className="flex justify-between">
                          <span>{m.team_a.name}:</span>
                          <span className="text-[var(--text-primary)] font-bold">{m.team_a_runs}/{m.team_a_wickets} ({m.team_a_overs} ov)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{m.team_b.name}:</span>
                          <span className="text-[var(--text-primary)] font-bold">{m.team_b_runs}/{m.team_b_wickets} ({m.team_b_overs} ov)</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono">
                        League: {m.tournament.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Upcoming Matches */}
            <Card>
              <CardHeader className="mb-4">
                <CardTitle className="text-[var(--text-primary)] text-sm">Upcoming Fixtures ({upcoming.length})</CardTitle>
              </CardHeader>
              {upcoming.length === 0 ? (
                <p className="text-[var(--text-muted)] text-sm italic py-2">No upcoming fixtures scheduled.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {upcoming.map(m => (
                    <div key={m.id} className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-default)] flex justify-between items-center transition-all hover:border-[var(--border-card-hover)]">
                      <div>
                        <div className="font-bold text-[var(--text-primary)]">{m.team_a.name} vs {m.team_b.name}</div>
                        <div className="text-[10px] text-[var(--text-secondary)] font-mono mt-1">Tournament: {m.tournament.name}</div>
                        <Badge variant="primary" className="uppercase mt-1.5">Scheduled</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onSelectMatch(m)}
                        >
                          View
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteMatch(m.id)}
                          icon={Trash2}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Finished Matches */}
            <Card>
              <CardHeader className="mb-4">
                <CardTitle className="text-[var(--text-primary)] text-sm">Finished Matches ({finished.length})</CardTitle>
              </CardHeader>
              {finished.length === 0 ? (
                <p className="text-[var(--text-muted)] text-sm italic py-2">No finished matches.</p>
              ) : (
                <div className="space-y-3">
                  {finished.map(m => {
                    const winnerName = m.winner_id === m.team_a_id ? m.team_a.name : (m.winner_id === m.team_b_id ? m.team_b.name : 'Draw / No Result');
                    return (
                      <div key={m.id} className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-default)] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 transition-all hover:border-[var(--border-card-hover)]">
                        <div>
                          <div className="font-bold text-[var(--text-primary)]">{m.team_a.name} vs {m.team_b.name}</div>
                          <div className="text-[10px] text-[var(--text-secondary)] font-mono mt-1">Tournament: {m.tournament.name}</div>
                          <div className="text-[10px] text-[var(--text-secondary)] font-mono mt-0.5">
                            Scores: {m.team_a.name} ({m.team_a_runs}/{m.team_a_wickets}) | {m.team_b.name} ({m.team_b_runs}/{m.team_b_wickets})
                          </div>
                          <div className="border-t border-[var(--border-default)] pt-2 mt-2 space-y-1 text-[9px] text-[var(--text-secondary)] font-mono">
                            <div className="flex gap-4">
                              <div>
                                <span>Top Batter: </span>
                                <span className="font-bold text-[var(--accent)]">{getHighScorers(m).batter}</span>
                              </div>
                              <div>
                                <span>Best Bowler: </span>
                                <span className="font-bold text-[var(--accent)]">{getHighScorers(m).bowler}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onSelectMatch(m)}
                          >
                            View
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteMatch(m.id)}
                            icon={Trash2}
                          >
                            Delete
                          </Button>
                          <Badge variant="success" glow>
                            🏆 Winner: {winnerName}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
