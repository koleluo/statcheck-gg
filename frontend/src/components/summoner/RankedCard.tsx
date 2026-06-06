import type { RankedStats } from '@/types';
import { formatWinRate, getTierEmblemUrl } from '@/utils/formatters';
import { QUEUE_LABELS, TIER_COLORS } from '@/utils/constants';

interface Props {
  stats: RankedStats;
}

export default function RankedCard({ stats }: Props) {
  const winRate = formatWinRate(stats.wins, stats.losses);
  const totalGames = stats.wins + stats.losses;
  const color = TIER_COLORS[stats.tier] ?? '#9aa4af';
  const isApex = ['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(stats.tier);

  return (
    <div className="bg-surface-card border border-surface-border rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-[#1e1e1e] border-b border-surface-border">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {QUEUE_LABELS[stats.queue] ?? stats.queue}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 flex-shrink-0">
            <img
              src={getTierEmblemUrl(stats.tier)}
              alt={stats.tier}
              className="h-full w-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold" style={{ color }}>
              {stats.tier}{!isApex && ` ${stats.rank}`}
            </div>
            <div className="text-2xl font-black text-white">{stats.lp} <span className="text-sm font-normal text-gray-500">LP</span></div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{totalGames}G</span>
            <span className="font-semibold" style={{ color: winRate >= 50 ? '#4171d6' : '#e84057' }}>
              {winRate}% Win Rate
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-loss/30 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${winRate}%`, backgroundColor: winRate >= 50 ? '#4171d6' : '#e84057' }}
            />
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-[#4171d6] font-medium">{stats.wins}W</span>
            <span className="text-[#e84057] font-medium">{stats.losses}L</span>
          </div>
        </div>
      </div>
    </div>
  );
}
