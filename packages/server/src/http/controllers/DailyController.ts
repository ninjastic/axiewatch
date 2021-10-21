import { Request, Response } from 'express';

import dayjs from '@src/services/dayjs';
import { cache } from '@src/services/cache';
import { supabase } from '@src/services/supabase';
import Sync from '@src/models/Sync';
import Tracking from '@src/models/Tracking';

async function getDaily(address: string, authorization: string) {
  const cacheKey = `@daily:${address}:days`;
  const cacheTime = 1000 * 60 * 5; // 5 minutes

  let isTracking: boolean | null = null;

  const { user } = await supabase.auth.api.getUser(authorization);

  if (user) {
    isTracking = !!(await Sync.query()
      .select('id')
      .where('user_id', user.id)
      .then(response => response));
  }

  const cached = await cache.get(cacheKey);
  if (cached) return { ...JSON.parse(cached), isTracking };

  const days = await Tracking.query()
    .select('slpAmount', 'createdAt')
    .where('address', address)
    .andWhere('createdAt', '>=', dayjs.utc().subtract(14, 'day').startOf('day').toDate())
    .orderBy('createdAt', 'DESC');

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
  async get(req: Request, res: Response): Promise<Response> {
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
