import { cache } from 'src/services/cache';
import { proxiedApi } from 'src/services/api';

interface APIOldScholarPvpResponse {
  items: Array<{
    client_id: string;
    elo: number;
    rank: number;
    name: string;
  }>;
}

interface APIScholarPvpResponse {
  _items: Array<{
    clientID: string;
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

  const apiUrl = 'https://game-api-pre.skymavis.com/v1/leaderboards';
  const apiParams = {
    clientID: address,
    offset: 0,
    limit: 1,
  };

  const apiBackupUrl = 'https://game-api.skymavis.com/game-api/leaderboard';
  const apiBackupParams = {
    client_id: address,
    offset: 0,
    limit: 1,
  };

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const data = await proxiedApi
    .get<APIScholarPvpResponse>(apiUrl, { params: apiParams })
    .then(response => response.data._items.find(item => item.clientID.toLowerCase() === address.toLowerCase()));

  if (!data) {
    const dataBackup = await proxiedApi
      .get<APIOldScholarPvpResponse>(apiBackupUrl, { params: apiBackupParams })
      .then(response => response.data.items.find(item => item.client_id.toLowerCase() === address.toLowerCase()));

    if (!dataBackup) {
      throw new Error('Something went wrong');
    }

    const scholarPvp = {
      name: dataBackup.name,
      elo: dataBackup.elo,
      rank: dataBackup.rank,
    };

    await cache.set(cacheKey, JSON.stringify(scholarPvp), 'PX', cacheTime);
    return scholarPvp;
  }

  const scholarPvp = {
    name: data.name,
    elo: data.elo,
    rank: data.rank,
  };

  await cache.set(cacheKey, JSON.stringify(scholarPvp), 'PX', cacheTime);
  return scholarPvp;
};
