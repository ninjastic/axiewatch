import axios from 'axios';

import { cache } from 'src/services/cache';

interface APIGameStatusResponse {
  sm: {
    from: number;
    to: number;
    message: string;
  };
}

export interface ScholarData {
  from: number;
  to: number;
  message: string;
}

export const getGameStatus = async (): Promise<ScholarData> => {
  const cacheKey = 'v1:status';
  const cacheTime = 1000 * 60 * 1; // 1 minute
  const apiUrl =
    'https://storage.googleapis.com/axie-game-assets/dlc-central/axie-battle/remote-config/appversion-prod.json';

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const { data } = await axios.get<APIGameStatusResponse>(apiUrl);

  const status = {
    from: data.sm.from,
    to: data.sm.to,
    message: data.sm.message,
  };

  await cache.set(cacheKey, JSON.stringify(status), 'PX', cacheTime);
  return status;
};
