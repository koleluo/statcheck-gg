import { useRecentMatches } from '@/hooks/useMatches';
import { SkeletonCard } from '@/components/ui/LoadingSpinner';
import { ErrorCard } from '@/components/ui/Card';
import { formatDuration, formatRelativeTime } from '@/utils/formatters';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

export default function RecentMatches() {
  const { data: matches, isLoading, isError } = useRecentMatches(8);
  const navigate = useNavigate();

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-white">Recent Matches</h2>
          <p className="text-sm text-gray-500 mt-0.5">Live game activity</p>
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      )}

      {isError && <ErrorCard message="Failed to load recent matches" />}

      {matches && (
        <div className="grid gap-3 sm:grid-cols-2">
          {matches.map((match) => {
            const p = match.participants[0];
            if (!p) return null;
            return (
              <div
                key={match.id}
                onClick={() => navigate(`/summoner/${encodeURIComponent(p.summoner.name)}`)}
                className={clsx(
                  'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:border-brand-500/50',
                  p.win
                    ? 'bg-win-bg border-win/30 hover:bg-win-bg'
                    : 'bg-loss-bg border-loss/30 hover:bg-loss-bg'
                )}
              >
                <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden border border-surface-border">
                  <img
                    src={p.champion.imageUrl}
                    alt={p.champion.name}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">{p.summoner.name}</span>
                    <span className={clsx('text-xs font-semibold', p.win ? 'text-emerald-400' : 'text-red-400')}>
                      {p.win ? 'W' : 'L'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {p.champion.name} · {p.kills}/{p.deaths}/{p.assists} · {formatDuration(match.duration)}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={clsx('text-xs font-semibold', p.lpChange > 0 ? 'text-emerald-400' : 'text-red-400')}>
                    {p.lpChange > 0 ? '+' : ''}{p.lpChange} LP
                  </div>
                  <div className="text-xs text-gray-500">{formatRelativeTime(match.playedAt)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
