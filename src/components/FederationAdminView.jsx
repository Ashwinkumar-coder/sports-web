export default function FederationAdminView({
  activeTab,
  newTourney,
  setNewTourney,
  handleCreateTournament,
  newMatch,
  setNewMatch,
  handleScheduleMatch,
  tournaments,
  usersList,
  teamsListForSelectedMatchTourney
}) {
  if (activeTab === 'overview') {
    return (
      <div className="space-y-6">
        {/* Active Tournaments Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg flex flex-col justify-center">
            <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Approved Tournaments</span>
            <span className="text-3xl font-black text-sports-cyan mt-1">
              {tournaments.filter(t => t.is_approved).length}
            </span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg flex flex-col justify-center">
            <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Pending Approvals</span>
            <span className="text-3xl font-black text-amber-500 mt-1">
              {tournaments.filter(t => !t.is_approved).length}
            </span>
          </div>
        </div>

        {/* List of Tournaments */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-4">
          <h3 className="font-bold text-slate-200">Active Tournaments</h3>
          {tournaments.length === 0 ? (
            <p className="text-slate-500 text-xs italic">No tournaments created yet.</p>
          ) : (
            <div className="space-y-3">
              {tournaments.map(t => (
                <div key={t.id} className="bg-slate-950 p-4 rounded border border-slate-800 flex justify-between items-center text-xs font-mono">
                  <div>
                    <div className="font-bold text-slate-200 text-sm">{t.name}</div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Fee: ${t.fee} | Entries: {t.teams ? t.teams.length : 0}/{t.number_of_entry} Teams
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    t.is_approved 
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900' 
                      : 'bg-amber-950/60 text-amber-400 border border-amber-900'
                  }`}>
                    {t.is_approved ? 'Approved' : 'Pending Approval'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'create_tournament') {
    return (
      <div className="space-y-6">
        {/* Create Tournament */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-lg space-y-4">
          <h3 className="font-bold text-lg text-slate-200">Create a Cricket Tournament</h3>
          <p className="text-slate-400 text-sm mb-4">Request approval from the Department Admin for a new cricket league tournament.</p>
          <form onSubmit={handleCreateTournament} className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="col-span-2">
              <label className="block text-slate-500 mb-1">Tournament Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Summer Cricket Cup"
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none"
                value={newTourney.name}
                onChange={(e) => setNewTourney({ ...newTourney, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Entry Fee ($)</label>
              <input
                type="number"
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none"
                value={newTourney.fee}
                onChange={(e) => setNewTourney({ ...newTourney, fee: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Team Limits Count</label>
              <input
                type="number"
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none"
                value={newTourney.number_of_entry}
                onChange={(e) => setNewTourney({ ...newTourney, number_of_entry: parseInt(e.target.value) || 4 })}
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Players/Team (POC Default 5)</label>
              <input
                type="number"
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none"
                value={newTourney.maximum_player_count}
                onChange={(e) => setNewTourney({ ...newTourney, maximum_player_count: parseInt(e.target.value) || 5 })}
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Squad Size Max</label>
              <input
                type="number"
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none"
                value={newTourney.team_limits}
                onChange={(e) => setNewTourney({ ...newTourney, team_limits: parseInt(e.target.value) || 5 })}
              />
            </div>
            <div className="col-span-2 flex items-end">
              <button type="submit" className="w-full py-2 rounded bg-sports-cyan text-slate-950 font-bold uppercase cursor-pointer">
                Create Tournament
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (activeTab === 'schedule_matches') {
    return (
      <div className="space-y-6">
        {/* Schedule Matches */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-4">
          <h3 className="font-bold text-lg text-slate-200">Schedule Tournament Matches</h3>
          <p className="text-slate-400 text-sm mb-4">Pair registered teams and nominate an official scorer to record live match metrics.</p>
          <form onSubmit={handleScheduleMatch} className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 mb-1">Select Tournament</label>
              <select
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none"
                value={newMatch.tournament_id}
                onChange={(e) => setNewMatch({ ...newMatch, tournament_id: e.target.value, team_a_id: '', team_b_id: '' })}
                required
              >
                <option value="">-- Choose Tournament --</option>
                {tournaments.filter(t => t.is_approved && t.status !== 'completed').map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            {newMatch.tournament_id && (
              <>
                <div>
                  <label className="block text-slate-500 mb-1">Team A</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none"
                    value={newMatch.team_a_id}
                    onChange={(e) => setNewMatch({ ...newMatch, team_a_id: e.target.value })}
                    required
                  >
                    <option value="">-- Choose Team A --</option>
                    {teamsListForSelectedMatchTourney(newMatch.tournament_id).map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Team B</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none"
                    value={newMatch.team_b_id}
                    onChange={(e) => setNewMatch({ ...newMatch, team_b_id: e.target.value })}
                    required
                  >
                    <option value="">-- Choose Team B --</option>
                    {teamsListForSelectedMatchTourney(newMatch.tournament_id).map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <div>
              <label className="block text-slate-500 mb-1">Assign Scorer</label>
              <select
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none"
                value={newMatch.scorer_id}
                onChange={(e) => setNewMatch({ ...newMatch, scorer_id: e.target.value })}
                required
              >
                <option value="">-- Choose Scorer --</option>
                {usersList.filter(u => u.role === 'scorer').map(scorer => (
                  <option key={scorer.id} value={scorer.id}>{scorer.full_name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-1 md:col-span-4 flex items-end justify-end mt-2">
              <button type="submit" className="px-6 py-2 rounded bg-sports-cyan text-slate-950 font-bold uppercase cursor-pointer">
                Schedule Match
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
}
