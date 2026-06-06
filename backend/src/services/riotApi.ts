import axios, { AxiosError, AxiosInstance } from 'axios';

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const PLATFORM = process.env.RIOT_PLATFORM || 'na1';
const REGION = process.env.RIOT_REGION || 'americas';

if (!RIOT_API_KEY) {
  throw new Error('RIOT_API_KEY environment variable is not set');
}

function createClient(baseURL: string): AxiosInstance {
  return axios.create({
    baseURL,
    headers: { 'X-Riot-Token': RIOT_API_KEY },
    timeout: 10000,
  });
}

const platform = createClient(`https://${PLATFORM}.api.riotgames.com`);
const regional = createClient(`https://${REGION}.api.riotgames.com`);

async function withRetry<T>(fn: () => Promise<T>, attempts = 2): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const e = err as AxiosError;
    if (e.response?.status === 429 && attempts > 1) {
      const wait = parseInt(String(e.response.headers['retry-after'] ?? '1')) * 1000;
      await new Promise((r) => setTimeout(r, wait));
      return withRetry(fn, attempts - 1);
    }
    throw err;
  }
}

export interface RiotSummoner {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  summonerLevel: number;
}

export interface RiotRankedEntry {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

export interface RiotParticipant {
  puuid: string;
  summonerName: string;
  championName: string;
  championId: number;
  kills: number;
  deaths: number;
  assists: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  goldEarned: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  win: boolean;
  teamPosition: string;
  totalDamageDealtToChampions: number;
  visionScore: number;
}

export interface RiotMatch {
  metadata: { matchId: string };
  info: {
    gameId: number;
    gameDuration: number;
    gameMode: string;
    gameStartTimestamp: number;
    participants: RiotParticipant[];
    queueId: number;
  };
}

export interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export function getAccountByRiotId(gameName: string, tagLine: string): Promise<RiotAccount> {
  return withRetry(() =>
    regional
      .get<RiotAccount>(`/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`)
      .then((r) => r.data)
  );
}

export function getSummonerByName(name: string): Promise<RiotSummoner> {
  return withRetry(() =>
    platform
      .get<RiotSummoner>(`/lol/summoner/v4/summoners/by-name/${encodeURIComponent(name)}`)
      .then((r) => r.data)
  );
}

export function getSummonerByPuuid(puuid: string): Promise<RiotSummoner> {
  return withRetry(() =>
    platform
      .get<RiotSummoner>(`/lol/summoner/v4/summoners/by-puuid/${puuid}`)
      .then((r) => r.data)
  );
}

export function getRankedStats(summonerId: string): Promise<RiotRankedEntry[]> {
  return withRetry(() =>
    platform
      .get<RiotRankedEntry[]>(`/lol/league/v4/entries/by-summoner/${summonerId}`)
      .then((r) => r.data)
  );
}

export function getMatchIds(puuid: string, count = 10, queue?: number): Promise<string[]> {
  return withRetry(() =>
    regional
      .get<string[]>(`/lol/match/v5/matches/by-puuid/${puuid}/ids`, {
        params: { start: 0, count, ...(queue !== undefined && { queue }) },
      })
      .then((r) => r.data)
  );
}

export function getMatch(matchId: string): Promise<RiotMatch> {
  return withRetry(() =>
    regional
      .get<RiotMatch>(`/lol/match/v5/matches/${matchId}`)
      .then((r) => r.data)
  );
}
