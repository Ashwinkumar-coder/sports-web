export default function CoachView({ dashboardData }) {
  return (
    <div className="space-y-6">
      {/* Aggregates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg text-center">
          <div className="text-3xl font-black text-sports-cyan">{dashboardData.teams_trained_count}</div>
          <div className="text-xs text-slate-400">Teams Coached / Trained</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg text-center">
          <div className="text-3xl font-black text-purple-400">{dashboardData.players_trained_count}</div>
          <div className="text-xs text-slate-400">Total Players Mentored</div>
        </div>
      </div>

      {/* Leaderboard of coached players */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-lg space-y-4">
        <h3 className="font-bold text-lg text-slate-200">Player Performance Leaderboard</h3>
        <p className="text-slate-400 text-sm">Review performance calculations of your trained players sorted from highest to lowest index score.</p>
        
        {dashboardData.players.length === 0 ? (
          <p className="text-slate-500 text-sm italic">No players are currently registered in your squads.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2">Rank</th>
                  <th className="py-2">Player Name</th>
                  <th className="py-2">Runs</th>
                  <th className="py-2">Balls Faced</th>
                  <th className="py-2">Wickets</th>
                  <th className="py-2">Runs Conc.</th>
                  <th className="py-2 text-right">Index Score</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.players.map((p, idx) => (
                  <tr key={p.player_id} className="border-b border-slate-900 hover:bg-slate-900/20 text-slate-200">
                    <td className="py-3 font-mono text-sports-cyan font-bold">#{idx + 1}</td>
                    <td className="py-3 font-semibold">
                      {p.full_name}
                      <span className="block text-[10px] text-slate-500">{p.teams.join(', ')}</span>
                    </td>
                    <td className="py-3 font-mono">{p.runs_scored}</td>
                    <td className="py-3 font-mono">{p.balls_faced}</td>
                    <td className="py-3 font-mono text-emerald-400">{p.wickets_taken}</td>
                    <td className="py-3 font-mono text-rose-400">{p.runs_conceded}</td>
                    <td className="py-3 text-right font-mono font-bold text-sports-cyan">{p.performance_score.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
