export default function DepartmentAdminView({
  newFed,
  setNewFed,
  handleCreateFederation,
  usersList,
  pendingUsers,
  handleApproveUser,
  pendingTournaments,
  handleApproveTournament
}) {
  return (
    <div className="space-y-6">
      {/* Federation Creation Form */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-lg space-y-4">
        <h3 className="font-bold text-lg text-slate-200">Create a Federation</h3>
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
          <div>
            <label className="block text-slate-500 mb-1">Assign Admin (Federation Admin Role)</label>
            <select
              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none"
              value={newFed.admin_id}
              onChange={(e) => setNewFed({ ...newFed, admin_id: e.target.value })}
              required
            >
              <option value="">-- Choose Admin --</option>
              {usersList.filter(u => u.role === 'federation_admin').map(admin => (
                <option key={admin.id} value={admin.id}>{admin.full_name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full py-1.5 rounded bg-sports-cyan text-slate-950 font-bold uppercase cursor-pointer">
              Create Federation
            </button>
          </div>
        </form>
      </div>

      {/* Approvals Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  )
}
