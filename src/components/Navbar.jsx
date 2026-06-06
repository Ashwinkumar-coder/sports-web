// src/components/Navbar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { Button } from './ui/Button';

export default function Navbar({ user, logout, theme, onToggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <header className="bg-[var(--bg-navbar)] backdrop-blur-lg border-b border-[var(--border-navbar)] shadow-[var(--shadow-navbar)] sticky top-0 z-50 w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        
        {/* ── Logo ─────────────────────────────── */}
        <div className="flex items-center gap-3 select-none">
          <div className="w-9 h-9 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] rounded-xl flex items-center justify-center shadow-[0_0_14px_var(--accent-glow)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
          <span className="text-lg font-black tracking-wider uppercase text-[var(--text-primary)]">
            Sports<span className="text-[var(--accent-text)] font-extrabold">Cricket</span>
          </span>
        </div>

        {/* ── Right side ───────────────────────── */}
        <div className="flex items-center gap-4">
          


          {/* User Info + Sign Out */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-[var(--text-primary)] leading-tight">
                  {user.full_name}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-text)]">
                  {user.role.replace(/_/g, ' ')}
                </div>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={logout}
                icon={LogOut}
                className="font-bold py-1.5 px-3 rounded-lg"
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
