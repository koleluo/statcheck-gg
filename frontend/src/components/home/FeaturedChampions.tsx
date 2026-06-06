import { Link } from 'react-router-dom';
import { useChampions } from '@/hooks/useChampions';
import ChampionCard from '@/components/champion/ChampionCard';
import { SkeletonCard } from '@/components/ui/LoadingSpinner';
import { ErrorCard } from '@/components/ui/Card';

export default function FeaturedChampions() {
  const { data, isLoading, isError } = useChampions({ sort: 'winRate', order: 'desc', limit: 6 });

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-white">Top Champions</h2>
          <p className="text-sm text-gray-500 mt-0.5">Highest win rates this patch</p>
        </div>
        <Link
          to="/champions"
          className="text-sm text-brand-500 hover:text-brand-100 transition-colors flex items-center gap-1"
        >
          View All
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {isError && <ErrorCard message="Failed to load champion statistics" />}

      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {data.data.map((champ) => (
            <ChampionCard key={champ.id} champion={champ} />
          ))}
        </div>
      )}
    </section>
  );
}
