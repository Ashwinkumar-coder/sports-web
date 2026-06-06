import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export function SuccessState({
  title = "Action Completed Successfully",
  description = "Your request was processed without any issues.",
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 bg-[var(--success-bg)] border border-[var(--success-border)] rounded-2xl max-w-lg mx-auto shadow-md",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.2)] text-[var(--success-text)] mb-6">
        <CheckCircle2 className="w-8 h-8 stroke-[2]" />
      </div>

      <h3 className="text-xl font-bold font-display text-[var(--text-primary)] leading-tight tracking-tight">
        {title}
      </h3>

      <p className="text-sm text-[var(--text-secondary)] mt-2 mb-6 max-w-sm">
        {description}
      </p>

      <div className="flex items-center gap-3">
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="outline" size="sm" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
        
        {actionLabel && onAction && (
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
