import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export function EmptyState({
  title = "No data found",
  description = "There is nothing to display here at the moment.",
  icon: Icon,
  actionLabel,
  onAction,
  className,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl shadow-[var(--shadow-card)] max-w-lg mx-auto",
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--bg-sidebar-active)] border border-[var(--border-navbar)] text-[var(--accent)] mb-6">
          <Icon className="w-8 h-8 stroke-[1.75]" />
        </div>
      )}

      <h3 className="text-xl font-bold font-display text-[var(--text-primary)] leading-tight tracking-tight">
        {title}
      </h3>
      
      <p className="text-sm text-[var(--text-secondary)] mt-2 mb-6 max-w-sm">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
