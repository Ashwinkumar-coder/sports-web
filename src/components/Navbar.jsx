// src/components/Navbar.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Bell, Menu, X, Mail } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

export default function Navbar({ user, logout, theme, onToggleTheme, notificationLogs = [], onToggleSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-[var(--bg-navbar)] backdrop-blur-lg border-b border-[var(--border-navbar)] shadow-[var(--shadow-navbar)] sticky top-0 z-50 w-full transition-all duration-300">
      <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* ── Left side: Hamburger Toggle + Logo ── */}
        <div className="flex items-center gap-3 select-none">
          {user && (
            <button
              onClick={onToggleSidebar}
              className="p-1.5 hover:bg-[var(--bg-sidebar-hover)] rounded-lg text-[var(--text-primary)] md:hidden transition-colors"
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] rounded-xl flex items-center justify-center shadow-[0_0_14px_var(--accent-glow)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
            <span className="text-base sm:text-lg font-black tracking-wider uppercase text-[var(--text-primary)]">
              Sports<span className="text-[var(--accent-text)] font-extrabold">Cricket</span>
            </span>
          </div>
        </div>

        {/* ── Right side ───────────────────────── */}
        <div className="flex items-center gap-3 sm:gap-4 relative">
          
          {/* Notification Bell Icon */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-[var(--bg-sidebar-hover)] rounded-xl text-[var(--text-primary)] transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {notificationLogs.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-[9px] font-bold text-white rounded-full flex items-center justify-center">
                    {notificationLogs.length}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-slate-950 border border-[var(--border-default)] rounded-2xl shadow-2xl p-4 z-50 text-xs flex flex-col gap-2 max-h-96"
                  >
                    <div className="flex justify-between items-center border-b border-[var(--border-default)] pb-2 mb-1">
                      <span className="font-extrabold text-[var(--text-primary)] flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[var(--accent)]" /> Notifications
                      </span>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-slate-500 hover:text-slate-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="overflow-y-auto space-y-2.5 max-h-64 scrollbar-none pr-0.5">
                      {notificationLogs.length === 0 ? (
                        <p className="text-[var(--text-muted)] italic text-center py-6">No new notifications.</p>
                      ) : (
                        notificationLogs.slice(0, 10).map((log) => (
                          <div 
                            key={log.id} 
                            className="bg-[var(--bg-input)] p-2.5 rounded-xl border border-[var(--border-default)] hover:border-[var(--border-card-hover)] transition-all space-y-1"
                          >
                            <div className="flex justify-between text-[9px] font-mono text-[var(--text-secondary)]">
                              <span>To: {log.recipient_email}</span>
                              <span>{new Date(log.sent_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + ' IST'}</span>
                            </div>
                            <div className="font-bold text-[var(--text-primary)] text-[10px]">{log.subject}</div>
                            <p className="text-[9px] text-[var(--text-secondary)] font-mono leading-tight whitespace-pre-wrap truncate line-clamp-2">
                              {log.body}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* User Info + Sign Out */}
          {user && (
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-right hidden md:block">
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
                className="font-bold py-1.5 px-3 rounded-lg text-xs"
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
