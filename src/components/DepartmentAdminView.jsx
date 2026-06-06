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
  if (activeTab === 'overview') {
    return (
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg flex flex-col justify-center">
            <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Pending Registrations</span>
            <span className="text-3xl font-black text-amber-400 mt-1">{pendingUsers.length}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg flex flex-col justify-center">
            <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Pending Tournaments</span>
            <span className="text-3xl font-black text-indigo-400 mt-1">{pendingTournaments.length}</span>
          </div>
        </div>

        {/* Quick Summary Guidelines */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
          <h4 className="font-bold text-slate-200">Department Administration Tasks</h4>
          <p className="text-slate-400 text-xs leading-relaxed">
            As a Department Admin, you are responsible for governing the local cricket structure:
          </p>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-2 pl-2">
            <li>Review and approve new Player, Coach, Scorer, and Sponsor accounts.</li>
            <li>Establish Federations and delegate regional administration roles.</li>
            <li>Assess and approve newly proposed cricket tournaments by Federation Admins.</li>
          </ul>
        </div>
      </div>
    );
  }

  if (activeTab === 'create_federation') {
    return (
      <div className="space-y-6">
        {/* Federation Creation Form */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-lg space-y-4">
          <h3 className="font-bold text-lg text-slate-200">Create a Federation</h3>
          <p className="text-slate-400 text-sm mb-4">Establish a new governing branch and assign an approved Federation Admin to manage it.</p>
          <form onSubmit={handleCreateFederation} className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 mb-1">Federation Name</label>
              <input
                type="text"
                required
                placeholder="e.g. State Cricket Association"
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none"
                value={newFed.name}
                onChange={(e) => setNewFed({ ...newFed, name: e.target.value })}
              />
            </div>
            <div className="col-span-3 md:col-span-1">
              <p className="text-slate-500 text-xs mb-1">Create a new Federation Admin</p>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 placeholder-slate-500 mb-1 focus:outline-none"
                value={newFed.new_admin_name || ''}
                onChange={(e) => setNewFed({ ...newFed, new_admin_name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 placeholder-slate-500 mb-1 focus:outline-none"
                value={newFed.new_admin_email || ''}
                onChange={(e) => setNewFed({ ...newFed, new_admin_email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none"
                value={newFed.new_admin_password || ''}
                onChange={(e) => setNewFed({ ...newFed, new_admin_password: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full py-1.5 rounded bg-sports-cyan text-slate-950 font-bold uppercase cursor-pointer">
                Create Federation
              </button>
            </div>
          </form>
        </div>

        {/* Existing Federations */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
          <h4 className="font-bold text-slate-200">Active Federations</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {federations.map(f => {
              const dept = departments.find(d => d.id === f.department_id);
              const adminUser = usersList.find(u => u.id === f.admin_id);
              return (
                <div key={f.id} className="bg-slate-950/60 p-3 rounded border border-slate-900 text-slate-300 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-200">🏅 {f.name}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Supervising Dept: {dept ? dept.name : 'None'}</div>
                    <div className="text-[10px] text-indigo-400 mt-1">Admin: {adminUser ? adminUser.full_name : 'None'}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteFederation(f.id)}
                    className="px-2 py-1 bg-red-900/60 hover:bg-red-800 text-red-200 rounded text-[10px]"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
            {federations.length === 0 && (
              <p className="text-slate-500 italic">No federations created yet.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'approve_users') {
    return (
      <div className="space-y-6">
        {/* User Registrations Approvals */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-4">
          <h3 className="font-bold text-slate-200">Approve User Registrations</h3>
          {pendingUsers.length === 0 ? (
            <p className="text-slate-500 text-xs italic">No registrations currently awaiting approval.</p>
          ) : (
            <div className="space-y-2">
              {pendingUsers.map(u => (
                <div key={u.id} className="bg-slate-950 p-3 rounded border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-300">{u.full_name}</span>
                    <span className="block text-[10px] text-slate-500 uppercase font-mono">{u.role}</span>
                    <span className="block text-[10px] text-slate-500 font-mono">{u.email}</span>
                  </div>
                  <button
                    onClick={() => handleApproveUser(u.id)}
                    className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 text-[10px] px-2.5 py-1 rounded font-bold cursor-pointer"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'approve_tournaments') {
    return (
      <div className="space-y-6">
        {/* Tournament Creation Approvals */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-4">
          <h3 className="font-bold text-slate-200">Approve Federation Tournaments</h3>
          {pendingTournaments.length === 0 ? (
            <p className="text-slate-500 text-xs italic">No tournament requests currently awaiting approval.</p>
          ) : (
            <div className="space-y-2">
              {pendingTournaments.map(t => (
                <div key={t.id} className="bg-slate-950 p-3 rounded border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-300">{t.name}</span>
                    <span className="block text-[10px] text-slate-500">Federation ID: {t.federation_id}</span>
                    <span className="block text-[10px] text-slate-500">Fee: ${t.fee} | Entries: {t.number_of_entry}</span>
                  </div>
                  <button
                    onClick={() => handleApproveTournament(t.id)}
                    className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 text-[10px] px-2.5 py-1 rounded font-bold cursor-pointer"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'users') {
    return (
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-4">
        <h3 className="font-bold text-lg text-slate-200">All Department Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Role</th>
                <th className="py-2 px-3">Status</th>
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
        <h3 className="font-bold text-lg text-slate-200">Tournaments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tournaments.map(t => (
            <div key={t.id} className="bg-slate-950/60 p-4 rounded border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <div className="font-bold text-slate-200 text-sm">🏆 {t.name}</div>
                <div className="text-slate-400 mt-1 capitalize">Status: {t.status.replace('_', ' ')}</div>
                <div className="text-slate-500 mt-0.5">Slots: {t.teams ? t.teams.length : 0} / {t.number_of_entry} Teams</div>
              </div>
              <button
                onClick={() => handleDeleteTournament(t.id)}
                className="px-3 py-1 bg-red-900/60 hover:bg-red-800 text-red-200 rounded font-semibold"
              >
                Delete
              </button>
            </div>
          ))}
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

  return null;
}
