import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export async function getMatchById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const match = await prisma.match.findFirst({
      where: { OR: [{ id }, { gameId: id }] },
      include: {
        participants: {
          include: {
            summoner: true,
            champion: true,
          },
        },
      },
    });

    if (!match) {
      return next(createError(`Match "${id}" not found`, 404));
    }

    res.json({ data: match });
  } catch (err) {
    next(err);
  }
}

export async function getRecentMatches(req: Request, res: Response, next: NextFunction) {
  try {
    const { limit = '10' } = req.query;

    const matches = await prisma.match.findMany({
      include: {
        participants: {
          include: { summoner: true, champion: true },
          take: 2,
        },
      },
      orderBy: { playedAt: 'desc' },
      take: Number(limit),
    });

    res.json({ data: matches });
  } catch (err) {
    next(err);
  }
}
