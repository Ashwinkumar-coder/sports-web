import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function Badge({
  children,
  className,
  variant = 'primary', // 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
  glow = false,
  oscillate = false,
  ...props
}) {
  const baseStyles = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200";

  const variants = {
    primary: "bg-[var(--bg-sidebar-active)] border-[var(--border-navbar)] text-[var(--accent-text)]",
    success: "bg-[var(--success-bg)] border-[var(--success-border)] text-[var(--success-text)]",
    warning: "bg-[var(--success-bg)] border-[var(--success-border)] text-[var(--accent-text)]",
    danger: "bg-[var(--error-bg)] border-[var(--error-border)] text-[var(--error-text)]",
    neutral: "bg-[var(--bg-input)] border-[var(--border-default)] text-[var(--text-secondary)]"
  };

  const dotColors = {
    primary: "bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]",
    success: "bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]",
    warning: "bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]",
    danger: "bg-[var(--text-secondary)]",
    neutral: "bg-[var(--text-secondary)]"
  };

  const BadgeWrapper = oscillate ? motion.span : 'span';

  return (
    <BadgeWrapper
      animate={oscillate ? { opacity: [0.75, 1, 0.75] } : undefined}
      transition={oscillate ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : undefined}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {glow && (
        <span className="relative flex h-1.5 w-1.5">
          <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping", dotColors[variant])}></span>
          <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", dotColors[variant])}></span>
        </span>
      )}
      {children}
    </BadgeWrapper>
  );
}
