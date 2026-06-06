import SearchBar from '@/components/ui/SearchBar';
import { useFavoriteSummoners, useSearchHistory } from '@/hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';

export default function SearchSection() {
  const { history } = useSearchHistory();
  const { favorites } = useFavoriteSummoners();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-surface-secondary via-surface-primary to-surface-primary py-20 px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-500/10 border border-brand-500/20 px-4 py-1.5 text-sm text-brand-100">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
          League of Legends Statistics
        </div>
        <h1 className="mb-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Track Your{' '}
          <span className="bg-gradient-to-r from-brand-500 to-purple-400 bg-clip-text text-transparent">
            Performance
          </span>
        </h1>
        <p className="mb-8 text-lg text-gray-400">
          Search for any summoner to view stats, match history, champion mastery, and more.
        </p>

        <SearchBar size="lg" />

        {(history.length > 0 || favorites.length > 0) && (
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {favorites.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Favorites:</span>
                {favorites.slice(0, 3).map((name) => (
                  <button
                    key={name}
                    onClick={() => navigate(`/summoner/${encodeURIComponent(name)}`)}
                    className="flex items-center gap-1 rounded-full bg-surface-card border border-surface-border px-3 py-1 text-xs text-gray-300 hover:text-white hover:border-brand-500/50 transition-colors"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#f4c874" stroke="#f4c874" strokeWidth="1">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {name}
                  </button>
                ))}
              </div>
            )}
            {history.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Recent:</span>
                {history.slice(0, 4).map((name) => (
                  <button
                    key={name}
                    onClick={() => navigate(`/summoner/${encodeURIComponent(name)}`)}
                    className="rounded-full bg-surface-card border border-surface-border px-3 py-1 text-xs text-gray-300 hover:text-white hover:border-brand-500/50 transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
