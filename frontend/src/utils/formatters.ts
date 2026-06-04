export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export function formatWinRate(wins: number, losses: number): number {
  const total = wins + losses;
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
}

export function formatKda(kills: number, deaths: number, assists: number): string {
  const kda = (kills + assists) / Math.max(deaths, 1);
  return kda.toFixed(2);
}

export function formatKdaLabel(kills: number, deaths: number, assists: number): string {
  return `${kills} / ${deaths} / ${assists}`;
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function formatCs(cs: number, durationSeconds: number): string {
  const minutes = durationSeconds / 60;
  const perMin = (cs / minutes).toFixed(1);
  return `${cs} (${perMin})`;
}

export function formatGold(gold: number): string {
  return formatNumber(gold);
}

export function tierToRoman(rank: string): string {
  return rank;
}

export function getWinRateColor(rate: number): string {
  if (rate >= 55) return 'text-emerald-400';
  if (rate >= 50) return 'text-blue-400';
  if (rate >= 45) return 'text-yellow-400';
  return 'text-red-400';
}

export function getKdaColor(kda: number): string {
  if (kda >= 5) return 'text-yellow-400';
  if (kda >= 3) return 'text-blue-400';
  if (kda >= 2) return 'text-green-400';
  return 'text-gray-400';
}

export function getChampionImageUrl(riotId: string): string {
  const sanitized = riotId.replace(/[' ]/g, '').replace(/\./g, '');
  return `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${sanitized}.png`;
}

export function getProfileIconUrl(iconId: number): string {
  return `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${iconId}.png`;
}

export function getItemImageUrl(itemId: number): string {
  return `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/item/${itemId}.png`;
}

export function getTierEmblemUrl(tier: string): string {
  return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/ranked-emblem/emblem-${tier.toLowerCase()}.png`;
}
