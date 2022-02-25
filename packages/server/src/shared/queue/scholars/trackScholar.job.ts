import { ethers } from 'ethers';

import Sync from 'models/Sync';
import Tracking from 'src/models/Tracking';
import { proxiedApi } from 'src/services/api';

interface ApiResponse {
  client_id: string;
  item_id: number;
  total: number;
  blockchain_related: {
    signature: {
      amount: number;
      timestamp: number;
    };
    balance: number;
    checkpoint: number;
    block_number: number;
  };
}

export const getUniqueAddresses = async (): Promise<string[]> => {
  const scholars: Array<{ address: string }> = await Sync.knex()
    .raw("SELECT DISTINCT jsonb_array_elements(data)->'address' as address FROM sync")
    .then(data => data.rows);

  const uniqueAddresses = scholars
    .map(scholar => {
      try {
        return ethers.utils.getAddress(scholar.address);
      } catch (error) {
        return null;
      }
    })
    .filter(value => value) as string[];

  return uniqueAddresses;
};

export const requestScholarData = async (address: string): Promise<ApiResponse> => {
  const endpoint = `https://game-api.skymavis.com/game-api/clients/${address}/items/1`;
  const response = await proxiedApi.get<ApiResponse>(endpoint);
  return response.data;
};

export const insertData = async (data: ApiResponse): Promise<Tracking> => {
  const { client_id, total, blockchain_related } = data;

  if (!data.client_id) {
    throw new Error('No client id');
  }

  return Tracking.query().insert({
    address: client_id,
    slpAmount: blockchain_related.checkpoint + total - blockchain_related.balance,
    arenaElo: 0,
  });
};

export const trackScholarJob = async (address: string): Promise<Tracking> => {
  const data = await requestScholarData(address);
  return insertData(data);
};
