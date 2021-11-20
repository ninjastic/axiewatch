import dayjs from '@src/services/dayjs';
import { cache } from '@src/services/cache';
import { proxiedApi } from '@src/services/api';

interface APIScholarResponse {
  client_id: string;
  total: number;
  blockchain_related: {
    balance: number;
    checkpoint: number;
  };
  claimable_total: number;
  last_claimed_item_at: number;
}

export interface ScholarData {
  slp: number;
  roninSlp: number;
  totalSlp: number;
  lastClaim: number;
}

export const getScholar = async (address: string): Promise<ScholarData> => {
  const day = dayjs().day();
  const cacheKey = `v1:scholar:${address}:${day}`;
  const cacheTime = 1000 * 60 * 15; // 15 minutes
  const apiUrl = `https://game-api.skymavis.com/game-api/clients/${address}/items/1`;

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const { data } = await proxiedApi.get<APIScholarResponse>(apiUrl).catch(error => error.message);

  const scholar = {
    slp: Math.abs(data.total - data.blockchain_related.balance),
    roninSlp: data.blockchain_related.balance,
    totalSlp: data.total + data.blockchain_related.checkpoint - data.blockchain_related.balance,
    lastClaim: data.last_claimed_item_at,
  };

  await cache.set(cacheKey, JSON.stringify(scholar), 'PX', cacheTime);
  return scholar;
};
