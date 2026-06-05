import { useState } from 'react'

export default function Auth({
  loginForm,
  setLoginForm,
  regForm,
  setRegForm,
  authMode,
  setAuthMode,
  handleLogin,
  handleRegister,
  handleQuickSeed,
  loading,
  departments,
  federations
}) {
  return (
    <div className="glass-panel p-8 rounded-xl max-w-md mx-auto space-y-6 border border-slate-800">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-100">Welcome</h1>
        <p className="text-slate-400 text-sm">Sign in to manage team setups, schedule cricket matches, input scores, and review analytical rankings.</p>
      </div>

      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setAuthMode('login')}
          className={`flex-1 pb-3 text-center font-semibold cursor-pointer ${authMode === 'login' ? 'text-sports-cyan border-b-2 border-sports-cyan' : 'text-slate-500'}`}
        >
          Log In
        </button>
        <button
          onClick={() => setAuthMode('register')}
          className={`flex-1 pb-3 text-center font-semibold cursor-pointer ${authMode === 'register' ? 'text-sports-cyan border-b-2 border-sports-cyan' : 'text-slate-500'}`}
        >
          Create Account
        </button>
      </div>

      {authMode === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email address</label>
            <input
              type="email"
              required
              placeholder="e.g. player1@sports.com"
              className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sports-cyan font-mono"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sports-cyan"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 rounded btn-primary cursor-pointer text-slate-950 font-bold">
            {loading ? 'Processing...' : 'Access Dashboard'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Full name</label>
            <input
              type="text"
              required
              placeholder="Virat Kohli"
              className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sports-cyan"
              value={regForm.full_name}
              onChange={(e) => setRegForm({ ...regForm, full_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email address</label>
            <input
              type="email"
              required
              placeholder="vkohli@sports.com"
              className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sports-cyan font-mono"
              value={regForm.email}
              onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sports-cyan"
              value={regForm.password}
              onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Select System Role</label>
            <select
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-sports-cyan"
              value={regForm.role}
              onChange={(e) => setRegForm({ ...regForm, role: e.target.value })}
            >
              <option value="player">Player</option>
              <option value="coach">Coach</option>
              <option value="sponsor">Sponsor</option>
              <option value="scorer">Scorer (Umpire)</option>
              <option value="department_admin">Department Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          {regForm.role === 'department_admin' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Link to Department</label>
              <select
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none"
                value={regForm.department_id}
                onChange={(e) => setRegForm({ ...regForm, department_id: e.target.value })}
                required
              >
                <option value="">-- Select Department --</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          )}

          {regForm.role === 'federation_admin' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Link to Federation</label>
              <select
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none"
                value={regForm.federation_id}
                onChange={(e) => setRegForm({ ...regForm, federation_id: e.target.value })}
                required
              >
                <option value="">-- Select Federation --</option>
                {federations.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-2.5 rounded btn-primary cursor-pointer text-slate-950 font-bold">
            {loading ? 'Processing...' : 'Register Profile'}
          </button>
        </form>
      )}

      <div className="border-t border-slate-800 pt-4 flex flex-col items-center gap-3">
        <span className="text-slate-500 text-xs">For quick evaluation of all role dashboards:</span>
        <button
          type="button"
          onClick={handleQuickSeed}
          className="bg-sports-cyan/10 hover:bg-sports-cyan/20 border border-sports-cyan/35 text-sports-cyan text-xs font-semibold px-4 py-2 rounded transition cursor-pointer uppercase tracking-wider"
        >
          ⚡ Run Database Quick Seed
        </button>
      </div>
    </div>
  )
}
