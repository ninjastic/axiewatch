import { Request, Response } from 'express';
import axios from 'axios';
import { cache } from '../services/cache';

async function getMatches(address: string) {
  const cacheKey = `@matches:${address}`;
  const cacheTime = 1000 * 60 * 15; // 15 minutes

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const params = {
    offset: 0,
    limit: 0,
  };

  const matchesResponse = await axios.get(`https://game-api.skymavis.com/game-api/clients/${address}/battles`, {
    params,
  });

  const { data } = matchesResponse;

  if (data) cache.set(cacheKey, JSON.stringify(data), 'PX', cacheTime);
  return data;
}

export class MatchesController {
  async get(req: Request, res: Response) {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'Missing address' });
    }

    const data = await getMatches(String(address));

    return res.json(data);
  }
}
