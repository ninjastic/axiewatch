import { cache } from 'src/services/cache';
import { proxiedApi } from 'src/services/api';

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
  const cacheKey = `v1:scholarBattles:${address}`;
  const cacheTime = 1000 * 60 * 15; // 15 minutes

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const apiUrl = `https://tracking.skymavis.com/battle-history`;

  const apiBaseParams = {
    player_id: address,
    limit: 100,
  };

  const { data: pvp } = await proxiedApi
    .get<APIScholarResponse>(apiUrl, { params: { ...apiBaseParams, type: 'pvp' } })
    .catch(error => error.message);

  const { data: pve } = await proxiedApi
    .get<APIScholarResponse>(apiUrl, { params: { ...apiBaseParams, type: 'pve' } })
    .catch(error => error.message);

  const battles = [];

  if (pve?.battles) {
    battles.push(...pve.battles);
  }

  if (pvp?.battles) {
    battles.push(...pvp.battles);
  }

  const data = {
    battles: battles.sort((a, b) => {
      if (a.game_started > b.game_started) return -1;
      if (a.game_started < b.game_started) return 1;
      return 0;
    }),
  };

  await cache.set(cacheKey, JSON.stringify(data), 'PX', cacheTime);
  return data;
};
