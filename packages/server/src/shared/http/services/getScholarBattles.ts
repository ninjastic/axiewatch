import { cache } from '@src/services/cache';
import { proxiedApi } from '@src/services/api';

interface APIScholarResponse {
  battles: Array<{
    battle_uuid: string;
    game_started: string;
    game_ended: string;
    winner: string;
    client_id: string;
    team_id: string;
    fighters: Array<{
      id: number;
      level: number;
    }>;
    stage_index: number;
    total_scenes: number;
    last_scene_index: number;
    exp: number;
    _items: Array<{
      item_id: number;
      amount: number;
      flag: number;
    }>;
    first_client_id: string;
    second_client_id: string;
    eloAndItem: Array<{
      player_id: string;
      new_elo: number;
      old_elo: number;
      result_type: string;
      _items: Array<{
        item_id: number;
        amount: number;
        flag: number;
      }>;
    }>;
  }>;
}

export const getScholarBattles = async (address: string): Promise<APIScholarResponse> => {
  const cacheKey = `v1:scholarBattles:${address}:pvp`;
  const cacheTime = 1000 * 60 * 15; // 15 minutes
  const apiUrl = `https://tracking.skymavis.com/battle-history`;
  const apiParams = {
    player_id: address,
    type: 'pvp',
  };

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const { data } = await proxiedApi
    .get<APIScholarResponse>(apiUrl, { params: apiParams })
    .catch(error => error.message);

  await cache.set(cacheKey, JSON.stringify(data), 'PX', cacheTime);
  return data;
};
