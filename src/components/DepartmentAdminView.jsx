export default function DepartmentAdminView({
  activeTab,
  newFed,
  setNewFed,
  handleCreateFederation,
  usersList,
  pendingUsers,
  handleApproveUser,
  pendingTournaments,
  handleApproveTournament
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

  return null;
}
