export default function SuperAdminView({
  newDeptName,
  setNewDeptName,
  handleCreateDept,
  departments,
  federations
}) {
  return (
    <div className="space-y-6">
      {/* Create Department */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-lg space-y-4">
        <h3 className="font-bold text-lg text-slate-200">Create a Department</h3>
        <p className="text-slate-400 text-sm">Departments represent high-level organizational bodies that oversee federations and approve actions.</p>
        <form onSubmit={handleCreateDept} className="flex gap-3 text-xs max-w-lg">
          <input
            type="text"
            required
            placeholder="e.g. National Cricket Council"
            className="flex-1 bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none"
            value={newDeptName}
            onChange={(e) => setNewDeptName(e.target.value)}
          />
          <button type="submit" className="px-4 py-1.5 rounded bg-sports-cyan text-slate-950 font-bold uppercase cursor-pointer">
            Add Department
          </button>
        </form>
      </div>

      {/* List of Departments & Federations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
          <h4 className="font-bold text-slate-200">Active Departments</h4>
          {departments.length === 0 ? (
            <p className="text-slate-500 text-xs italic">No departments created yet.</p>
          ) : (
            <div className="space-y-1 font-mono text-xs">
              {departments.map(d => (
                <div key={d.id} className="bg-slate-950/60 p-2 rounded border border-slate-900 text-slate-300">
                  🏛️ {d.name} <span className="text-slate-500">(ID: {d.id})</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
          <h4 className="font-bold text-slate-200">Registered Federations</h4>
          {federations.length === 0 ? (
            <p className="text-slate-500 text-xs italic">No federations created yet.</p>
          ) : (
            <div className="space-y-1 font-mono text-xs">
              {federations.map(f => (
                <div key={f.id} className="bg-slate-950/60 p-2 rounded border border-slate-900 text-slate-300">
                  🏅 {f.name} <span className="text-slate-500">(Dept ID: {f.department_id})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
