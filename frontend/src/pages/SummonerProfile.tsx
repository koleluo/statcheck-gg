import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSummoner } from '@/hooks/useSummoner';
import { useSearchHistory } from '@/hooks/useLocalStorage';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { ErrorCard } from '@/components/ui/Card';
import SummonerHeader from '@/components/summoner/SummonerHeader';
import RankedCard from '@/components/summoner/RankedCard';
import ChampionMastery from '@/components/summoner/ChampionMastery';
import RecentSummary from '@/components/summoner/RecentSummary';
import MatchCard from '@/components/summoner/MatchCard';

export default function SummonerProfile() {
  const { name } = useParams<{ name: string }>();
  const decodedName = name ? decodeURIComponent(name) : '';
  const { data: summoner, isLoading, isError, error, forceRefresh } = useSummoner(decodedName);
  const { addSearch } = useSearchHistory();
  const [activeTab, setActiveTab] = useState('Summary');

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
        <div className="mb-4 text-5xl">🔍</div>
        <h2 className="text-xl font-bold text-white mb-2">Summoner Not Found</h2>
        <p className="text-gray-500 mb-6 text-sm">{msg}</p>
        <ErrorCard message={`Could not find "${decodedName}". Check the spelling and try again.`} />
      </div>
    );
  }

  if (!summoner) return null;

  const soloStats = summoner.rankedStats.find((r) => r.queue === 'RANKED_SOLO_5x5');
  const flexStats = summoner.rankedStats.find((r) => r.queue === 'RANKED_FLEX_SR');
  const participants = summoner.participants ?? [];

  return (
    <div className="animate-fade-in">
      <SummonerHeader
        summoner={summoner}
        onRefresh={forceRefresh}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex gap-4 items-start">
          {/* Left column — ranked + mastery */}
          <div className="w-64 flex-shrink-0 space-y-3 hidden md:block">
            {soloStats && <RankedCard stats={soloStats} />}
            {flexStats && <RankedCard stats={flexStats} />}
            {!soloStats && !flexStats && (
              <div className="bg-surface-card border border-surface-border rounded-lg p-5 text-center">
                <div className="text-3xl mb-2">🎮</div>
                <div className="text-sm text-gray-500">Unranked</div>
              </div>
            )}
            {summoner.mostPlayed && summoner.mostPlayed.length > 0 && (
              <ChampionMastery champions={summoner.mostPlayed} />
            )}
          </div>

          {/* Right column — summary + matches */}
          <div className="flex-1 min-w-0 space-y-3">
            {participants.length > 0 && <RecentSummary participants={participants} />}

            {/* Mobile ranked cards */}
            <div className="flex gap-3 md:hidden">
              {soloStats && <div className="flex-1"><RankedCard stats={soloStats} /></div>}
              {flexStats && <div className="flex-1"><RankedCard stats={flexStats} /></div>}
            </div>

            {/* Match list header */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Match History
              </h2>
              <span className="text-xs text-gray-700">{participants.length} games</span>
            </div>

            {participants.length === 0 ? (
              <div className="bg-surface-card border border-surface-border rounded-lg text-center py-16">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-500 text-sm">No recent matches found</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {participants.map((p) => (
                  <MatchCard key={p.id} participant={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
