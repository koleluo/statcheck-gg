import type { MatchParticipant } from '@/types';
import { PieChart, Pie, Cell } from 'recharts';
import { clsx } from 'clsx';

interface Props {
  participants: MatchParticipant[];
}

const POSITION_ABBR: Record<string, string> = {
  TOP: 'Top',
  JUNGLE: 'Jg',
  MID: 'Mid',
  BOT: 'Bot',
  SUPPORT: 'Sup',
  FILL: '—',
};

export default function RecentSummary({ participants }: Props) {
  if (participants.length === 0) return null;

  const wins = participants.filter((p) => p.win).length;
  const losses = participants.length - wins;
  const winRate = Math.round((wins / participants.length) * 100);

  const totalKills = participants.reduce((s, p) => s + p.kills, 0);
  const totalDeaths = participants.reduce((s, p) => s + p.deaths, 0);
  const totalAssists = participants.reduce((s, p) => s + p.assists, 0);
  const n = participants.length;
  const avgK = (totalKills / n).toFixed(1);
  const avgD = (totalDeaths / n).toFixed(1);
  const avgA = (totalAssists / n).toFixed(1);
  const kda = ((totalKills + totalAssists) / Math.max(totalDeaths, 1)).toFixed(2);

  // Most played champions
  const champMap: Record<string, { count: number; wins: number; imageUrl: string; name: string }> = {};
  for (const p of participants) {
    const id = p.champion.riotId;
    if (!champMap[id]) champMap[id] = { count: 0, wins: 0, imageUrl: p.champion.imageUrl, name: p.champion.name };
    champMap[id].count++;
    if (p.win) champMap[id].wins++;
  }
  const mostPlayed = Object.values(champMap).sort((a, b) => b.count - a.count).slice(0, 4);

  // Preferred role
  const roleMap: Record<string, number> = {};
  for (const p of participants) {
    const pos = p.position ?? 'FILL';
    roleMap[pos] = (roleMap[pos] ?? 0) + 1;
  }
  const maxRole = Math.max(...Object.values(roleMap));

  const pieData = [
    { name: 'Wins', value: wins },
    { name: 'Losses', value: losses },
  ];

  return (
    <div className="bg-surface-card border border-surface-border rounded-lg p-4">
      <div className="flex items-start gap-6">
        {/* Donut + W/L */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="relative">
            <PieChart width={86} height={86}>
              <Pie
                data={pieData}
                cx={43}
                cy={43}
                innerRadius={30}
                outerRadius={42}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={0}
              >
                <Cell fill="#4171d6" />
                <Cell fill="#e84057" />
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{winRate}%</span>
            </div>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <div className="text-white font-semibold">{participants.length}G</div>
            <div className="text-[#4171d6] font-medium">{wins}W</div>
            <div className="text-[#e84057] font-medium">{losses}L</div>
          </div>
        </div>

        {/* KDA */}
        <div className="flex-shrink-0 border-l border-surface-border pl-4">
          <div className="text-lg font-bold text-white tabular-nums">
            {avgK} / <span className="text-[#e84057]">{avgD}</span> / {avgA}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            <span className={clsx('font-semibold', parseFloat(kda) >= 3 ? 'text-[#4171d6]' : parseFloat(kda) >= 2 ? 'text-gray-300' : 'text-gray-500')}>{kda}:1 KDA</span>
          </div>
        </div>

        {/* Most played */}
        <div className="flex-1 border-l border-surface-border pl-4">
          <div className="text-[11px] text-gray-500 mb-2 font-medium uppercase tracking-wider">Recent Champions</div>
          <div className="flex items-center gap-2 flex-wrap">
            {mostPlayed.map((c) => (
              <div key={c.name} className="flex flex-col items-center gap-1">
                <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-surface-border">
                  <img src={c.imageUrl} alt={c.name} className="h-full w-full object-cover" />
                </div>
                <span className={clsx('text-[10px] font-medium', (c.wins / c.count) >= 0.5 ? 'text-[#4171d6]' : 'text-[#e84057]')}>
                  {Math.round((c.wins / c.count) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Preferred role */}
        {Object.keys(roleMap).length > 1 && (
          <div className="border-l border-surface-border pl-4 flex-shrink-0 hidden lg:block">
            <div className="text-[11px] text-gray-500 mb-2 font-medium uppercase tracking-wider">Preferred Role</div>
            <div className="space-y-1">
              {Object.entries(roleMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([role, count]) => (
                  <div key={role} className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500 w-8">{POSITION_ABBR[role] ?? role}</span>
                    <div className="w-16 h-1.5 rounded-full bg-surface-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${(count / maxRole) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-gray-500">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
