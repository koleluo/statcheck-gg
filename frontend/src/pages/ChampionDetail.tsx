import { useParams, Link } from 'react-router-dom';
import { useChampion } from '@/hooks/useChampions';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { ErrorCard } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { clsx } from 'clsx';
import { getWinRateColor, formatRelativeTime, formatDuration, formatKdaLabel } from '@/utils/formatters';
import { CHAMPION_TIER_COLORS } from '@/utils/constants';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export default function ChampionDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: champion, isLoading, isError } = useChampion(id);

  if (isLoading) return <PageLoader />;
  if (isError || !champion) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <ErrorCard message={`Champion "${id}" not found`} />
        <Link to="/champions" className="mt-4 inline-block text-brand-500 hover:underline">
          ← Back to Champions
        </Link>
      </div>
    );
  }

  const tier = champion.stats?.tier ?? 'B';
  const tierColor = CHAMPION_TIER_COLORS[tier] ?? '#6b7280';
  const wrColor = getWinRateColor(champion.stats?.winRate ?? 50);

  const radarData = [
    { subject: 'Win Rate', value: ((champion.stats?.winRate ?? 50) / 60) * 100 },
    { subject: 'Pick Rate', value: ((champion.stats?.pickRate ?? 5) / 20) * 100 },
    { subject: 'Ban Rate', value: ((champion.stats?.banRate ?? 5) / 25) * 100 },
    { subject: 'KDA', value: ((champion.stats?.avgKda ?? 2) / 5) * 100 },
    { subject: 'CS', value: ((champion.stats?.avgCs ?? 150) / 250) * 100 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Link to="/champions" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Champions
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
            <div className="relative h-48">
              <img
                src={champion.imageUrl}
                alt={champion.name}
                className="w-full h-full object-cover object-top"
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent" />
              <span
                className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold"
                style={{ color: tierColor, backgroundColor: `${tierColor}20`, border: `1px solid ${tierColor}40` }}
              >
                {tier}
              </span>
            </div>
            <div className="p-4">
              <h1 className="text-2xl font-bold text-white">{champion.name}</h1>
              <p className="text-sm text-gray-400 mb-3">{champion.title}</p>
              <div className="flex flex-wrap gap-1.5">
                {champion.tags.map((tag) => (
                  <Badge key={tag} variant="tag">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface-card border border-surface-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Statistics</h3>
            <div className="space-y-3">
              {[
                { label: 'Win Rate', value: `${champion.stats?.winRate.toFixed(1)}%`, color: wrColor },
                { label: 'Pick Rate', value: `${champion.stats?.pickRate.toFixed(1)}%`, color: 'text-gray-300' },
                { label: 'Ban Rate', value: `${champion.stats?.banRate.toFixed(1)}%`, color: 'text-red-400' },
                { label: 'Avg KDA', value: champion.stats?.avgKda.toFixed(2) ?? '0.00', color: 'text-blue-400' },
                { label: 'Avg CS', value: champion.stats?.avgCs.toFixed(0) ?? '0', color: 'text-gray-300' },
                { label: 'Games Played', value: (champion.stats?.gamesPlayed ?? 0).toLocaleString(), color: 'text-gray-300' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{stat.label}</span>
                  <span className={clsx('text-sm font-semibold', stat.color)}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface-card border border-surface-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Performance Radar</h3>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2a3f6f" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Radar dataKey="value" stroke="#5383e8" fill="#5383e8" fillOpacity={0.25} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f3460', border: '1px solid #2a3f6f', borderRadius: '8px' }}
                  labelStyle={{ color: '#e5e7eb' }}
                  formatter={(v: number) => [`${v.toFixed(0)}%`, 'Score']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {champion.participants && champion.participants.length > 0 && (
            <div className="bg-surface-card border border-surface-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Recent Matches</h3>
              <div className="space-y-2">
                {champion.participants.map((p) => (
                  <Link
                    key={p.id}
                    to={`/summoner/${encodeURIComponent(p.summoner.name)}`}
                    className={clsx(
                      'flex items-center gap-3 p-2.5 rounded-lg border transition-all hover:border-brand-500/50',
                      p.win ? 'bg-win-bg border-win/20' : 'bg-loss-bg border-loss/20'
                    )}
                  >
                    <span className={clsx('text-xs font-bold w-5 flex-shrink-0', p.win ? 'text-emerald-400' : 'text-red-400')}>
                      {p.win ? 'W' : 'L'}
                    </span>
                    <span className="text-sm font-medium text-white flex-1">{p.summoner.name}</span>
                    <span className="text-sm text-gray-300">{formatKdaLabel(p.kills, p.deaths, p.assists)}</span>
                    <span className={clsx('text-xs font-semibold', p.lpChange > 0 ? 'text-emerald-400' : 'text-red-400')}>
                      {p.lpChange > 0 ? '+' : ''}{p.lpChange}
                    </span>
                    <span className="text-xs text-gray-500 hidden sm:block">{formatDuration(p.match.duration)}</span>
                    <span className="text-xs text-gray-500 hidden md:block">{formatRelativeTime(p.match.playedAt)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
