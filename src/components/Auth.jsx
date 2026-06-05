import { useState } from 'react'

export default function Auth({
  loginForm,
  setLoginForm,
  regForm,
  setRegForm,
  currentScreen,
  setCurrentScreen,
  handleLogin,
  handleRegister,
  handleQuickSeed,
  loading
}) {
  if (currentScreen === 'admin_login') {
    return (
      <div className="glass-panel p-8 rounded-xl max-w-md mx-auto space-y-6 border border-slate-800 shadow-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 border border-sky-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono">
            🛡️ Administrative Control Portal
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Admin Sign In</h1>
          <p className="text-slate-500 text-xs">Access department approvals, federation structures, and matches scheduler controls.</p>
        </div>

        <form onSubmit={(e) => handleLogin(e, 'admin')} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Admin Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. superadmin@sports.com"
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
            {loading ? 'Authenticating Admin...' : 'Enter Admin Panel'}
          </button>
        </form>

        <div className="border-t border-slate-800 pt-4 text-center">
          <button
            onClick={() => {
              setLoginForm({ email: '', password: '' });
              setCurrentScreen('standard_login');
            }}
            className="text-sports-cyan hover:underline text-xs font-semibold cursor-pointer"
          >
            🏏 Return to Standard User Portal
          </button>
        </div>
      </div>
    )
  }

  if (currentScreen === 'register') {
    return (
      <div className="glass-panel p-8 rounded-xl max-w-md mx-auto space-y-6 border border-slate-800 shadow-xl">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Create Standard Account</h1>
          <p className="text-slate-500 text-xs">Join active cricket tournaments as a player, coach, scorer, or sponsor.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Full Name</label>
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
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email Address</label>
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
            </select>
          </div>

          <button type="submit" disabled={loading} className="w-full py-2.5 rounded btn-primary cursor-pointer text-slate-950 font-bold">
            {loading ? 'Registering...' : 'Register Profile'}
          </button>
        </form>

        <div className="border-t border-slate-800 pt-4 text-center">
          <button
            onClick={() => setCurrentScreen('standard_login')}
            className="text-sports-cyan hover:underline text-xs font-semibold cursor-pointer"
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>
    )
  }

  // Default: standard_login (Standard User Portal)
  return (
    <div className="glass-panel p-8 rounded-xl max-w-md mx-auto space-y-6 border border-slate-800 shadow-xl">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">Cricket Portal Sign In</h1>
        <p className="text-slate-500 text-xs">Sign in to manage team setups, schedule cricket matches, input scores, and review analytical rankings.</p>
      </div>

      <form onSubmit={(e) => handleLogin(e, 'standard')} className="space-y-4">
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
          {loading ? 'Accessing Dashboard...' : 'Access Dashboard'}
        </button>
      </form>

      <div className="border-t border-slate-800 pt-4 flex flex-col gap-3.5 text-center">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500">Need a standard account?</span>
          <button
            onClick={() => setCurrentScreen('register')}
            className="text-sports-cyan hover:underline font-semibold cursor-pointer"
          >
            Create Account
          </button>
        </div>

        <button
          onClick={() => {
            setLoginForm({ email: '', password: '' });
            setCurrentScreen('admin_login');
          }}
          className="w-full py-2 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
        >
          🛡️ Access Administrator Portal
        </button>
      </div>

      <div className="border-t border-slate-800 pt-4 flex flex-col items-center gap-3">
        <span className="text-slate-500 text-[10px]">For quick evaluation of all role dashboards:</span>
        <button
          type="button"
          onClick={handleQuickSeed}
          className="bg-sports-cyan/10 hover:bg-sports-cyan/20 border border-sports-cyan/35 text-sports-cyan text-[10px] font-semibold px-4 py-1.5 rounded transition cursor-pointer uppercase tracking-wider"
        >
          ⚡ Run Database Quick Seed
        </button>
      </div>
    </div>
  )
}
