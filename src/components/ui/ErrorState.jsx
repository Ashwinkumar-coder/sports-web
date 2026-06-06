import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading this content. Please try again.",
  error,
  retryLabel = "Try Again",
  onRetry,
  className,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 bg-[var(--error-bg)] border border-[var(--error-border)] rounded-2xl max-w-lg mx-auto shadow-md",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.2)] text-[var(--error-text)] mb-5">
        <AlertCircle className="w-7 h-7 stroke-[2]" />
      </div>

      <h3 className="text-lg font-bold font-display text-[var(--text-primary)] leading-tight tracking-tight">
        {title}
      </h3>

      <p className="text-sm text-[var(--text-secondary)] mt-2 mb-4 max-w-sm">
        {error?.message || description}
      </p>

      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry} className="mt-2">
          {retryLabel}
        </Button>
      )}
    </motion.div>
  );
}
