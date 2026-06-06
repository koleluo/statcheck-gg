import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { createError } from '../middleware/errorHandler';
import * as riotApi from '../services/riotApi';
import { getChampionIdMap } from '../services/dataDragon';

const prisma = new PrismaClient();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function isStale(date: Date): boolean {
  return Date.now() - date.getTime() > CACHE_TTL_MS;
}

function mapPosition(pos: string): string {
  const positions: Record<string, string> = {
    TOP: 'TOP',
    JUNGLE: 'JUNGLE',
    MIDDLE: 'MID',
    BOTTOM: 'BOT',
    UTILITY: 'SUPPORT',
  };
  return positions[pos] ?? 'FILL';
}

function buildMostPlayed(participants: Array<{ championId: string; win: boolean; kills: number; deaths: number; assists: number; champion: { id: string; riotId: string; name: string; title: string; imageUrl: string; tags: string[] } }>) {
  const map: Record<string, { count: number; wins: number; kills: number; deaths: number; assists: number; champion: typeof participants[0]['champion'] }> = {};
  for (const p of participants) {
    const cid = p.championId;
    if (!map[cid]) map[cid] = { count: 0, wins: 0, kills: 0, deaths: 0, assists: 0, champion: p.champion };
    map[cid].count++;
    if (p.win) map[cid].wins++;
    map[cid].kills += p.kills;
    map[cid].deaths += p.deaths;
    map[cid].assists += p.assists;
  }
  return Object.values(map)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((c) => ({
      champion: c.champion,
      games: c.count,
      winRate: Math.round((c.wins / c.count) * 100),
      kda: ((c.kills + c.assists) / Math.max(c.deaths, 1)).toFixed(2),
    }));
}

async function syncFromRiot(searchName: string): Promise<string> {
  // Support both "Name#TAG" (Riot ID) and legacy summoner name
  let riot: riotApi.RiotSummoner;
  let displayName: string;

  if (searchName.includes('#')) {
    const [gameName, tagLine] = searchName.split('#');
    const account = await riotApi.getAccountByRiotId(gameName, tagLine);
    riot = await riotApi.getSummonerByPuuid(account.puuid);
    displayName = `${gameName}#${tagLine}`;
  } else {
    riot = await riotApi.getSummonerByName(searchName);
    displayName = riot.name;
  }

  // Upsert summoner — key on puuid so renames don't create duplicates
  const summoner = await prisma.summoner.upsert({
    where: { puuid: riot.puuid },
    update: {
      name: displayName,
      level: riot.summonerLevel,
      profileIcon: riot.profileIconId,
      riotSummonerId: riot.id,
    },
    create: {
      name: displayName,
      level: riot.summonerLevel,
      profileIcon: riot.profileIconId,
      region: (process.env.RIOT_PLATFORM ?? 'na1').toUpperCase(),
      puuid: riot.puuid,
      riotSummonerId: riot.id,
    },
  });

  // Sync ranked stats
  const rankedEntries = await riotApi.getRankedStats(riot.id);
  await Promise.all(
    rankedEntries.map((entry) =>
      prisma.rankedStats.upsert({
        where: { summonerId_queue: { summonerId: summoner.id, queue: entry.queueType } },
        update: {
          tier: entry.tier,
          rank: entry.rank,
          lp: entry.leaguePoints,
          wins: entry.wins,
          losses: entry.losses,
        },
        create: {
          summonerId: summoner.id,
          queue: entry.queueType,
          tier: entry.tier,
          rank: entry.rank,
          lp: entry.leaguePoints,
          wins: entry.wins,
          losses: entry.losses,
        },
      })
    )
  );

  // Sync recent ranked solo match history
  const matchIds = await riotApi.getMatchIds(riot.puuid, 10, 420);
  const championIdMap = await getChampionIdMap();

  for (const matchId of matchIds) {
    try {
      // Skip if we already have this participant's data
      const existingParticipant = await prisma.matchParticipant.findFirst({
        where: { summonerId: summoner.id, match: { gameId: matchId } },
      });
      if (existingParticipant) continue;

      const riotMatch = await riotApi.getMatch(matchId);
      const info = riotMatch.info;

      // Find this summoner's participant row in the match
      const p = info.participants.find((participant) => participant.puuid === riot.puuid);
      if (!p) continue;

      // Resolve champion — Riot returns the riotId as championName
      const champRiotId = p.championName || championIdMap[p.championId];
      if (!champRiotId) continue;

      const champion = await prisma.champion.upsert({
        where: { riotId: champRiotId },
        update: {},
        create: {
          riotId: champRiotId,
          name: p.championName,
          title: '',
          imageUrl: `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${champRiotId}.png`,
          tags: [],
        },
      });

      const match = await prisma.match.upsert({
        where: { gameId: matchId },
        update: {},
        create: {
          gameId: matchId,
          gameMode: info.gameMode,
          duration: info.gameDuration,
          playedAt: new Date(info.gameStartTimestamp),
        },
      });

      const items = [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6].filter(
        (i) => i > 0
      );

      await prisma.matchParticipant.create({
        data: {
          matchId: match.id,
          summonerId: summoner.id,
          championId: champion.id,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          cs: p.totalMinionsKilled + p.neutralMinionsKilled,
          gold: p.goldEarned,
          items,
          win: p.win,
          lpChange: 0,
          position: mapPosition(p.teamPosition),
          damage: p.totalDamageDealtToChampions,
          visionScore: p.visionScore,
        },
      });
    } catch (matchErr) {
      // Don't fail the whole request if one match can't be processed
      console.error(`Skipping match ${matchId}:`, (matchErr as Error).message);
    }
  }

  return summoner.id;
}

