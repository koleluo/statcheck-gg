import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export async function getAllChampions(req: Request, res: Response, next: NextFunction) {
  try {
    const { sort = 'winRate', order = 'desc', search, tag, page = '1', limit = '50' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {};
    if (search && typeof search === 'string') {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (tag && typeof tag === 'string') {
      where.tags = { has: tag };
    }

    const validSortFields = ['winRate', 'pickRate', 'banRate', 'avgKda', 'avgCs', 'name'];
    const sortField = validSortFields.includes(sort as string) ? (sort as string) : 'winRate';

    const orderBy = sortField === 'name'
      ? { name: order as 'asc' | 'desc' }
      : { stats: { [sortField]: order as 'asc' | 'desc' } };

    const [champions, total] = await Promise.all([
      prisma.champion.findMany({
        where,
        include: { stats: true },
        orderBy,
        skip,
        take: Number(limit),
      }),
      prisma.champion.count({ where }),
    ]);

    res.json({ data: champions, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}

export async function getChampionById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const champion = await prisma.champion.findFirst({
      where: {
        OR: [{ id }, { riotId: { equals: id, mode: 'insensitive' } }],
      },
      include: {
        stats: true,
        participants: {
          include: { match: true, summoner: true },
          orderBy: { match: { playedAt: 'desc' } },
          take: 10,
        },
      },
    });

    if (!champion) {
      return next(createError(`Champion "${id}" not found`, 404));
    }

    res.json({ data: champion });
  } catch (err) {
    next(err);
  }
}
