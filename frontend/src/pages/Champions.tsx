import { useState } from 'react';
import { useChampions } from '@/hooks/useChampions';
import ChampionTable from '@/components/champion/ChampionTable';
import ChampionCard from '@/components/champion/ChampionCard';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { ErrorCard } from '@/components/ui/Card';
import { clsx } from 'clsx';

const TAG_FILTERS = ['All', 'Mage', 'Assassin', 'Fighter', 'Tank', 'Marksman', 'Support'];
type ViewMode = 'table' | 'grid';

export default function Champions() {
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [sortField, setSortField] = useState('winRate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [view, setView] = useState<ViewMode>('table');

  const { data, isLoading, isError } = useChampions({
    search: search || undefined,
    tag: tag || undefined,
    sort: sortField,
    order: sortOrder,
    limit: 50,
  });

  function handleSort(field: string) {
    if (sortField === field) {
      setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Champion Statistics</h1>
        <p className="text-gray-400">Win rates, pick rates, and performance data for all champions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search champion..."
            className="w-full rounded-lg border border-surface-border bg-surface-card pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        <div className="flex gap-1 flex-wrap">
          {TAG_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t === 'All' ? '' : t)}
              className={clsx(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                (t === 'All' && !tag) || tag === t
                  ? 'bg-brand-500 text-white'
                  : 'bg-surface-card border border-surface-border text-gray-400 hover:text-white'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex gap-1 ml-auto">
          {(['table', 'grid'] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={clsx(
                'p-2 rounded-md border transition-colors',
                view === v
                  ? 'bg-brand-500 border-brand-500 text-white'
                  : 'border-surface-border bg-surface-card text-gray-400 hover:text-white'
              )}
              title={v === 'table' ? 'Table view' : 'Grid view'}
            >
              {v === 'table' ? (
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18M3 14h18M3 18h18" />
                </svg>
              ) : (
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <PageLoader />}
      {isError && <ErrorCard message="Failed to load champion data" />}

      {data && (
        <>
          <div className="text-xs text-gray-500 mb-3">{data.total} champions</div>
          {view === 'table' ? (
            <ChampionTable
              champions={data.data}
              onSort={handleSort}
              sortField={sortField}
              sortOrder={sortOrder}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {data.data.map((champ) => (
                <ChampionCard key={champ.id} champion={champ} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
