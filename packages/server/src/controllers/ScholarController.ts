import { Request, Response } from 'express';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { cache } from '../services/cache';
import { prisma } from '../services/prisma';

async function getDaily(address: string) {
  dayjs.extend(utc);
  const cacheKey = `@daily:${address}`;
  const cacheTime = 1000 * 60 * 5; // 5 minutes

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const dates = await prisma.tracking
    .findMany({
      where: {
        address,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 14,
    })
    .then(data =>
      data.reverse().map(entry => ({
        day: dayjs.utc(entry.createdAt).format('YYYY-MM-DD'),
        totalSlp: entry.slpAmount,
      }))
    );

  const yesterdayData = dates.find(date => {
    const day = dayjs.utc(date.day).startOf('day').unix();
    const yesterday = dayjs.utc().subtract(1, 'day').startOf('day').unix();
    const today = dayjs.utc().startOf('day').unix();
    if (day === yesterday && day < today) return true;
    return false;
  });

  const todayData = dates.find(date => {
    const day = dayjs.utc(date.day).startOf('day').unix();
    const today = dayjs.utc().startOf('day').startOf('day').unix();
    if (day >= today) return true;
    return false;
  });

  const data = {
    dates,
    yesterday: yesterdayData,
    today: todayData,
  };

  if (data) cache.set(cacheKey, JSON.stringify(data), 'PX', cacheTime);
  return data;
}

async function getPvp(address: string) {
  const cacheKey = `@scholar:${address}:pvp`;
  const cacheTime = 1000 * 60 * 15; // 15 minutes

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const params = {
    client_id: address,
    offset: 0,
    limit: 1,
  };

  const pvpResponse = await axios
    .get(`https://game-api.skymavis.com/game-api/leaderboard`, { params })
    .catch(() => null);

  const data =
    pvpResponse?.data.items.find((item: any) => item.client_id.toLowerCase() === String(address).toLowerCase()) ?? null;

  if (data) cache.set(cacheKey, JSON.stringify(data), 'PX', cacheTime);
  return data;
}

async function getScholar(address: string) {
  const cacheKey = `@scholar:${address}`;
  const cacheTime = 1000 * 60 * 15; // 15 minutes

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  try {
    const scholarResponse = await axios.get(`https://game-api.skymavis.com/game-api/clients/${address}/items/1`);

    const { data } = scholarResponse;

    if (data) cache.set(cacheKey, JSON.stringify(data), 'PX', cacheTime);
    return data;
  } catch (error) {
    return null;
  }
}

export class ScholarController {
  async get(req: Request, res: Response) {
    const { address, pvp, slp } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'Missing address' });
    }

    const scholarData = await getScholar(String(address));

    if (!scholarData) {
      return res.status(500).json({ error: 'Something went wrong' });
    }

    const pvpData = pvp === 'true' ? await getPvp(String(address)) : null;
    const dailyData = slp === 'true' ? await getDaily(String(address)) : null;

    const data = {
      scholar: scholarData,
      pvp: pvpData,
      slp: dailyData,
    };

    return res.json(data);
  }
}
