export default function FederationAdminView({
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
  return (
    <div className="space-y-6">
      {/* Create Tournament */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-lg space-y-4">
        <h3 className="font-bold text-lg text-slate-200">Create a Cricket Tournament</h3>
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

      {/* Schedule Matches */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-4">
        <h3 className="font-bold text-lg text-slate-200">Schedule Tournament Matches</h3>
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
  )
}
