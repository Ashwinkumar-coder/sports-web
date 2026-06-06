import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function Button({
  children,
  className,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-page)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const variants = {
    primary: "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] text-[var(--text-inverse)] hover:shadow-[var(--shadow-btn)]",
    secondary: "bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-card-hover)]",
    outline: "bg-transparent border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-card-hover)]",
    danger: "bg-[var(--error-bg)] border border-[var(--error-border)] text-[var(--error-text)] hover:bg-[rgba(239,68,68,0.18)]",
    ghost: "bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5"
  };

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { y: -1, scale: 1.01 } : undefined}
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : undefined}
      disabled={disabled || isLoading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-4 h-4 stroke-[2.25]" />
      ) : null}

      <span>{children}</span>

      {!isLoading && Icon && iconPosition === 'right' ? (
        <Icon className="w-4 h-4 stroke-[2.25]" />
      ) : null}
    </motion.button>
  );
}
