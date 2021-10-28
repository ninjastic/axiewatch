import axios from 'axios';

import { cache } from '@src/services/cache';

interface APIScholarResponse {
  items: Array<{
    id: string;
    first_cliend_id: string;
    first_team_id: string;
    second_client_id: string;
    second_team_id: string;
    winner: number;
    created_at: string;
    battle_uuid: string;
    battle_type: string;
    fighters: Array<{
      team_id: string;
      fighter_id: number;
      fighter_class: string;
      fighter_level: number;
    }>;
  }>;
}

export const getScholarBattles = async (address: string): Promise<APIScholarResponse> => {
  const cacheKey = `v1:scholarBattles:${address}`;
  const cacheTime = 1000 * 60 * 15; // 15 minutes
  const apiUrl = `https://game-api.skymavis.com/game-api/clients/${address}/battles`;
  const apiParams = {
    offset: 0,
    limit: 0,
  };

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const { data } = await axios.get<APIScholarResponse>(apiUrl, { params: apiParams }).catch(error => error.message);

  await cache.set(cacheKey, JSON.stringify(data), 'PX', cacheTime);
  return data;
};
