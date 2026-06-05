import type { RankedStats } from '@/types';
import { formatWinRate, getTierEmblemUrl } from '@/utils/formatters';
import { QUEUE_LABELS, TIER_COLORS } from '@/utils/constants';
import Card from '@/components/ui/Card';

interface Props {
  stats: RankedStats;
}

export default function RankedCard({ stats }: Props) {
  const winRate = formatWinRate(stats.wins, stats.losses);
  const totalGames = stats.wins + stats.losses;
  const color = TIER_COLORS[stats.tier] ?? '#6b7280';
  const isApex = ['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(stats.tier);

  return (
    <Card className="p-5">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        {QUEUE_LABELS[stats.queue] ?? stats.queue}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="h-16 w-16 flex-shrink-0">
          <img
            src={getTierEmblemUrl(stats.tier)}
            alt={stats.tier}
            className="h-full w-full object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
        <div>
          <div className="text-xl font-bold" style={{ color }}>
            {stats.tier} {!isApex && stats.rank}
          </div>
          <div className="text-sm text-gray-400">{stats.lp} LP</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-gray-400">{totalGames} Games</span>
        <span className={winRate >= 50 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
          {winRate}% WR
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-loss-bg overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          style={{ width: `${winRate}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-1.5">
        <span>{stats.wins}W</span>
        <span>{stats.losses}L</span>
      </div>
    </Card>
  );
}
