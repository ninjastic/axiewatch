import { Request, Response } from 'express';
import axios from 'axios';
import { cache } from '../services/cache';

async function getPve(address: string) {
  const cacheKey = `@pve:${address}`;
  const cacheTime = 1000 * 60 * 15; // 15 minutes

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const params = {
    offset: 0,
    limit: 0,
  };

  const pvpResponse = await axios.get(
    `https://game-api.skymavis.com/game-api/clients/${address}/pve-best-scores/worlds/1/pve-stats`,
    { params }
  );

  const { data } = pvpResponse;

  if (data) cache.set(cacheKey, JSON.stringify(data), 'PX', cacheTime);
  return data;
}

export class PveController {
  async get(req: Request, res: Response) {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'Missing address' });
    }

    const data = await getPve(String(address));

    return res.json(data);
  }
}
