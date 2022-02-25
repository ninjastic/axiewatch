import { cache } from 'src/services/cache';
import { proxiedApi } from 'src/services/api';

export const getExplorerTx = async (address: string): Promise<any> => {
  const cacheKey = `v1:explorer:${address}`;
  const cacheTime = 1000 * 60 * 15; // 15 minutes
  const apiUrl = `https://explorer.roninchain.com/api/txs/${address}`;
  const params = {
    from: 0,
    size: 50,
  };

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const { data } = await proxiedApi.get<any>(apiUrl, { params });

  await cache.set(cacheKey, JSON.stringify(data), 'PX', cacheTime);
  return data;
};
