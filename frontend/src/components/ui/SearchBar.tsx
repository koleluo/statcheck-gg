import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useSummonerSearch } from '@/hooks/useSummoner';
import { useSearchHistory } from '@/hooks/useLocalStorage';

interface Props {
  size?: 'sm' | 'lg';
  placeholder?: string;
}

export default function SearchBar({ size = 'lg', placeholder = 'Search summoner name...' }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { history, addSearch } = useSearchHistory();
  const { data: suggestions, isLoading } = useSummonerSearch(query);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/summoner/${encodeURIComponent(query.trim())}`);
    addSearch(query.trim());
    setOpen(false);
    setQuery('');
  }

  function handleSelect(name: string) {
    navigate(`/summoner/${encodeURIComponent(name)}`);
    addSearch(name);
    setOpen(false);
    setQuery('');
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  }

  const showDropdown = open && (query.length >= 2 || history.length > 0);
  const showSuggestions = query.length >= 2 && suggestions && suggestions.length > 0;
  const showHistory = query.length < 2 && history.length > 0;

  return (
    <div ref={ref} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className={clsx(
          'flex items-center rounded-lg border border-surface-border bg-surface-secondary transition-all',
          'focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500/30',
          size === 'lg' && 'px-4 py-3',
          size === 'sm' && 'px-3 py-2'
        )}>
          <svg className="text-gray-500 mr-3 flex-shrink-0" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={clsx(
              'flex-1 bg-transparent text-white placeholder-gray-500 outline-none',
              size === 'lg' && 'text-base',
              size === 'sm' && 'text-sm'
            )}
            autoComplete="off"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="text-gray-500 hover:text-gray-300 mr-2">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className={clsx(
              'rounded-md bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors',
              size === 'lg' && 'px-4 py-1.5 text-sm',
              size === 'sm' && 'px-3 py-1 text-xs'
            )}
          >
            Search
          </button>
        </div>
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border border-surface-border bg-surface-card shadow-xl overflow-hidden animate-fade-in">
          {isLoading && query.length >= 2 && (
            <div className="px-4 py-3 text-sm text-gray-400">Searching...</div>
          )}

          {showSuggestions && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-surface-border">
                Summoners
              </div>
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelect(s.name)}
                  className="w-full px-4 py-2.5 text-left hover:bg-surface-hover flex items-center gap-3 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-surface-border flex-shrink-0 overflow-hidden">
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${s.profileIcon}.png`}
                      alt={s.name}
                      className="h-full w-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/1.png'; }}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{s.name}</div>
                    <div className="text-xs text-gray-400">{s.region} · Level {s.level}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showHistory && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-surface-border">
                Recent Searches
              </div>
              {history.map((name) => (
                <button
                  key={name}
                  onClick={() => handleSelect(name)}
                  className="w-full px-4 py-2.5 text-left hover:bg-surface-hover flex items-center gap-3 transition-colors"
                >
                  <svg className="text-gray-500" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-300">{name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
