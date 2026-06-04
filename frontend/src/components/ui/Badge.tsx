import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  variant?: 'win' | 'loss' | 'tier' | 'tag' | 'champion-tier';
  color?: string;
  className?: string;
}

export default function Badge({ children, variant, color, className }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold',
        variant === 'win' && 'bg-win-bg text-emerald-400 border border-win/30',
        variant === 'loss' && 'bg-loss-bg text-red-400 border border-loss/30',
        variant === 'tier' && 'bg-surface-hover',
        variant === 'tag' && 'bg-brand-900/50 text-brand-100 border border-brand-500/30',
        variant === 'champion-tier' && 'border font-bold',
        className
      )}
      style={color ? { color, borderColor: `${color}40`, backgroundColor: `${color}15` } : undefined}
    >
      {children}
    </span>
  );
}

export function WinBadge({ win }: { win: boolean }) {
  return (
    <Badge variant={win ? 'win' : 'loss'}>
      {win ? 'Victory' : 'Defeat'}
    </Badge>
  );
}

export function TierBadge({ tier, rank, lp }: { tier: string; rank?: string; lp?: number }) {
  const colors: Record<string, string> = {
    IRON: '#6b7280',
    BRONZE: '#a16207',
    SILVER: '#9ca3af',
    GOLD: '#c89b3c',
    PLATINUM: '#4db8bf',
    EMERALD: '#22c55e',
    DIAMOND: '#576bce',
    MASTER: '#9d48e0',
    GRANDMASTER: '#e84057',
    CHALLENGER: '#f4c874',
  };
  const color = colors[tier] ?? '#6b7280';

  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color }}>
      {tier}
      {rank && !['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(tier) && ` ${rank}`}
      {lp !== undefined && <span className="text-gray-400 font-normal text-xs">({lp} LP)</span>}
    </span>
  );
}
