import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4 animate-fade-in">
      <div className="text-8xl font-extrabold text-surface-border mb-4">404</div>
      <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
      <p className="text-gray-400 mb-8 max-w-md">
        The page you're looking for doesn't exist. Maybe you mistyped the URL, or the summoner has gone dark.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-brand-500 hover:bg-brand-600 px-6 py-2.5 text-sm font-medium text-white transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
