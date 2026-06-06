import { Link, useNavigate, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import SearchBar from '@/components/ui/SearchBar';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/champions', label: 'Champions' },
];

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-surface-primary/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-6">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">StatCheck</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={clsx(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  location.pathname === link.to
                    ? 'bg-brand-500/20 text-brand-100'
                    : 'text-gray-400 hover:text-white hover:bg-surface-hover'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {!isHome && (
            <div className="flex-1 max-w-md">
              <SearchBar size="sm" placeholder="Name#TAG..." />
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-surface-card px-3 py-1 text-xs text-gray-400 border border-surface-border">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              NA1
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
