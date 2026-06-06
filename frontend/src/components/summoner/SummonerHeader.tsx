import { useState } from 'react';
import { clsx } from 'clsx';
import type { Summoner } from '@/types';
import { getProfileIconUrl, formatRelativeTime, getTierEmblemUrl } from '@/utils/formatters';
import { useFavoriteSummoners } from '@/hooks/useLocalStorage';
import { TIER_COLORS } from '@/utils/constants';

interface Props {
  summoner: Summoner;
  onRefresh?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const TABS = ['Summary', 'Champions', 'Mastery'];

export default function SummonerHeader({ summoner, onRefresh, activeTab = 'Summary', onTabChange }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const { toggleFavorite, isFavorite } = useFavoriteSummoners();
  const favorite = isFavorite(summoner.name);
  const soloRanked = summoner.rankedStats.find((r) => r.queue === 'RANKED_SOLO_5x5');
  const tierColor = soloRanked ? (TIER_COLORS[soloRanked.tier] ?? '#9aa4af') : '#9aa4af';

  async function handleRefresh() {
    if (!onRefresh || refreshing) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div className="bg-[#1e1e1e] border-b border-surface-border">
      {/* Profile area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-0">
        <div className="flex items-start gap-5">
          {/* Avatar with level badge */}
          <div className="relative flex-shrink-0">
            <div className="h-24 w-24 rounded-xl overflow-hidden border-2 border-[#383838] bg-[#2a2a2a]">
              <img
                src={getProfileIconUrl(summoner.profileIcon)}
                alt={summoner.name}
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = getProfileIconUrl(1); }}
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#111] border border-[#383838] rounded-full px-2.5 py-0.5 text-[11px] font-bold text-gray-300 whitespace-nowrap">
              {summoner.level}
            </div>
          </div>

          {/* Name / info */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-white tracking-tight truncate">{summoner.name}</h1>
              <button
                onClick={() => toggleFavorite(summoner.name)}
                className={clsx('transition-colors flex-shrink-0', favorite ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {summoner.region}
              </span>
              {soloRanked && (
                <span className="flex items-center gap-1.5">
                  <img
                    src={getTierEmblemUrl(soloRanked.tier)}
                    alt={soloRanked.tier}
                    className="h-4 w-4 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span style={{ color: tierColor }} className="font-semibold">
                    {soloRanked.tier} {soloRanked.rank} {soloRanked.lp} LP
                  </span>
                </span>
              )}
              <span className="text-gray-600">
                Last updated: {formatRelativeTime(summoner.updatedAt)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-1.5 rounded px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {refreshing ? (
                  <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".3" />
                    <path d="M21 12a9 9 0 01-9 9" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                )}
                {refreshing ? 'Updating…' : 'Update'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-end gap-0 mt-5 -mb-px">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange?.(tab)}
              className={clsx(
                'px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors',
                activeTab === tab
                  ? 'text-white border-brand-500'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
