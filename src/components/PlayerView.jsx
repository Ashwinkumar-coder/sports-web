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
      <div className="space-y-6">
        {/* Summary row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-black text-sports-cyan">{dashboardData.matches_played}</div>
            <div className="text-xs text-slate-400">Matches Played</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-black text-emerald-400">{dashboardData.matches_won}</div>
            <div className="text-xs text-slate-400">Matches Won</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-black text-rose-400">{dashboardData.matches_lost}</div>
            <div className="text-xs text-slate-400">Matches Lost</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-black text-purple-400">
              {typeof dashboardData.overall_performance === 'number' 
                ? dashboardData.overall_performance.toFixed(1) 
                : '0.0'}
            </div>
            <div className="text-xs text-slate-400">Performance Index</div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-lg text-center">
            <div className="text-xl font-bold text-slate-200">{dashboardData.total_runs || 0}</div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Runs</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-lg text-center">
            <div className="text-xl font-bold text-slate-200">{dashboardData.total_balls || 0}</div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Balls Faced</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-lg text-center">
            <div className="text-xl font-bold text-emerald-400">{dashboardData.total_wickets || 0}</div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Wickets Taken</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-lg text-center">
            <div className="text-xl font-bold text-rose-400">{dashboardData.total_runs_conceded || 0}</div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Runs Conceded</div>
          </div>
        </div>

        {/* Teams played for */}
        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-lg space-y-3">
          <h3 className="font-semibold text-slate-200">Registered Teams</h3>
          {dashboardData.team_names.length === 0 ? (
            <p className="text-slate-500 text-sm italic">You have not registered for any tournament team yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {dashboardData.team_names.map((name, i) => (
                <span key={i} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-full font-semibold">
                  🏏 {name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'register_team') {
    const openTournaments = tournaments.filter(t => t.is_approved && t.status === 'registration_open');
    return (
      <div className="space-y-6">
        {/* Tournament Registration Action */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-lg space-y-4">
          <h3 className="font-bold text-lg text-slate-200">Register for Approved Tournaments</h3>
          <p className="text-slate-400 text-sm mb-4">Join an active cricket tournament by naming your team squad, selecting a certified Coach, and nominating team players.</p>
          
          {openTournaments.length === 0 ? (
            <p className="text-slate-500 text-sm italic">No open tournaments available for registration at this time.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tournaments list */}
              <div className="space-y-2">
                {openTournaments.map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTournament(t)
                      setNewTeam({ name: '', coach_id: '', player_ids: [] })
                    }}
                    className={`p-3 rounded border cursor-pointer transition ${selectedTournament?.id === t.id ? 'border-sports-cyan bg-sports-cyan/5' : 'border-slate-800 bg-slate-950/40 hover:bg-slate-900/40'}`}
                  >
                    <div className="font-semibold text-slate-200">{t.name}</div>
                    <div className="text-xs text-slate-400 mt-1">Entry fee: ${t.fee} | Team size: {t.maximum_player_count} players</div>
                  </div>
                ))}
              </div>

              {/* Selected registration form */}
              {selectedTournament && (
                <form onSubmit={handleRegisterTeam} className="bg-slate-950/80 p-4 rounded border border-slate-800 space-y-3">
                  <h4 className="text-xs font-black text-sports-cyan uppercase">Signing up for: {selectedTournament.name}</h4>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Enter Team Name"
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Select Coach</label>
                    <select
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-sm text-slate-100 focus:outline-none"
                      value={newTeam.coach_id}
                      onChange={(e) => setNewTeam({ ...newTeam, coach_id: e.target.value })}
                    >
                      <option value="">-- Select Coach --</option>
                      {usersList.filter(u => u.role === 'coach').map(c => (
                        <option key={c.id} value={c.id}>{c.full_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                      Select Teammates (Select {selectedTournament.maximum_player_count - 1} players)
                    </label>
                    <div className="max-h-24 overflow-y-auto border border-slate-800 p-2 rounded space-y-1 bg-slate-900/30">
                      {usersList.filter(u => u.role === 'player' && u.id !== currentUser.id).map(p => (
                        <label key={p.id} className="flex items-center gap-2 text-xs text-slate-300">
                          <input
                            type="checkbox"
                            value={p.id}
                            checked={newTeam.player_ids.includes(p.id.toString())}
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
                    <span className="text-[10px] text-slate-500 font-semibold italic mt-1 block">
                      Selected: {newTeam.player_ids.length} of {selectedTournament.maximum_player_count - 1} required
                    </span>
                  </div>
                  <button type="submit" className="w-full py-1.5 rounded bg-sports-cyan text-slate-950 font-bold text-xs uppercase cursor-pointer">
                    Complete Signup
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
