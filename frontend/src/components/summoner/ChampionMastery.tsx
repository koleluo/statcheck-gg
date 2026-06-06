import type { MostPlayedChampion } from '@/types';
import { clsx } from 'clsx';

interface Props {
  champions: MostPlayedChampion[];
}

export default function ChampionMastery({ champions }: Props) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-[#1e1e1e] border-b border-surface-border">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Most Played</span>
      </div>
      <div className="divide-y divide-surface-border">
        {champions.map((entry) => {
          const wr = entry.winRate;
          const isPositive = wr >= 50;
          return (
            <div key={entry.champion.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-hover transition-colors">
              <div className="h-9 w-9 flex-shrink-0 rounded-full overflow-hidden border border-surface-border">
                <img
                  src={entry.champion.imageUrl}
                  alt={entry.champion.name}
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">{entry.champion.name}</div>
                <div className="text-[11px] text-gray-600 mt-0.5">{entry.games}G</div>
              </div>
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <span className={clsx('text-xs font-bold', isPositive ? 'text-[#4171d6]' : 'text-[#e84057]')}>
                  {wr}%
                </span>
                <span className="text-[11px] text-gray-600">{entry.kda} KDA</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
