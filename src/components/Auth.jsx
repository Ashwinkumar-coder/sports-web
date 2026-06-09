import React from 'react';
import { Shield, Sparkles, UserPlus, LogIn } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

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
  loading,
  isAdminPath
}) {
  if (currentScreen === 'admin_login') {
    return (
      <Card className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-3">
        
          <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Super Admin Sign In</h1>
        </div>

        <form onSubmit={(e) => handleLogin(e, 'admin')} autoComplete="off" className="space-y-4 text-xs">
          {/* Dummy inputs to prevent Chrome autofill */}
          <input type="text" name="chrome-email-prevent" style={{ display: 'none' }} autoComplete="off" />
          <input type="password" name="chrome-password-prevent" style={{ display: 'none' }} autoComplete="new-password" />

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Super Admin Email</label>
            <input
              type="email"
              required
              autoComplete="one-time-code"
              placeholder="e.g. superadmin@sports.com"
              className="w-full rounded-xl px-3 py-2 text-xs font-mono"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Password</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-xl px-3 py-2 text-xs"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
          </div>
          <Button type="submit" isLoading={loading} className="w-full py-2.5 font-bold">
            {loading ? 'Authenticating...' : 'Enter Super Admin Panel'}
          </Button>
        </form>
      </Card>
    );
  }

  if (currentScreen === 'register') {
    return (
      <Card className="max-w-md mx-auto space-y-6 text-center">
        <div className="space-y-3">
          <Badge variant="danger" glow className="py-1 px-3.5 uppercase tracking-wider font-mono">
            🔒 Restricted Access
          </Badge>
          <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Registration Disabled</h1>
          <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
            Self-registration on the web portal is disabled. Players, Coaches, Sponsors, and Scorers are restricted from accessing this platform. If you are an administrator, please contact the Super Admin to set up your account.
          </p>
        </div>

        <div className="border-t border-[var(--border-default)] pt-4 text-center">
          <button
            onClick={() => setCurrentScreen('standard_login')}
            className="text-[var(--accent)] hover:underline text-xs font-semibold cursor-pointer"
          >
            Return to Sign In
          </button>
        </div>
      </Card>
    );
  }

  // Default: standard_login (Standard User Portal)
  return (
    <Card className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-3">
        <Badge variant="primary" glow className="py-1 px-3.5 uppercase tracking-wider font-mono">
          ⚡ Sports Portal Login
        </Badge>
      </div>

      <form onSubmit={(e) => handleLogin(e, 'standard')} autoComplete="off" className="space-y-4 text-xs">
        {/* Dummy inputs to prevent Chrome autofill */}
        <input type="text" name="chrome-email-prevent-std" style={{ display: 'none' }} autoComplete="off" />
        <input type="password" name="chrome-password-prevent-std" style={{ display: 'none' }} autoComplete="new-password" />

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Email address</label>
          <input
            type="email"
            required
            autoComplete="one-time-code"
            placeholder="e.g. player1@sports.com"
            className="w-full rounded-xl px-3 py-2 text-xs font-mono"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Password</label>
          <input
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full rounded-xl px-3 py-2 text-xs"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
          />
        </div>
        <Button type="submit" isLoading={loading} className="w-full py-2.5 font-bold">
          {loading ? 'Accessing...' : 'Access Dashboard'}
        </Button>
      </form>
    </Card>
  );
}
