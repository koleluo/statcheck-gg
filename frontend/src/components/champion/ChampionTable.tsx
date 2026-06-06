import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import type { Champion } from '@/types';
import { getWinRateColor } from '@/utils/formatters';
import { CHAMPION_TIER_COLORS } from '@/utils/constants';

interface Props {
  champions: Champion[];
  onSort: (field: string) => void;
  sortField: string;
  sortOrder: 'asc' | 'desc';
}

const columns = [
  { key: 'rank', label: '#', sortable: false },
  { key: 'name', label: 'Champion', sortable: true },
  { key: 'tier', label: 'Tier', sortable: false },
  { key: 'winRate', label: 'Win Rate', sortable: true },
  { key: 'pickRate', label: 'Pick Rate', sortable: true },
  { key: 'banRate', label: 'Ban Rate', sortable: true },
  { key: 'avgKda', label: 'KDA', sortable: true },
  { key: 'avgCs', label: 'CS', sortable: true },
];

export default function ChampionTable({ champions, onSort, sortField, sortOrder }: Props) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded-lg border border-surface-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface-card border-b border-surface-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(
                  'px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap',
                  col.sortable && 'cursor-pointer hover:text-white select-none',
                  col.key === 'rank' && 'w-10'
                )}
                onClick={() => col.sortable && onSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    <span className="flex flex-col ml-0.5">
                      <svg
                        width="8" height="8" viewBox="0 0 8 8" fill="currentColor"
                        className={clsx(sortField === col.key && sortOrder === 'asc' ? 'text-brand-500' : 'text-gray-600')}
                      >
                        <path d="M4 0L8 8H0z" />
                      </svg>
                      <svg
                        width="8" height="8" viewBox="0 0 8 8" fill="currentColor"
                        className={clsx(sortField === col.key && sortOrder === 'desc' ? 'text-brand-500' : 'text-gray-600')}
                      >
                        <path d="M4 8L0 0h8z" />
                      </svg>
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {champions.map((champ, index) => {
            const tier = champ.stats?.tier ?? 'B';
            const tierColor = CHAMPION_TIER_COLORS[tier] ?? '#6b7280';
            const wrColor = getWinRateColor(champ.stats?.winRate ?? 50);

            return (
              <tr
                key={champ.id}
                onClick={() => navigate(`/champions/${champ.riotId}`)}
                className="border-b border-surface-border/50 hover:bg-surface-hover cursor-pointer transition-colors group"
              >
                <td className="px-4 py-3 text-gray-500 text-xs">{index + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg overflow-hidden flex-shrink-0 border border-surface-border">
                      <img
                        src={champ.imageUrl}
                        alt={champ.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                        onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-white group-hover:text-brand-100 transition-colors">{champ.name}</div>
                      <div className="text-xs text-gray-500 flex gap-1">
                        {champ.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold"
                    style={{ color: tierColor, backgroundColor: `${tierColor}20`, border: `1px solid ${tierColor}40` }}
                  >
                    {tier}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={clsx('font-semibold', wrColor)}>{champ.stats?.winRate.toFixed(1)}%</span>
                </td>
                <td className="px-4 py-3 text-gray-300">{champ.stats?.pickRate.toFixed(1)}%</td>
                <td className="px-4 py-3 text-gray-300">{champ.stats?.banRate.toFixed(1)}%</td>
                <td className="px-4 py-3 text-blue-400 font-medium">{champ.stats?.avgKda.toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-300">{champ.stats?.avgCs.toFixed(0)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
