export default function SuperAdminView({
  activeTab,
  newDeptName,
  setNewDeptName,
  handleCreateDept,
  departments,
  federations,
  newDeptAdmin,
  setNewDeptAdmin,
  handleCreateDeptAdmin,
  loading,
  usersList = []
}) {
  const deptAdmins = usersList.filter(u => u.role === 'department_admin');

  if (activeTab === 'overview') {
    return (
      <div className="space-y-6">
        {/* Metric Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg flex flex-col justify-center">
            <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Total Departments</span>
            <span className="text-3xl font-black text-sports-cyan mt-1">{departments.length}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg flex flex-col justify-center">
            <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Total Federations</span>
            <span className="text-3xl font-black text-indigo-400 mt-1">{federations.length}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg flex flex-col justify-center">
            <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Department Admins</span>
            <span className="text-3xl font-black text-emerald-400 mt-1">{deptAdmins.length}</span>
          </div>
        </div>

        {/* Quick Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
            <h4 className="font-bold text-slate-200">Active Departments</h4>
            {departments.length === 0 ? (
              <p className="text-slate-500 text-xs italic">No departments created yet.</p>
            ) : (
              <div className="space-y-1 font-mono text-xs">
                {departments.slice(0, 5).map(d => (
                  <div key={d.id} className="bg-slate-950/60 p-2 rounded border border-slate-900 text-slate-300">
                    🏛️ {d.name} <span className="text-slate-500">(ID: {d.id})</span>
                  </div>
                ))}
                {departments.length > 5 && (
                  <div className="text-slate-500 text-[10px] text-right italic">+ {departments.length - 5} more departments</div>
                )}
              </div>
            )}
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
            <h4 className="font-bold text-slate-200">Registered Federations</h4>
            {federations.length === 0 ? (
              <p className="text-slate-500 text-xs italic">No federations created yet.</p>
            ) : (
              <div className="space-y-1 font-mono text-xs">
                {federations.slice(0, 5).map(f => (
                  <div key={f.id} className="bg-slate-950/60 p-2 rounded border border-slate-900 text-slate-300">
                    🏅 {f.name} <span className="text-slate-500">(Dept ID: {f.department_id})</span>
                  </div>
                ))}
                {federations.length > 5 && (
                  <div className="text-slate-500 text-[10px] text-right italic">+ {federations.length - 5} more federations</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'departments') {
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

        {/* List of Departments */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
          <h4 className="font-bold text-slate-200 flex justify-between items-center">
            <span>Active Departments</span>
            <span className="bg-sports-cyan/10 text-sports-cyan text-[10px] font-mono px-2 py-0.5 rounded border border-sports-cyan/30">Total: {departments.length}</span>
          </h4>
          {departments.length === 0 ? (
            <p className="text-slate-500 text-xs italic">No departments created yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {departments.map(d => (
                <div key={d.id} className="bg-slate-950/60 p-3 rounded border border-slate-900 text-slate-300">
                  <div className="font-bold">🏛️ {d.name}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Department ID: {d.id}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'admins') {
    return (
      <div className="space-y-6">
        {/* Create Department Admin */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-lg space-y-4">
          <h3 className="font-bold text-lg text-slate-200">Create a Department Admin</h3>
          <p className="text-slate-400 text-sm">Create and assign an administrator to manage a specific department's approvals and federations.</p>
          <form onSubmit={handleCreateDeptAdmin} autoComplete="off" className="space-y-4 text-xs max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none"
                  value={newDeptAdmin.full_name}
                  onChange={(e) => setNewDeptAdmin({ ...newDeptAdmin, full_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  autoComplete="off"
                  placeholder="e.g. admin@dept.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
                  value={newDeptAdmin.email}
                  onChange={(e) => setNewDeptAdmin({ ...newDeptAdmin, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none"
                  value={newDeptAdmin.password}
                  onChange={(e) => setNewDeptAdmin({ ...newDeptAdmin, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Associated Department</label>
                <select
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none"
                  value={newDeptAdmin.department_id}
                  onChange={(e) => setNewDeptAdmin({ ...newDeptAdmin, department_id: e.target.value })}
                >
                  <option value="">-- Choose Department --</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="px-4 py-2.5 rounded bg-sports-cyan text-slate-950 font-bold uppercase cursor-pointer">
              {loading ? 'Creating...' : 'Create Department Admin'}
            </button>
          </form>
        </div>

        {/* List of Department Admins */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
          <h4 className="font-bold text-slate-200 flex justify-between items-center">
            <span>Active Department Admins</span>
            <span className="bg-emerald-950 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-900">Total: {deptAdmins.length}</span>
          </h4>
          {deptAdmins.length === 0 ? (
            <p className="text-slate-500 text-xs italic">No department admins created yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {deptAdmins.map(admin => {
                const dept = departments.find(d => d.id === admin.department_id);
                return (
                  <div key={admin.id} className="bg-slate-950/60 p-3 rounded border border-slate-900 text-slate-300">
                    <div className="font-bold text-slate-200">👤 {admin.full_name}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">{admin.email}</div>
                    <div className="text-[10px] text-sports-cyan mt-1">Managed Dept: {dept ? dept.name : `ID: ${admin.department_id}`}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'federations') {
    return (
      <div className="space-y-6">
        {/* List of Federations */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg space-y-3">
          <h4 className="font-bold text-slate-200 flex justify-between items-center">
            <span>Registered Federations</span>
            <span className="bg-slate-850 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-850">Total: {federations.length}</span>
          </h4>
          {federations.length === 0 ? (
            <p className="text-slate-500 text-xs italic">No federations created yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {federations.map(f => {
                const dept = departments.find(d => d.id === f.department_id);
                const adminUser = usersList.find(u => u.id === f.admin_id);
                return (
                  <div key={f.id} className="bg-slate-950/60 p-3 rounded border border-slate-900 text-slate-300">
                    <div className="font-bold text-slate-200">🏅 {f.name}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Supervising Dept: {dept ? dept.name : `ID: ${f.department_id}`}</div>
                    <div className="text-[10px] text-indigo-400 mt-1">Federation Admin: {adminUser ? adminUser.full_name : `Admin ID: ${f.admin_id}`}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
