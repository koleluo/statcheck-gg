import { useParams } from 'react-router-dom';
import { useSummoner } from '@/hooks/useSummoner';
import { useSearchHistory } from '@/hooks/useLocalStorage';
import { useEffect } from 'react';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { ErrorCard } from '@/components/ui/Card';
import SummonerHeader from '@/components/summoner/SummonerHeader';
import RankedCard from '@/components/summoner/RankedCard';
import ChampionMastery from '@/components/summoner/ChampionMastery';
import PerformanceChart from '@/components/summoner/PerformanceChart';
import MatchCard from '@/components/summoner/MatchCard';
import { formatWinRate } from '@/utils/formatters';
import { clsx } from 'clsx';

export default function SummonerProfile() {
  const { name } = useParams<{ name: string }>();
  const decodedName = name ? decodeURIComponent(name) : '';
  const { data: summoner, isLoading, isError, error } = useSummoner(decodedName);
  const { addSearch } = useSearchHistory();

  useEffect(() => {
    if (summoner) {
      addSearch(summoner.name);
      document.title = `${summoner.name} - StatCheck`;
    }
    return () => { document.title = 'StatCheck'; };
  }, [summoner, addSearch]);

  if (isLoading) return <PageLoader />;

  if (isError) {
    const msg = error instanceof Error ? error.message : 'Summoner not found';
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="mb-4 text-6xl">🔍</div>
        <h2 className="text-2xl font-bold text-white mb-2">Summoner Not Found</h2>
        <p className="text-gray-400 mb-6">{msg}</p>
        <ErrorCard message={`Could not find summoner "${decodedName}". Check the spelling and try again.`} />
      </div>
    );
  }

  if (!summoner) return null;

  const soloStats = summoner.rankedStats.find((r) => r.queue === 'RANKED_SOLO_5x5');
  const flexStats = summoner.rankedStats.find((r) => r.queue === 'RANKED_FLEX_SR');
  const participants = summoner.participants ?? [];

  const totalKills = participants.reduce((s, p) => s + p.kills, 0);
  const totalDeaths = participants.reduce((s, p) => s + p.deaths, 0);
  const totalAssists = participants.reduce((s, p) => s + p.assists, 0);
  const totalWins = participants.filter((p) => p.win).length;
  const avgKda = participants.length > 0
    ? ((totalKills + totalAssists) / Math.max(totalDeaths, 1)).toFixed(2)
    : '0.00';
  const recentWR = participants.length > 0 ? formatWinRate(totalWins, participants.length - totalWins) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <SummonerHeader summoner={summoner} />

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Recent W/R', value: `${recentWR}%`, color: recentWR >= 50 ? 'text-emerald-400' : 'text-red-400' },
          { label: 'Avg KDA', value: avgKda, color: 'text-blue-400' },
          { label: 'Games Played', value: participants.length.toString(), color: 'text-white' },
          { label: 'Wins', value: totalWins.toString(), color: 'text-emerald-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-card border border-surface-border rounded-lg p-3 text-center">
            <div className={clsx('text-xl font-bold', stat.color)}>{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          {soloStats && <RankedCard stats={soloStats} />}
          {flexStats && <RankedCard stats={flexStats} />}
          {summoner.mostPlayed && summoner.mostPlayed.length > 0 && (
            <ChampionMastery champions={summoner.mostPlayed} />
          )}
          {participants.length > 0 && <PerformanceChart participants={participants} />}
        </div>

        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Match History</h2>
            <span className="text-xs text-gray-500">{participants.length} games</span>
          </div>
          {participants.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-3">📭</div>
              <p>No recent matches found</p>
            </div>
          ) : (
            participants.map((p) => <MatchCard key={p.id} participant={p} />)
          )}
        </div>
      </div>
    </div>
  );
}
