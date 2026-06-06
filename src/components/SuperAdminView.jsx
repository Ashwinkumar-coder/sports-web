import { useState } from 'react';

export default function SuperAdminView({
  activeTab,
  newDeptName,
  setNewDeptName,
  handleCreateDept,
  departments,
  federations,
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

  const toggleTournament = (id) => {
    setExpandedTournaments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const deptAdmins = usersList.filter(u => u.role === 'department_admin');

  if (activeTab === 'overview') {
    return (
      <div className="space-y-6">
        {/* Metric Summaries */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col justify-center">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Total Depts</span>
            <span className="text-2xl font-black text-sports-cyan mt-1">{departments.length}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col justify-center">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Total Feds</span>
            <span className="text-2xl font-black text-indigo-400 mt-1">{federations.length}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col justify-center">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Dept Admins</span>
            <span className="text-2xl font-black text-emerald-400 mt-1">{deptAdmins.length}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col justify-center">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Tournaments</span>
            <span className="text-2xl font-black text-pink-400 mt-1">{tournaments.length}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col justify-center">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Matches</span>
            <span className="text-2xl font-black text-amber-400 mt-1">{matches.length}</span>
          </div>
        </div>

        {/* Quick Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
            <h4 className="font-bold text-slate-200">Active Departments</h4>
            {departments.length === 0 ? (
              <p className="text-slate-500 text-xs italic">No departments created yet.</p>
            ) : (
              <div className="space-y-1 font-mono text-xs">
                {departments.slice(0, 5).map(d => (
                  <div key={d.id} className="bg-slate-950/60 p-2 rounded border border-slate-900 text-slate-300">
                    🏛️ {d.name}
                  </div>
                ))}
                {departments.length > 5 && (
                  <div className="text-slate-500 text-[10px] text-right italic">+ {departments.length - 5} more departments</div>
                )}
              </div>
            )}
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
            <h4 className="font-bold text-slate-200">Registered Federations</h4>
            {federations.length === 0 ? (
              <p className="text-slate-500 text-xs italic">No federations created yet.</p>
            ) : (
              <div className="space-y-1 font-mono text-xs">
                {federations.slice(0, 5).map(f => (
                  <div key={f.id} className="bg-slate-950/60 p-2 rounded border border-slate-900 text-slate-300">
                    🏅 {f.name}
                  </div>
                ))}
                {federations.length > 5 && (
                  <div className="text-slate-500 text-[10px] text-right italic">+ {federations.length - 5} more federations</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'departments') {
    return (
      <div className="space-y-6">
        {/* Create Department */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-lg space-y-4">
          <h3 className="font-bold text-lg text-slate-200">Create a Department</h3>
          <p className="text-slate-400 text-sm">Departments represent high-level organizational bodies that oversee federations and approve actions.</p>
          <form onSubmit={handleCreateDept} className="flex gap-3 text-xs max-w-lg">
            <input
              type="text"
              required
              placeholder="e.g. National Cricket Council"
              className="flex-1 bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
            />
            <button type="submit" className="px-4 py-1.5 rounded bg-sports-cyan text-slate-950 font-bold uppercase cursor-pointer">
              Add Department
            </button>
          </form>
        </div>

        {/* List of Departments */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
          <h4 className="font-bold text-slate-200 flex justify-between items-center">
            <span>Active Departments</span>
            <span className="bg-sports-cyan/10 text-sports-cyan text-[10px] font-mono px-2 py-0.5 rounded border border-sports-cyan/30">Total: {departments.length}</span>
          </h4>
          {departments.length === 0 ? (
            <p className="text-slate-500 text-xs italic">No departments created yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {departments.map(d => (
                <div key={d.id} className="bg-slate-950/60 p-3 rounded border border-slate-900 text-slate-300">
                  <div className="font-bold">🏛️ {d.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'admins') {
    return (
      <div className="space-y-6">
        {/* Create Department Admin */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-lg space-y-4">
          <h3 className="font-bold text-lg text-slate-200">Create a Department Admin</h3>
          <p className="text-slate-400 text-sm">Create and assign an administrator to manage a specific department's approvals and federations.</p>
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
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
          <h4 className="font-bold text-slate-200 flex justify-between items-center">
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

  if (activeTab === 'federations') {
    return (
      <div className="space-y-6">
        {/* List of Federations */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
          <h4 className="font-bold text-slate-200 flex justify-between items-center">
            <span>Registered Federations</span>
            <span className="bg-slate-850 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-850">Total: {federations.length}</span>
          </h4>
          {federations.length === 0 ? (
            <p className="text-slate-500 text-xs italic">No federations created yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {federations.map(f => {
                const dept = departments.find(d => d.id === f.department_id);
                const adminUser = usersList.find(u => u.id === f.admin_id);
                return (
                  <div key={f.id} className="bg-slate-950/60 p-3 rounded border border-slate-900 text-slate-300 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-200">🏅 {f.name}</div>
                      <div className="text-[10px] text-slate-500 mt-1">Supervising Dept: {dept ? dept.name : 'None'}</div>
                      <div className="text-[10px] text-indigo-400 mt-1">Federation Admin: {adminUser ? adminUser.full_name : 'None'}</div>
                    </div>
                    {handleDeleteFederation && (
                      <button
                        onClick={() => handleDeleteFederation(f.id)}
                        className="px-2 py-1 bg-red-900/60 hover:bg-red-800 text-red-200 rounded text-[10px]"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }  if (activeTab === 'users') {
    return (
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-4">
        <h3 className="font-bold text-lg text-slate-200">Manage Registered Users</h3>
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
              {usersList.map(u => (
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
                  <td className="py-2 px-3 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {u.role !== 'super_admin' && (
                        u.is_approved ? (
                          <button
                            onClick={() => handleBlockUser(u.id)}
                            className="w-20 px-2 py-1 bg-amber-950 hover:bg-amber-900 text-amber-200 rounded border border-amber-800/60 text-center cursor-pointer transition duration-150 font-semibold"
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnblockUser(u.id)}
                            className="w-20 px-2 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 rounded border border-emerald-800/60 text-center cursor-pointer transition duration-150 font-semibold"
                          >
                            Unblock
                          </button>
                        )
                      )}
                      {u.role !== 'super_admin' && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="w-20 px-2 py-1 bg-red-950 hover:bg-red-900 text-red-200 rounded border border-red-900/60 text-center cursor-pointer transition duration-150 font-semibold"
                        >
                          Delete
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

  if (activeTab === 'tournaments') {
    return (
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-4">
        <h3 className="font-bold text-lg text-slate-200">Registered Tournaments</h3>
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
                              <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-mono font-bold ${
                                team.status === 'approved' 
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

  if (activeTab === 'matches') {
    const live = matches.filter(m => m.status === 'live');
    const upcoming = matches.filter(m => m.status === 'scheduled');
    const finished = matches.filter(m => m.status === 'completed');
    const cancelled = matches.filter(m => m.status === 'cancelled');

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

  if (activeTab === 'mailbox') {
    return (
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-4">
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
                  <span>{new Date(log.sent_at).toLocaleTimeString()}</span>
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
