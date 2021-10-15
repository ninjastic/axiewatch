import { Request, Response } from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { cache } from '../services/cache';
import { prisma } from '../services/prisma';
import { supabase } from '../services/supabase';

interface SyncScholar {
  address: string;
}

async function getDaily(address: string, authorization: string) {
  dayjs.extend(utc);
  const cacheKey = `@daily:${address}:days`;
  const cacheTime = 1000 * 60 * 5; // 5 minutes

  let isTracking: boolean | null = null;

  const { user } = await supabase.auth.api.getUser(authorization);

  if (user) {
    const tracking = await prisma.sync
      .findUnique({
        where: {
          user_id: user.id,
        },
      })
      .then(response =>
        (JSON.parse(response?.data || '[]') as SyncScholar[]).find(scholar => scholar.address === address)
      );

    isTracking = !!tracking;
  }

  const cached = await cache.get(cacheKey);
  if (cached) return { ...JSON.parse(cached), isTracking };

  const days = await prisma.tracking.findMany({
    where: {
      address,
      createdAt: {
        gte: dayjs.utc().subtract(14, 'day').startOf('day').toDate(),
      },
    },
    select: {
      slpAmount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const daysFormatted =
    days
      .map(entry => ({
        day: dayjs.utc(entry.createdAt).format('YYYY-MM-DD'),
        totalSlp: entry.slpAmount,
      }))
      .reverse() ?? [];

  const data = {
    dates: daysFormatted,
  };

  if (data) cache.set(cacheKey, JSON.stringify(data), 'PX', cacheTime);
  return { ...data, isTracking };
}

export class DailyController {
  async get(req: Request, res: Response) {
    const { address } = req.query;
    const authorization = req.get('authorization');

    if (!address) {
      return res.status(400).json({ error: 'Missing address' });
    }

    if (!address) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = await getDaily(String(address), String(authorization));

    return res.json(data);
  }
}
