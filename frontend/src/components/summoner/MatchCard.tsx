import { useState } from 'react';
import { clsx } from 'clsx';
import type { MatchParticipant } from '@/types';
import {
  formatDuration,
  formatKda,
  formatRelativeTime,
  formatNumber,
  getItemImageUrl,
  getKdaColor,
} from '@/utils/formatters';

interface Props {
  participant: MatchParticipant;
}

const POSITION_ABBR: Record<string, string> = {
  TOP: 'Top',
  JUNGLE: 'Jg',
  MID: 'Mid',
  BOT: 'Bot',
  SUPPORT: 'Sup',
  FILL: '—',
};

const GAME_MODE_LABELS: Record<string, string> = {
  CLASSIC: 'Ranked',
  ARAM: 'ARAM',
  URF: 'URF',
  CHERRY: 'Arena',
  NEXUSBLITZ: 'Nexus Blitz',
};

export default function MatchCard({ participant }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { match, champion, kills, deaths, assists, cs, gold, items, win, damage, visionScore, position } = participant;
  const kda = parseFloat(formatKda(kills, deaths, assists));
  const kdaColor = getKdaColor(kda);
  const gameLabel = GAME_MODE_LABELS[match.gameMode] ?? match.gameMode;

  return (
    <div
      className={clsx(
        'rounded-lg overflow-hidden border transition-all',
        win ? 'border-[#2a3a58] bg-win-bg' : 'border-[#3a2530] bg-loss-bg'
      )}
    >
      <div
        className="flex items-center cursor-pointer select-none"
        onClick={() => setExpanded((e) => !e)}
      >
        {/* Colored left strip */}
        <div className={clsx('w-1 self-stretch flex-shrink-0', win ? 'bg-win' : 'bg-loss')} />

        <div className="flex-1 flex items-center gap-3 p-3">
          {/* Champion icon */}
          <div className="relative flex-shrink-0">
            <div className="h-12 w-12 rounded-full overflow-hidden border-2" style={{ borderColor: win ? '#4171d6' : '#e84057' }}>
              <img
                src={champion.imageUrl}
                alt={champion.name}
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://ddragon.leagueoflegends.com/cdn/16.11.1/img/champion/${champion.riotId}.png`; }}
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 rounded-full text-[9px] font-bold bg-[#111] border border-[#383838] px-1 text-gray-400 leading-tight">
              {POSITION_ABBR[position] ?? '—'}
            </span>
          </div>

          {/* Game info + result */}
          <div className="flex-shrink-0 w-24">
            <div className={clsx('text-xs font-bold', win ? 'text-[#4171d6]' : 'text-[#e84057]')}>
              {win ? 'Victory' : 'Defeat'}
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">{gameLabel}</div>
            <div className="text-[11px] text-gray-600 mt-0.5">{formatDuration(match.duration)}</div>
            <div className="text-[11px] text-gray-700 mt-0.5">{formatRelativeTime(match.playedAt)}</div>
          </div>

          {/* KDA */}
          <div className="flex-shrink-0 w-28">
            <div className="text-sm font-bold text-white tabular-nums">
              {kills} / <span className="text-[#e84057]">{deaths}</span> / {assists}
            </div>
            <div className={clsx('text-xs mt-0.5 font-semibold', kdaColor)}>
              {kda.toFixed(2)}:1 KDA
            </div>
          </div>

          {/* CS / Gold */}
          <div className="hidden sm:flex flex-col gap-0.5 flex-shrink-0 w-20">
            <div className="text-xs text-gray-400">
              <span className="text-white font-medium">{cs}</span> CS
            </div>
            <div className="text-xs text-gray-400">
              <span className="text-yellow-400 font-medium">{formatNumber(gold)}</span> gold
            </div>
          </div>

          {/* Items */}
          <div className="flex items-center gap-1 flex-1 justify-end">
            {[...items.slice(0, 6), 0].map((item, i) => (
              <div
                key={i}
                className={clsx(
                  'h-7 w-7 rounded overflow-hidden flex-shrink-0',
                  item > 0 ? 'bg-[#111]' : 'bg-[#1a1a1a] border border-[#2a2a2a]'
                )}
              >
                {item > 0 && (
                  <img
                    src={getItemImageUrl(item)}
                    alt={`Item ${item}`}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>
            ))}

            <svg
              className={clsx('text-gray-600 ml-1 transition-transform flex-shrink-0', expanded && 'rotate-180')}
              width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {expanded && (
        <div className={clsx('border-t px-4 py-3 animate-fade-in', win ? 'border-[#2a3a58]' : 'border-[#3a2530]')}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBox label="Damage" value={formatNumber(damage)} color="text-[#e84057]" />
            <StatBox label="Vision Score" value={visionScore.toString()} />
            <StatBox label="CS/min" value={(cs / (match.duration / 60)).toFixed(1)} />
            <StatBox label="Gold" value={formatNumber(gold)} color="text-yellow-400" />
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-[#111] rounded-lg p-2.5 text-center">
      <div className={clsx('text-sm font-bold', color ?? 'text-white')}>{value}</div>
      <div className="text-[11px] text-gray-600 mt-0.5">{label}</div>
    </div>
  );
}
