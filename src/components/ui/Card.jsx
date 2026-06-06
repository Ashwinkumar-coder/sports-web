import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function Card({
  children,
  className,
  hoverable = true,
  accent = null, // 'top' | 'left' | null
  onClick,
  ...props
}) {
  const isInteractive = hoverable || onClick;

  const CardWrapper = onClick ? motion.button : motion.div;

  return (
    <CardWrapper
      onClick={onClick}
      whileHover={isInteractive ? { y: -4, boxShadow: '0 12px 24px -10px rgba(212, 175, 55, 0.25)' } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={cn(
        // Colors & backgrounds adapt to theme variables dynamically
        "relative text-left bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 shadow-[var(--shadow-card)] overflow-hidden transition-colors duration-300",
        isInteractive && "cursor-pointer hover:border-[var(--border-card-hover)] hover:bg-[var(--bg-card-hover)]",
        accent === 'top' && "before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-[var(--accent)]",
        accent === 'left' && "before:absolute before:top-0 before:bottom-0 before:left-0 before:width-[3px] before:bg-[var(--accent)]",
        onClick && "w-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-page)]",
        className
      )}
      {...props}
    >
      {/* Premium subtle glow overlay */}
      {isInteractive && (
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-[rgba(212,175,55,0.02)] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-350" />
      )}
      <div className="relative z-10">{children}</div>
    </CardWrapper>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn("flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-default)]", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn("text-lg font-bold font-display text-[var(--text-primary)] leading-tight tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn("text-sm text-[var(--text-secondary)] mt-1", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn("text-[var(--text-primary)] text-sm leading-relaxed", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn("flex items-center justify-between mt-6 pt-4 border-t border-[var(--border-default)] text-xs text-[var(--text-secondary)]", className)} {...props}>
      {children}
    </div>
  );
}
