import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import SearchBar from '@/components/ui/SearchBar';

const tabs = [
  { to: '/', label: 'Home' },
  { to: '/champions', label: 'Champions' },
];

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40">
      {/* Top bar */}
      <div className="bg-[#111111] border-b border-surface-border">
        <div className="mx-auto max-w-7xl px-4 h-12 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-0.5 flex-shrink-0 select-none">
            <span className="text-lg font-black tracking-tight text-white">STAT</span>
            <span className="text-lg font-black tracking-tight text-brand-500">CHECK</span>
            <span className="text-lg font-black tracking-tight text-gray-500">.GG</span>
          </Link>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-surface-card border border-surface-border text-xs text-gray-400 ml-2 select-none">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            League of Legends
            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {!isHome && (
            <div className="flex-1 max-w-sm">
              <SearchBar size="sm" placeholder="Game name + #NA1" />
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded px-2.5 py-1 text-xs text-gray-400 border border-surface-border bg-surface-card">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>NA1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary nav */}
      <div className="bg-[#141414] border-b border-surface-border">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="flex items-end gap-0 h-10">
            {tabs.map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                className={clsx(
                  'px-5 h-full flex items-center text-sm font-medium transition-colors border-b-2',
                  location.pathname === tab.to
                    ? 'text-white border-brand-500'
                    : 'text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-600'
                )}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
