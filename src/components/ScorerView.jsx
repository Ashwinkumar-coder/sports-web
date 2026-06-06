export default function ScorerView({
  activeTab,
  dashboardData,
  activeScoringMatch,
  setActiveScoringMatch,
  scoringForm,
  setScoringForm,
  handleUpdateLiveScore,
  openCompletionModal,
  matches,
  handleStartScoring
}) {
  if (activeTab === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* List of assigned matches */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-lg space-y-4">
          <h3 className="font-bold text-lg text-slate-200">Your Assigned Matches</h3>
          <p className="text-slate-400 text-sm">Select an assigned match to record scores and declare final outcomes.</p>
          
          {dashboardData.assigned_matches.length === 0 ? (
            <p className="text-slate-500 text-sm italic">You have no match scoring duties assigned.</p>
          ) : (
            <div className="space-y-3">
              {dashboardData.assigned_matches.map(m => {
                const fullMatch = matches.find(match => match.id === m.id)
                return (
                  <div key={m.id} className="bg-slate-950 p-4 rounded border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-300">{m.team_a_name} vs {m.team_b_name}</div>
                      <div className="text-[10px] text-slate-500 uppercase mt-1">{m.tournament_name}</div>
                      <div className="text-slate-400 font-mono mt-1 text-[10px]">{m.score_summary}</div>
                    </div>
                    
                    {m.status !== 'completed' ? (
                      <button
                        onClick={() => handleStartScoring(fullMatch)}
                        className="bg-sports-cyan text-slate-950 text-[10px] font-bold px-3 py-1.5 rounded uppercase cursor-pointer"
                      >
                        Score Match
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-mono text-[10px] font-bold">COMPLETED</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'live_scoring') {
    if (!activeScoringMatch) {
      return (
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-lg text-center space-y-3">
            <span className="text-3xl">🏏</span>
            <h3 className="font-bold text-slate-200">No Match Selected for Scoring</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              You haven't selected a match to score yet. Please go to the **Matches** tab, find an active match, and click **Score Match** to begin broadcasting live scores.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Active Scoring View */}
        <div className="bg-slate-900 border-2 border-sports-cyan p-6 rounded-xl space-y-6 glass-panel">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-sports-cyan uppercase tracking-widest">LIVE SCORING ENGINE</span>
            <button
              onClick={() => setActiveScoringMatch(null)}
              className="text-slate-500 hover:text-slate-200 text-xs uppercase cursor-pointer"
            >
              Close / Exit scoring
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 text-center">
            {/* Team A */}
            <div className={`p-4 rounded border ${scoringForm.team === 'team_a' ? 'border-sports-cyan bg-sports-cyan/5' : 'border-slate-800'}`}>
              <h4 className="font-bold text-slate-200 text-sm">{activeScoringMatch.team_a.name}</h4>
              <div className="text-3xl font-black text-sports-cyan mt-2">
                {scoringForm.team === 'team_a' ? scoringForm.runs : activeScoringMatch.team_a_runs}
                <span className="text-slate-500"> / </span>
                {scoringForm.team === 'team_a' ? scoringForm.wickets : activeScoringMatch.team_a_wickets}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Overs: {scoringForm.team === 'team_a' ? scoringForm.overs : activeScoringMatch.team_a_overs}
              </div>
            </div>

            {/* Team B */}
            <div className={`p-4 rounded border ${scoringForm.team === 'team_b' ? 'border-sports-cyan bg-sports-cyan/5' : 'border-slate-800'}`}>
              <h4 className="font-bold text-slate-200 text-sm">{activeScoringMatch.team_b.name}</h4>
              <div className="text-3xl font-black text-sports-cyan mt-2">
                {scoringForm.team === 'team_b' ? scoringForm.runs : activeScoringMatch.team_b_runs}
                <span className="text-slate-500"> / </span>
                {scoringForm.team === 'team_b' ? scoringForm.wickets : activeScoringMatch.team_b_wickets}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Overs: {scoringForm.team === 'team_b' ? scoringForm.overs : activeScoringMatch.team_b_overs}
              </div>
            </div>
          </div>

          {/* Adjust scoring Form */}
          <form onSubmit={handleUpdateLiveScore} autoComplete="off" className="bg-slate-950 p-4 rounded border border-slate-800 space-y-4">
            <div className="grid grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Batting Team</label>
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-slate-200"
                  value={scoringForm.team}
                  onChange={(e) => setScoringForm({ ...scoringForm, team: e.target.value })}
                >
                  <option value="team_a">Team A</option>
                  <option value="team_b">Team B</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Runs</label>
                <input
                  type="number"
                  autoComplete="off"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-slate-100 font-mono"
                  value={scoringForm.runs}
                  onChange={(e) => setScoringForm({ ...scoringForm, runs: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Wickets</label>
                <input
                  type="number"
                  max="10"
                  autoComplete="off"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-slate-100 font-mono"
                  value={scoringForm.wickets}
                  onChange={(e) => setScoringForm({ ...scoringForm, wickets: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Overs</label>
                <input
                  type="number"
                  step="0.1"
                  autoComplete="off"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-slate-100 font-mono"
                  value={scoringForm.overs}
                  onChange={(e) => setScoringForm({ ...scoringForm, overs: e.target.value })}
                />
              </div>
            </div>

            {/* Quick scoring buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setScoringForm({ ...scoringForm, runs: parseInt(scoringForm.runs) + 1 })}
                className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold cursor-pointer"
              >
                +1 Run
              </button>
              <button
                type="button"
                onClick={() => setScoringForm({ ...scoringForm, runs: parseInt(scoringForm.runs) + 4 })}
                className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold cursor-pointer"
              >
                +4 Runs
              </button>
              <button
                type="button"
                onClick={() => setScoringForm({ ...scoringForm, runs: parseInt(scoringForm.runs) + 6 })}
                className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold cursor-pointer"
              >
                +6 Runs
              </button>
              <button
                type="button"
                onClick={() => setScoringForm({ ...scoringForm, wickets: Math.min(10, parseInt(scoringForm.wickets) + 1) })}
                className="flex-1 py-1 bg-red-950/40 hover:bg-red-900/40 text-red-400 rounded text-xs font-semibold cursor-pointer"
              >
                Wicket
              </button>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 py-2 bg-sports-cyan text-slate-950 font-bold text-xs uppercase rounded cursor-pointer"
              >
                Broadcast Score
              </button>
              <button
                type="button"
                onClick={() => openCompletionModal(activeScoringMatch)}
                className="flex-1 py-2 bg-purple-950 hover:bg-purple-900 border border-purple-800 text-purple-300 font-bold text-xs uppercase rounded cursor-pointer"
              >
                Declare Match Ended
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
}
