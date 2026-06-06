export default function FederationAdminView({
  activeTab,
  newTourney,
  setNewTourney,
  handleCreateTournament,
  newMatch,
  setNewMatch,
  handleScheduleMatch,
  tournaments,
  usersList = [],
  teamsListForSelectedMatchTourney,
  pendingTeams = [],
  pendingSponsorships = [],
  pendingScorers = [],
  handleApproveTeam,
  handleApproveSponsorship,
  handleApproveScorer,
  matches = []
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
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${t.is_approved
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
          <form onSubmit={handleCreateTournament} className="space-y-4 text-xs max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Tournament Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Cricket Cup"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sports-cyan"
                  value={newTourney.name}
                  onChange={(e) => setNewTourney({ ...newTourney, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Entry Fee ($)</label>
                <input
                  type="number"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-sports-cyan"
                  value={newTourney.fee}
                  onChange={(e) => setNewTourney({ ...newTourney, fee: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Team Entries Limit</label>
                <input
                  type="number"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-sports-cyan"
                  value={newTourney.number_of_entry}
                  onChange={(e) => setNewTourney({ ...newTourney, number_of_entry: parseInt(e.target.value) || 4 })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Players/Team (POC Default 5)</label>
                <input
                  type="number"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-sports-cyan"
                  value={newTourney.maximum_player_count}
                  onChange={(e) => setNewTourney({ ...newTourney, maximum_player_count: parseInt(e.target.value) || 5 })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Squad Size Max</label>
                <input
                  type="number"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-sports-cyan"
                  value={newTourney.team_limits}
                  onChange={(e) => setNewTourney({ ...newTourney, team_limits: parseInt(e.target.value) || 5 })}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" className="px-6 py-2 rounded bg-sports-cyan text-slate-950 font-bold uppercase cursor-pointer hover:bg-cyan-400 transition">
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
          <form onSubmit={handleScheduleMatch} className="space-y-4 text-xs max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Select Tournament</label>
                <select
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-sports-cyan"
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
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Assign Official Scorer</label>
                <select
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-sports-cyan"
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
            </div>

            {newMatch.tournament_id && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded border border-slate-900">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Team A (Home)</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-sports-cyan"
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
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Team B (Away)</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-sports-cyan"
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
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button type="submit" className="px-6 py-2 rounded bg-sports-cyan text-slate-950 font-bold uppercase cursor-pointer hover:bg-cyan-400 transition">
                Schedule Match
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (activeTab === 'approvals') {
    return (
      <div className="space-y-6">
        {/* Approve Team Registrations */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
          <h3 className="font-bold text-slate-200">Pending Team Registrations</h3>
          {pendingTeams.length === 0 ? (
            <p className="text-slate-500 text-xs italic">No team registrations pending federation approval.</p>
          ) : (
            <div className="space-y-2 text-xs">
              {pendingTeams.map(team => (
                <div key={team.id} className="bg-slate-950 p-3 rounded border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-300">{team.name}</span>
                    <span className="block text-[10px] text-slate-500">Coach: {team.coach ? team.coach.full_name : 'N/A'}</span>
                  </div>
                  <button
                    onClick={() => handleApproveTeam(team.id)}
                    className="bg-emerald-950 border border-emerald-800 text-emerald-400 px-3 py-1 rounded font-bold cursor-pointer"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approve Sponsorship Pledges */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
          <h3 className="font-bold text-slate-200">Pending Sponsor Pledges</h3>
          {pendingSponsorships.length === 0 ? (
            <p className="text-slate-500 text-xs italic">No sponsor pledges pending federation approval.</p>
          ) : (
            <div className="space-y-2 text-xs">
              {pendingSponsorships.map(s => (
                <div key={s.id} className="bg-slate-950 p-3 rounded border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-300">Sponsor: {s.sponsor.full_name}</span>
                    <span className="block text-[10px] text-emerald-400 font-semibold mt-0.5">Amount: ${s.amount}</span>
                  </div>
                  <button
                    onClick={() => handleApproveSponsorship(s.id)}
                    className="bg-emerald-950 border border-emerald-800 text-emerald-400 px-3 py-1 rounded font-bold cursor-pointer"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approve Scorer Applications */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
          <h3 className="font-bold text-slate-200">Pending Scorer Applications</h3>
          {pendingScorers.length === 0 ? (
            <p className="text-slate-500 text-xs italic">No scorer applications pending federation approval.</p>
          ) : (
            <div className="space-y-2 text-xs">
              {pendingScorers.map(app => (
                <div key={app.id} className="bg-slate-950 p-3 rounded border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-300">{app.scorer.full_name}</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Tournament: {app.tournament.name}</span>
                  </div>
                  <button
                    onClick={() => handleApproveScorer(app.id)}
                    className="bg-emerald-950 border border-emerald-800 text-emerald-400 px-3 py-1 rounded font-bold cursor-pointer"
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
                  <div className="font-bold text-slate-100 flex justify-between">
                    <span>{m.team_a.name} vs {m.team_b.name}</span>
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
                <div key={m.id} className="bg-slate-950/60 p-4 rounded border border-slate-850 space-y-1">
                  <div className="font-semibold text-slate-100">{m.team_a.name} vs {m.team_b.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Tournament: {m.tournament.name}</div>
                  <div className="text-[10px] text-sports-cyan font-bold uppercase tracking-wider font-mono">Status: Scheduled</div>
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
                  <div key={m.id} className="bg-slate-950/60 p-4 rounded border border-slate-850 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <div className="font-semibold text-slate-100">{m.team_a.name} vs {m.team_b.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Tournament: {m.tournament.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Scores: {m.team_a.name} ({m.team_a_runs}/{m.team_a_wickets}) | {m.team_b.name} ({m.team_b_runs}/{m.team_b_wickets})
                      </div>
                    </div>
                    <div className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider">
                      🏆 Winner: {winnerName}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cancelled Matches */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
          <h3 className="font-bold text-slate-400 text-sm">Cancelled Matches ({cancelled.length})</h3>
          {cancelled.length === 0 ? (
            <p className="text-slate-500 italic">No cancelled matches.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cancelled.map(m => (
                <div key={m.id} className="bg-slate-950/60 p-4 rounded border border-slate-900/80 space-y-1">
                  <div className="font-semibold text-slate-400 line-through">{m.team_a.name} vs {m.team_b.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Tournament: {m.tournament.name}</div>
                  <div className="text-[10px] text-red-400 font-mono font-bold uppercase tracking-wider">Cancelled</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
