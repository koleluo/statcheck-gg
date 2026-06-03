import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export async function getAllSummoners(req: Request, res: Response, next: NextFunction) {
  try {
    const { region, page = '1', limit = '20' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = region ? { region: region as string } : {};

    const [summoners, total] = await Promise.all([
      prisma.summoner.findMany({
        where,
        include: { rankedStats: true },
        skip,
        take: Number(limit),
        orderBy: { name: 'asc' },
      }),
      prisma.summoner.count({ where }),
    ]);

    res.json({ data: summoners, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}

export async function getSummonerByName(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.params;
    const decodedName = decodeURIComponent(name);

    const summoner = await prisma.summoner.findFirst({
      where: { name: { equals: decodedName, mode: 'insensitive' } },
      include: {
        rankedStats: true,
        participants: {
          include: {
            match: true,
            champion: true,
          },
          orderBy: { match: { playedAt: 'desc' } },
          take: 20,
        },
      },
    });

    if (!summoner) {
      return next(createError(`Summoner "${decodedName}" not found`, 404));
    }

    const participantsBySummonerId = summoner.participants;
    const championPlayCount: Record<string, { count: number; wins: number; kills: number; deaths: number; assists: number; champion: typeof participantsBySummonerId[0]['champion'] }> = {};

    for (const p of participantsBySummonerId) {
      const cid = p.championId;
      if (!championPlayCount[cid]) {
        championPlayCount[cid] = { count: 0, wins: 0, kills: 0, deaths: 0, assists: 0, champion: p.champion };
      }
      championPlayCount[cid].count++;
      if (p.win) championPlayCount[cid].wins++;
      championPlayCount[cid].kills += p.kills;
      championPlayCount[cid].deaths += p.deaths;
      championPlayCount[cid].assists += p.assists;
    }

    const mostPlayed = Object.values(championPlayCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((c) => ({
        champion: c.champion,
        games: c.count,
        winRate: Math.round((c.wins / c.count) * 100),
        kda: ((c.kills + c.assists) / Math.max(c.deaths, 1)).toFixed(2),
      }));

    res.json({ data: { ...summoner, mostPlayed } });
  } catch (err) {
    next(err);
  }
}

export async function searchSummoners(req: Request, res: Response, next: NextFunction) {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.json({ data: [] });
    }

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
