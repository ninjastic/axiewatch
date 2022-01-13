import { cache } from '@src/services/cache';
import { proxiedApi } from '@src/services/api';
import AppError from '@src/shared/errors/AppError';

interface APIOldScholarResponse {
  client_id: string;
  total: number;
  blockchain_related: {
    balance: number;
    checkpoint: number;
  };
  claimable_total: number;
  last_claimed_item_at: number;
}

// interface APIScholarResponse {
//   _items: Array<{
//     clientID: string;
//     total: number;
//     blockchainRelated: {
//       balance: number;
//       checkpoint: number;
//     };
//     claimableTotal: number;
//     lastClaimedItemAt: number;
//   }>;
// }

export interface ScholarData {
  slp: number;
  roninSlp: number;
  totalSlp: number;
  lastClaim: number;
}

export const getScholar = async (address: string): Promise<ScholarData> => {
  const cacheKey = `v1:scholar:${address}`;
  const cacheTime = 1000 * 60 * 15; // 15 minutes
  // const apiUrl = `https://game-api-pre.skymavis.com/v1/players/${address}/items`;
  const apiBackupUrl = `https://game-api.skymavis.com/game-api/clients/${address}/items/1`;

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // const data: APIScholarResponse = await proxiedApi
  //   .get<APIScholarResponse>(apiUrl)
  //   .then(res => res.data)
  //   .catch(error => error.message);

  // const scholarData = data._items.find(scholar => scholar.clientID.toLowerCase() === address.toLowerCase());

  // if (!scholarData) {
  const dataBackup: APIOldScholarResponse = await proxiedApi
    .get<APIOldScholarResponse>(apiBackupUrl)
    .then(res => res.data)
    .catch(error => error.message);

  if (!dataBackup) {
    throw new AppError('No scholar data');
  }

  const scholar = {
    slp: Math.abs(dataBackup.total - dataBackup.claimable_total - dataBackup.blockchain_related.balance),
    roninSlp: dataBackup.blockchain_related.balance,
    totalSlp: dataBackup.total + dataBackup.blockchain_related.checkpoint - dataBackup.blockchain_related.balance,
    lastClaim: dataBackup.last_claimed_item_at,
  };

  await cache.set(cacheKey, JSON.stringify(scholar), 'PX', cacheTime);
  return scholar;
  // };

  //   slp: Math.abs(scholarData.total - scholarData.claimableTotal - scholarData.blockchainRelated.balance),
  //   roninSlp: scholarData.blockchainRelated.balance,
  //   totalSlp: scholarData.total + scholarData.blockchainRelated.checkpoint - scholarData.blockchainRelated.balance,
  //   lastClaim: scholarData.lastClaimedItemAt,
  // };
  // await cache.set(cacheKey, JSON.stringify(scholar), 'PX', cacheTime);
  // return scholar;
};
