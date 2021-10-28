import axios from 'axios';

import { cache } from '@src/services/cache';

interface APIScholarPvpResponse {
  items: Array<{
    client_id: string;
    elo: number;
    rank: number;
    name: string;
  }>;
}

export interface ScholarPvpData {
  name: string;
  elo: number;
  rank: number;
}

export const getScholarPvp = async (address: string): Promise<ScholarPvpData> => {
  const cacheKey = `v1:scholarPvp:${address}`;
  const cacheTime = 1000 * 60 * 15; // 15 minutes
  const apiUrl = 'https://game-api.skymavis.com/game-api/leaderboard';
  const apiParams = {
    client_id: address,
    offset: 0,
    limit: 1,
  };

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const data = await axios
    .get<APIScholarPvpResponse>(apiUrl, { params: apiParams })
    .then(response => response.data.items.find(item => item.client_id.toLowerCase() === address.toLowerCase()));

  if (!data) {
    throw new Error('Something went wrong');
  }

  const scholarPvp = {
    name: data.name,
    elo: data.elo,
    rank: data.rank,
  };

  await cache.set(cacheKey, JSON.stringify(scholarPvp), 'PX', cacheTime);
  return scholarPvp;
};
