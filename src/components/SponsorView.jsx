export default function SponsorView({
  dashboardData,
  tournaments,
  sponsorAmount,
  setSponsorAmount,
  handleSponsorTournament
}) {
  return (
    <div className="space-y-6">
      {/* Aggregates */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex items-center justify-between">
        <div>
          <div className="text-slate-400 text-sm">Total Sponsorship Contributed</div>
          <div className="text-3xl font-black text-emerald-400">${dashboardData.total_sponsored.toFixed(2)}</div>
        </div>
        <svg className="w-10 h-10 text-emerald-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>

      {/* Sponsorship history */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-lg space-y-3">
        <h3 className="font-semibold text-slate-200">Your Sponsorship Pledges</h3>
        {dashboardData.sponsorships.length === 0 ? (
          <p className="text-slate-500 text-sm italic">You have not sponsored any tournament yet.</p>
        ) : (
          <div className="space-y-2">
            {dashboardData.sponsorships.map(s => (
              <div key={s.id} className="bg-slate-950 p-3 rounded border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-300">{s.tournament_name}</span>
                  <span className="block text-[10px] text-slate-500 uppercase font-mono">{s.tournament_status}</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">+ ${s.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sponsor Tournaments list */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-4">
        <h3 className="font-bold text-lg text-slate-200">Sponsor Tournaments</h3>
        <p className="text-slate-400 text-sm">Select an active tournament to provide financial sponsorships.</p>
        
        <div className="flex gap-2 items-center mb-3">
          <label className="text-xs text-slate-400">Pledge Amount ($):</label>
          <input
            type="number"
            className="w-24 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm text-slate-100 font-mono"
            value={sponsorAmount}
            onChange={(e) => setSponsorAmount(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tournaments.filter(t => t.is_approved).map(t => (
            <div key={t.id} className="bg-slate-950 p-4 rounded border border-slate-800 flex flex-col justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-slate-300">{t.name}</div>
                <div className="text-slate-500 mt-1">Status: {t.status}</div>
              </div>
              <button
                onClick={() => handleSponsorTournament(t.id)}
                className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 py-1.5 rounded cursor-pointer font-bold uppercase transition text-[10px]"
              >
                Fund Tournament
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
