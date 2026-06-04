export const API_BASE = '/api';

export const TIER_ORDER = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'EMERALD', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER'];

export const TIER_COLORS: Record<string, string> = {
  IRON: '#6b7280',
  BRONZE: '#a16207',
  SILVER: '#9ca3af',
  GOLD: '#c89b3c',
  PLATINUM: '#4db8bf',
  EMERALD: '#22c55e',
  DIAMOND: '#576bce',
  MASTER: '#9d48e0',
  GRANDMASTER: '#e84057',
  CHALLENGER: '#f4c874',
};

export const POSITION_ICONS: Record<string, string> = {
  TOP: '⬆',
  JUNGLE: '🌿',
  MID: '⚡',
  BOT: '🎯',
  SUPPORT: '🛡',
  FILL: '🔄',
};

export const CHAMPION_TIER_COLORS: Record<string, string> = {
  S: '#f4c874',
  A: '#22c55e',
  B: '#3b82f6',
  C: '#9ca3af',
  D: '#ef4444',
};

export const QUEUE_LABELS: Record<string, string> = {
  RANKED_SOLO_5x5: 'Ranked Solo/Duo',
  RANKED_FLEX_SR: 'Ranked Flex',
  NORMAL_BLIND: 'Normal (Blind)',
  NORMAL_DRAFT: 'Normal (Draft)',
  ARAM: 'ARAM',
};
