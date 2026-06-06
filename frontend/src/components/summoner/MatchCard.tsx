import { useState } from 'react';
import { clsx } from 'clsx';
import type { MatchParticipant } from '@/types';
import { WinBadge } from '@/components/ui/Badge';
import {
  formatDuration,
  formatKdaLabel,
  formatKda,
  formatRelativeTime,
  formatCs,
  formatNumber,
  getItemImageUrl,
  getKdaColor,
} from '@/utils/formatters';

interface Props {
  participant: MatchParticipant;
}

export default function MatchCard({ participant }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { match, champion, kills, deaths, assists, cs, gold, items, win, lpChange, damage, visionScore, position } = participant;
  const kda = parseFloat(formatKda(kills, deaths, assists));
  const kdaColor = getKdaColor(kda);

  return (
    <div
      className={clsx(
        'rounded-lg border transition-all',
        win
          ? 'bg-win-bg border-win/30 hover:border-win/60'
          : 'bg-loss-bg border-loss/30 hover:border-loss/60'
      )}
    >
      <div
        className="p-3 sm:p-4 cursor-pointer select-none"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={clsx('w-1 self-stretch rounded-full flex-shrink-0', win ? 'bg-win' : 'bg-loss')} />

          <div className="relative h-12 w-12 flex-shrink-0">
            <img
              src={champion.imageUrl}
              alt={champion.name}
              className="h-full w-full rounded-lg object-cover border border-surface-border"
              onError={(e) => { (e.target as HTMLImageElement).src = `https://ddragon.leagueoflegends.com/cdn/16.11.1/img/champion/${champion.riotId}.png`; }}
            />
            <span className="absolute -bottom-1 -right-1 rounded text-[10px] font-bold bg-surface-primary border border-surface-border px-1 text-gray-300">
              {position.charAt(0)}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <WinBadge win={win} />
              <span className="text-xs text-gray-400">{formatRelativeTime(match.playedAt)}</span>
              <span className="text-xs text-gray-500">{formatDuration(match.duration)}</span>
            </div>
            <div className="text-sm font-medium text-white truncate">{champion.name}</div>
          </div>

          <div className="hidden sm:flex flex-col items-center">
            <span className={clsx('text-lg font-bold', kdaColor)}>
              {kda.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400">{formatKdaLabel(kills, deaths, assists)}</span>
          </div>

          <div className="hidden md:flex flex-col items-center text-sm">
            <span className="text-gray-300 font-medium">{formatCs(cs, match.duration)}</span>
            <span className="text-xs text-gray-500">CS</span>
          </div>

          <div className="hidden md:flex flex-col items-center text-sm">
            <span className="text-yellow-400 font-medium">{formatNumber(gold)}</span>
            <span className="text-xs text-gray-500">Gold</span>
          </div>

          <div className="flex items-center gap-1">
            {items.slice(0, 6).map((item, i) => (
              <div key={i} className="h-6 w-6 rounded bg-surface-border overflow-hidden flex-shrink-0">
                {item > 0 && (
                  <img
                    src={getItemImageUrl(item)}
                    alt={`Item ${item}`}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-end flex-shrink-0">
            <span className={clsx('text-sm font-semibold', lpChange > 0 ? 'text-emerald-400' : 'text-red-400')}>
              {lpChange > 0 ? `+${lpChange}` : lpChange} LP
            </span>
            <svg
              className={clsx('text-gray-500 mt-1 transition-transform', expanded && 'rotate-180')}
              width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="sm:hidden flex items-center gap-4 mt-2 pl-7">
          <span className={clsx('text-sm font-bold', kdaColor)}>{kda.toFixed(2)} KDA</span>
          <span className="text-sm text-gray-400">{formatKdaLabel(kills, deaths, assists)}</span>
          <span className="text-sm text-gray-400">{cs} CS</span>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-surface-border/50 px-4 py-3 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBox label="Damage" value={formatNumber(damage)} />
            <StatBox label="Vision Score" value={visionScore.toString()} />
            <StatBox label="CS/min" value={(cs / (match.duration / 60)).toFixed(1)} />
            <StatBox label="Gold" value={formatNumber(gold)} />
          </div>
          <div className="mt-3 flex items-center gap-1">
            <span className="text-xs text-gray-500 mr-1">Items:</span>
            {items.map((item, i) => (
              <div key={i} className="h-8 w-8 rounded bg-surface-border overflow-hidden">
                {item > 0 && (
                  <img
                    src={getItemImageUrl(item)}
                    alt={`Item ${item}`}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-primary/50 rounded-lg p-2.5 text-center">
      <div className="text-base font-semibold text-white">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}
