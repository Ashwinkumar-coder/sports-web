import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function LoadingState({
  variant = 'card', // 'card' | 'list' | 'table' | 'detail'
  count = 3,
  className
}) {
  const pulseProps = {
    animate: { opacity: [0.4, 0.7, 0.4] },
    transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
  };

  const CardSkeleton = () => (
    <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-4">
      <motion.div {...pulseProps} className="h-4 bg-[var(--bg-input)] rounded w-1/3" />
      <motion.div {...pulseProps} className="h-8 bg-[var(--bg-input)] rounded w-2/3" />
      <div className="space-y-2 pt-2">
        <motion.div {...pulseProps} className="h-3 bg-[var(--bg-input)] rounded w-full" />
        <motion.div {...pulseProps} className="h-3 bg-[var(--bg-input)] rounded w-5/6" />
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-[var(--border-default)]">
        <motion.div {...pulseProps} className="h-3 bg-[var(--bg-input)] rounded w-1/4" />
        <motion.div {...pulseProps} className="h-8 bg-[var(--bg-input)] rounded-lg w-1/4" />
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="flex items-center space-x-4 p-4 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl">
      <motion.div {...pulseProps} className="h-10 w-10 bg-[var(--bg-input)] rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <motion.div {...pulseProps} className="h-4 bg-[var(--bg-input)] rounded w-1/4" />
        <motion.div {...pulseProps} className="h-3 bg-[var(--bg-input)] rounded w-1/2" />
      </div>
      <motion.div {...pulseProps} className="h-8 w-20 bg-[var(--bg-input)] rounded-lg" />
    </div>
  );

  const TableSkeleton = () => (
    <div className="w-full overflow-hidden bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl">
      <div className="p-4 border-b border-[var(--border-default)] flex gap-4">
        <motion.div {...pulseProps} className="h-4 bg-[var(--bg-input)] rounded w-1/6" />
        <motion.div {...pulseProps} className="h-4 bg-[var(--bg-input)] rounded w-1/4" />
        <motion.div {...pulseProps} className="h-4 bg-[var(--bg-input)] rounded w-1/4" />
        <motion.div {...pulseProps} className="h-4 bg-[var(--bg-input)] rounded w-1/6" />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 border-b border-[var(--border-default)] last:border-b-0 flex gap-4">
          <motion.div {...pulseProps} className="h-3 bg-[var(--bg-input)] rounded w-1/6" />
          <motion.div {...pulseProps} className="h-3 bg-[var(--bg-input)] rounded w-1/4" />
          <motion.div {...pulseProps} className="h-3 bg-[var(--bg-input)] rounded w-1/4" />
          <motion.div {...pulseProps} className="h-3 bg-[var(--bg-input)] rounded w-1/6" />
        </div>
      ))}
    </div>
  );

  const DetailSkeleton = () => (
    <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-8 space-y-6">
      <div className="flex items-center space-x-6">
        <motion.div {...pulseProps} className="h-20 w-20 bg-[var(--bg-input)] rounded-full" />
        <div className="flex-1 space-y-3">
          <motion.div {...pulseProps} className="h-6 bg-[var(--bg-input)] rounded w-1/3" />
          <motion.div {...pulseProps} className="h-4 bg-[var(--bg-input)] rounded w-1/4" />
        </div>
      </div>
      <hr className="border-[var(--border-default)]" />
      <div className="space-y-4">
        <motion.div {...pulseProps} className="h-4 bg-[var(--bg-input)] rounded w-full" />
        <motion.div {...pulseProps} className="h-4 bg-[var(--bg-input)] rounded w-5/6" />
        <motion.div {...pulseProps} className="h-4 bg-[var(--bg-input)] rounded w-4/5" />
      </div>
    </div>
  );

  const renderSkeletons = () => {
    switch (variant) {
      case 'list':
        return (
          <div className={cn("space-y-3", className)}>
            {Array.from({ length: count }).map((_, i) => <ListSkeleton key={i} />)}
          </div>
        );
      case 'table':
        return <TableSkeleton className={className} />;
      case 'detail':
        return <DetailSkeleton className={className} />;
      case 'card':
      default:
        return (
          <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
            {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        );
    }
  };

  return renderSkeletons();
}
