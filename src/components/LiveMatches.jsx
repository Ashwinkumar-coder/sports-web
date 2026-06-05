export default function LiveMatches({ matches }) {
  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 glass-panel space-y-4">
      <h3 className="font-bold text-slate-200 flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></span>
        Live & Scheduled Matches
      </h3>
      
      {matches.length === 0 ? (
        <p className="text-slate-500 text-xs italic">No matches scheduled at the moment.</p>
      ) : (
        <div className="space-y-3">
          {matches.map(m => (
            <div key={m.id} className="bg-slate-900/60 border border-slate-800 p-3 rounded text-xs space-y-2">
              <div className="flex justify-between items-center text-[10px] uppercase font-mono">
                <span className="text-slate-500">{m.tournament.name}</span>
                <span className={`px-2 py-0.5 rounded font-bold ${m.status === 'completed' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900' : m.status === 'live' ? 'bg-rose-950/60 text-rose-400 border border-rose-900 animate-pulse' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                  {m.status}
                </span>
              </div>

              <div className="font-semibold text-slate-200 flex justify-between">
                <span>{m.team_a.name}</span>
                <span className="font-mono">{m.team_a_runs}/{m.team_a_wickets} <span className="text-slate-500 text-[10px]">({m.team_a_overs} ov)</span></span>
              </div>

              <div className="font-semibold text-slate-200 flex justify-between">
                <span>{m.team_b.name}</span>
                <span className="font-mono">{m.team_b_runs}/{m.team_b_wickets} <span className="text-slate-500 text-[10px]">({m.team_b_overs} ov)</span></span>
              </div>

              {m.status === 'completed' && m.winner && (
                <div className="text-[10px] text-emerald-400 font-bold border-t border-slate-800 pt-1">
                  🏆 Winner: {m.winner.name}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
