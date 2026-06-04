import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-primary mt-16">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-300">StatCheck</span>
          </div>
          <p className="text-xs text-gray-500 text-center">
            StatCheck is not affiliated with Riot Games. League of Legends is a trademark of Riot Games, Inc.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link to="/champions" className="hover:text-gray-300 transition-colors">Champions</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