async function fetchSummonerWithParticipants(id: string) {
  return prisma.summoner.findUnique({
    where: { id },
    include: {
      rankedStats: true,
      participants: {
        include: { match: true, champion: true },
        orderBy: { match: { playedAt: 'desc' } },
        take: 20,
      },
    },
  });
}

export async function getSummonerByName(req: Request, res: Response, next: NextFunction) {
  try {
    const decodedName = decodeURIComponent(req.params.name);

    // Try cache first
    const cached = await prisma.summoner.findFirst({
      where: { name: { equals: decodedName, mode: 'insensitive' } },
      include: {
        rankedStats: true,
        participants: {
          include: { match: true, champion: true },
          orderBy: { match: { playedAt: 'desc' } },
          take: 20,
        },
      },
    });

    if (cached && !isStale(cached.updatedAt)) {
      return res.json({ data: { ...cached, mostPlayed: buildMostPlayed(cached.participants) } });
    }

    // Sync from Riot API
    const summonerId = await syncFromRiot(decodedName);
    const summoner = await fetchSummonerWithParticipants(summonerId);
    if (!summoner) return next(createError('Summoner not found', 404));

    return res.json({ data: { ...summoner, mostPlayed: buildMostPlayed(summoner.participants) } });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 404) return next(createError(`Summoner not found on ${(process.env.RIOT_PLATFORM ?? 'na1').toUpperCase()}`, 404));
      if (status === 403) return next(createError('Riot API key is invalid or expired — regenerate at developer.riotgames.com', 403));
      if (status === 429) return next(createError('Rate limit hit, try again in a moment', 429));
    }
    next(err);
  }
}

export async function getAllSummoners(req: Request, res: Response, next: NextFunction) {
  try {
    const { region, page = '1', limit = '20' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where = region ? { region: region as string } : {};
    const [summoners, total] = await Promise.all([
      prisma.summoner.findMany({ where, include: { rankedStats: true }, skip, take: Number(limit), orderBy: { name: 'asc' } }),
      prisma.summoner.count({ where }),
    ]);
    res.json({ data: summoners, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}

export async function searchSummoners(req: Request, res: Response, next: NextFunction) {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') return res.json({ data: [] });
    const summoners = await prisma.summoner.findMany({
      where: { name: { contains: q, mode: 'insensitive' } },
      include: { rankedStats: true },
      take: 10,
    });
    res.json({ data: summoners });
  } catch (err) {
    next(err);
  }
}
