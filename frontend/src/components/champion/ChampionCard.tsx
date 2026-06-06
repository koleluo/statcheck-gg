import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import type { Champion } from '@/types';
import { getWinRateColor } from '@/utils/formatters';
import { CHAMPION_TIER_COLORS } from '@/utils/constants';
import Badge from '@/components/ui/Badge';

interface Props {
  champion: Champion;
}

export default function ChampionCard({ champion }: Props) {
  const navigate = useNavigate();
  const tier = champion.stats?.tier ?? 'B';
  const tierColor = CHAMPION_TIER_COLORS[tier] ?? '#6b7280';
  const winRate = champion.stats?.winRate ?? 0;
  const wrColor = getWinRateColor(winRate);

  return (
    <div
      onClick={() => navigate(`/champions/${champion.riotId}`)}
      className="group relative bg-surface-card border border-surface-border rounded-xl overflow-hidden cursor-pointer hover:border-brand-500/50 hover:bg-surface-hover transition-all duration-150"
    >
      <div className="relative h-32 overflow-hidden">
        <img
          src={champion.imageUrl}
          alt={champion.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-card to-transparent" />
        <span
          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
          style={{ color: tierColor, backgroundColor: `${tierColor}20`, border: `1px solid ${tierColor}40` }}
        >
          {tier}
        </span>
      </div>

      <div className="p-3">
        <div className="font-semibold text-white text-sm truncate mb-0.5">{champion.name}</div>
        <div className="text-xs text-gray-500 truncate mb-2">{champion.title}</div>

        <div className="flex gap-1 mb-3">
          {champion.tags.map((tag) => (
            <Badge key={tag} variant="tag" className="text-[10px]">{tag}</Badge>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-1 text-center">
          <div>
            <div className={clsx('text-sm font-semibold', wrColor)}>{winRate.toFixed(1)}%</div>
            <div className="text-[10px] text-gray-500">Win</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-300">{champion.stats?.pickRate.toFixed(1)}%</div>
            <div className="text-[10px] text-gray-500">Pick</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-blue-400">{champion.stats?.avgKda.toFixed(2)}</div>
            <div className="text-[10px] text-gray-500">KDA</div>
          </div>
        </div>
      </div>
    </div>
  );
}
