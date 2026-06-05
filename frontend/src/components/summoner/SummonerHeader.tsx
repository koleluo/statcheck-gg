import type { Summoner } from '@/types';
import { TierBadge } from '@/components/ui/Badge';
import { getProfileIconUrl } from '@/utils/formatters';
import { useFavoriteSummoners } from '@/hooks/useLocalStorage';

interface Props {
  summoner: Summoner;
}

export default function SummonerHeader({ summoner }: Props) {
  const soloRanked = summoner.rankedStats.find((r) => r.queue === 'RANKED_SOLO_5x5');
  const { toggleFavorite, isFavorite } = useFavoriteSummoners();
  const favorite = isFavorite(summoner.name);

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="relative flex-shrink-0">
          <div className="h-24 w-24 rounded-xl overflow-hidden border-2 border-brand-500/50 bg-surface-border">
            <img
              src={getProfileIconUrl(summoner.profileIcon)}
              alt={summoner.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getProfileIconUrl(1);
              }}
            />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-surface-primary border border-surface-border rounded-full px-2 py-0.5 text-xs font-bold text-white">
            {summoner.level}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white truncate">{summoner.name}</h1>
            <button
              onClick={() => toggleFavorite(summoner.name)}
              className="text-gray-500 hover:text-yellow-400 transition-colors flex-shrink-0"
              title={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              {summoner.region}
            </span>
            {soloRanked && (
              <TierBadge tier={soloRanked.tier} rank={soloRanked.rank} lp={soloRanked.lp} />
            )}
          </div>
        </div>

        <button className="flex-shrink-0 rounded-lg bg-brand-500 hover:bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors">
          Update
        </button>
      </div>
    </div>
  );
}
