import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavoriteSummoners, useSearchHistory } from '@/hooks/useLocalStorage';

const REGIONS = ['NA', 'EUW', 'EUNE', 'KR', 'BR', 'LAN', 'LAS', 'OCE', 'TR', 'RU', 'JP'];

export default function SearchSection() {
  const [region, setRegion] = useState('NA');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { history } = useSearchHistory();
  const { favorites } = useFavoriteSummoners();

  function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/summoner/${encodeURIComponent(trimmed)}`);
  }

  return (
    <section className="min-h-[calc(100vh-88px)] flex flex-col items-center justify-center px-4 py-16 bg-surface-primary">
      {/* Logo */}
      <div className="mb-10 text-center select-none">
        <h1 className="text-7xl font-black tracking-tighter leading-none">
          <span className="text-white">STAT</span>
          <span className="text-brand-500">CHECK</span>
          <span className="text-gray-600">.GG</span>
        </h1>
        <p className="text-gray-500 mt-3 text-sm tracking-wide uppercase">League of Legends Statistics</p>
      </div>

      {/* Search bar */}
      <div className="w-full max-w-xl">
        <div className="flex rounded-lg overflow-hidden border border-surface-border bg-surface-card focus-within:border-brand-500 transition-colors">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-surface-hover text-gray-300 text-sm px-3 py-3 border-r border-surface-border focus:outline-none cursor-pointer hover:bg-[#333] transition-colors appearance-none pr-6 relative"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center' }}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Game name + #NA1"
            className="flex-1 bg-transparent text-white px-4 py-3 text-sm placeholder-gray-600 focus:outline-none"
          />

          <button
            onClick={handleSearch}
            className="bg-brand-500 hover:bg-brand-600 text-white px-6 text-sm font-bold tracking-wider transition-colors flex-shrink-0"
          >
            .GG
          </button>
        </div>

        {/* Recent + Favorites */}
        {(history.length > 0 || favorites.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {favorites.slice(0, 3).map((name) => (
              <button
                key={name}
                onClick={() => navigate(`/summoner/${encodeURIComponent(name)}`)}
                className="flex items-center gap-1.5 rounded-full bg-surface-card border border-surface-border px-3 py-1 text-xs text-gray-400 hover:text-white hover:border-brand-500/60 transition-colors"
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="#f4c874" stroke="#f4c874" strokeWidth="1">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {name}
              </button>
            ))}
            {history.slice(0, 5).map((name) => (
              <button
                key={name}
                onClick={() => navigate(`/summoner/${encodeURIComponent(name)}`)}
                className="rounded-full bg-surface-card border border-surface-border px-3 py-1 text-xs text-gray-500 hover:text-white hover:border-gray-600 transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
