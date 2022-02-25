import { cache } from 'src/services/cache';
import { proxiedApi } from 'src/services/api';
import AppError from 'src/shared/errors/AppError';

interface APIScholarResponse {
  client_id: string;
  total: number;
  blockchain_related: {
    balance: number;
    checkpoint: number;
  };
  claimable_total: number;
  last_claimed_item_at: number;
  raw_total: number;
  raw_claimable_total: number;
}

export interface ScholarData {
  slp: number;
  roninSlp: number;
  totalSlp: number;
  lastClaim: number;
}

export const getScholar = async (address: string): Promise<ScholarData> => {
  const cacheKey = `v1:scholar:${address}`;
  const cacheTime = 1000 * 60 * 15; // 15 minutes
  const apiBackupUrl = `https://game-api.skymavis.com/game-api/clients/${address}/items/1`;

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const data: APIScholarResponse = await proxiedApi
    .get<APIScholarResponse>(apiBackupUrl)
    .then(res => res.data)
    .catch(error => error.message);

  if (!data) {
    throw new AppError('No scholar data');
  }

  const scholar = {
    slp: data.raw_total - data.raw_claimable_total,
    roninSlp: data.blockchain_related.balance,
    totalSlp: data.total + data.blockchain_related.checkpoint - data.blockchain_related.balance,
    lastClaim: data.last_claimed_item_at,
  };

  await cache.set(cacheKey, JSON.stringify(scholar), 'PX', cacheTime);
  return scholar;
};
