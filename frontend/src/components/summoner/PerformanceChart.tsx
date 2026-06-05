import type { MatchParticipant } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import Card from '@/components/ui/Card';

interface Props {
  participants: MatchParticipant[];
}

interface ChartPoint {
  game: number;
  lp: number;
  kda: number;
}

export default function PerformanceChart({ participants }: Props) {
  const data: ChartPoint[] = [...participants]
    .reverse()
    .map((p, i) => ({
      game: i + 1,
      lp: p.lpChange,
      kda: parseFloat(((p.kills + p.assists) / Math.max(p.deaths, 1)).toFixed(2)),
    }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-card border border-surface-border rounded-lg p-3 text-xs shadow-xl">
          {payload.map((p) => (
            <div key={p.dataKey} className="flex gap-2">
              <span className="text-gray-400">{p.dataKey === 'lp' ? 'LP Change' : 'KDA'}:</span>
              <span className="font-semibold text-white">
                {p.dataKey === 'lp' && p.value > 0 ? '+' : ''}{p.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">LP History</h3>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
          <XAxis dataKey="game" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#374151" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="lp"
            stroke="#5383e8"
            strokeWidth={2}
            dot={{ fill: '#5383e8', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#5383e8' }}
          />
        </LineChart>
      </ResponsiveContainer>

      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-3">KDA Trend</h3>
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
          <XAxis dataKey="game" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="kda"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: '#22c55e', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
