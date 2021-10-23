import axios from 'axios';
import { ethers } from 'ethers';

import Sync from '@models/Sync';
import Tracking from '@src/models/Tracking';

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
  const syncs = await Sync.query();

  const addresses = syncs.reduce((array, sync) => {
    const draft = [...array];

    sync.data.forEach(scholar => {
      draft.push(scholar.address);
    });

    return draft;
  }, [] as string[]);

  const uniqueAddresses = addresses
    .reduce((unique, item) => (unique.includes(item) ? unique : [...unique, item]), [] as string[])
    .map(address => {
      try {
        return ethers.utils.getAddress(address);
      } catch (error) {
        return null;
      }
    })
    .filter(value => value) as string[];

  return uniqueAddresses;
};

export const requestScholarData = async (address: string): Promise<ApiResponse> => {
  const endpoint = `https://game-api.skymavis.com/game-api/clients/${address}/items/1`;
  const response = await axios.get<ApiResponse>(endpoint);
  return response.data;
};

export const insertData = async (data: ApiResponse): Promise<Tracking> => {
  const { client_id, total, blockchain_related } = data;

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
