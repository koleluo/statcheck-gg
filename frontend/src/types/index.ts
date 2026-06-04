export interface Summoner {
  id: string;
  name: string;
  level: number;
  profileIcon: number;
  region: string;
  createdAt: string;
  updatedAt: string;
  rankedStats: RankedStats[];
  participants?: MatchParticipant[];
  mostPlayed?: MostPlayedChampion[];
}

export interface RankedStats {
  id: string;
  summonerId: string;
  queue: string;
  tier: string;
  rank: string;
  lp: number;
  wins: number;
  losses: number;
}

export interface Champion {
  id: string;
  riotId: string;
  name: string;
  title: string;
  imageUrl: string;
  tags: string[];
  stats?: ChampionStats;
  participants?: MatchParticipant[];
}

export interface ChampionStats {
  id: string;
  championId: string;
  winRate: number;
  pickRate: number;
  banRate: number;
  avgKda: number;
  avgCs: number;
  gamesPlayed: number;
  tier: string;
}

export interface Match {
  id: string;
  gameId: string;
  gameMode: string;
  duration: number;
  playedAt: string;
  participants: MatchParticipant[];
}

export interface MatchParticipant {
  id: string;
  matchId: string;
  match: Match;
  summonerId: string;
  summoner: Summoner;
  championId: string;
  champion: Champion;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  gold: number;
  items: number[];
  win: boolean;
  lpChange: number;
  position: string;
  damage: number;
  visionScore: number;
}

export interface MostPlayedChampion {
  champion: Champion;
  games: number;
  winRate: number;
  kda: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
}

export type TierColor = 'iron' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster' | 'challenger';
export type ChampionTier = 'S' | 'A' | 'B' | 'C' | 'D';
