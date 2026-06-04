import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className, hover, onClick }: Props) {
  return (
    <div
      className={clsx(
        'rounded-lg bg-surface-card border border-surface-border',
        hover && 'transition-colors duration-150 hover:border-brand-500/50 hover:bg-surface-hover',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function StatItem({ label, value, sub, className }: { label: string; value: ReactNode; sub?: string; className?: string }) {
  return (
    <div className={clsx('flex flex-col', className)}>
      <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      <span className="text-base font-semibold text-white mt-0.5">{value}</span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}

export function ErrorCard({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-loss-bg border border-loss/30 p-6 text-center">
      <p className="text-red-400 font-medium">{message}</p>
    </div>
  );
}
