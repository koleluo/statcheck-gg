import type { MostPlayedChampion } from '@/types';
import Card from '@/components/ui/Card';
import { getWinRateColor } from '@/utils/formatters';
import { clsx } from 'clsx';

interface Props {
  champions: MostPlayedChampion[];
}

export default function ChampionMastery({ champions }: Props) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Most Played</h3>
      <div className="space-y-3">
        {champions.map((entry) => {
          const wrColor = getWinRateColor(entry.winRate);
          return (
            <div key={entry.champion.id} className="flex items-center gap-3">
              <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden border border-surface-border">
                <img
                  src={entry.champion.imageUrl}
                  alt={entry.champion.name}
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white truncate">{entry.champion.name}</span>
                  <span className={clsx('text-xs font-semibold', wrColor)}>{entry.winRate}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-surface-border overflow-hidden">
                    <div
                      className={clsx('h-full rounded-full', entry.winRate >= 50 ? 'bg-emerald-500' : 'bg-red-500')}
                      style={{ width: `${entry.winRate}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">{entry.games}G</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-semibold text-blue-400">{entry.kda}</div>
                <div className="text-xs text-gray-500">KDA</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
