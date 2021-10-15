import axios from 'axios';
import { ethers } from 'ethers';
import { prisma } from '../services/prisma';

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

interface SyncData {
  name: string;
  address: string;
  paymentAddress: string;
  shares: {
    manager: number;
    scholar: number;
  };
}

export async function getUniqueAddresses() {
  const syncEntries = await prisma.sync.findMany();

  const raw = syncEntries.map(sync => {
    const scholars: SyncData[] = JSON.parse(sync.data);
    return scholars.map(scholar => scholar.address);
  });

  const addresses = ([] as string[]).concat
    .apply([], raw)
    .map(address => address.toLowerCase())
    .reduce((unique, item) => (unique.includes(item) ? unique : [...unique, item]), [] as string[])
    .map(address => {
      try {
        return ethers.utils.getAddress(address);
      } catch (error) {
        return null;
      }
    })
    .filter(v => v);

  return addresses;
}

export async function requestScholarData(address: string) {
  const endpoint = `https://game-api.skymavis.com/game-api/clients/${address}/items/1`;
  const response = await axios.get<ApiResponse>(endpoint);
  return response.data;
}

export async function insertData(data: ApiResponse) {
  const { client_id, total, blockchain_related } = data;

  return prisma.tracking.create({
    data: {
      address: client_id,
      slpAmount: blockchain_related.checkpoint + total - blockchain_related.balance,
      arenaElo: 0,
    },
  });
}

export async function trackScholarJob(address: string) {
  const data = await requestScholarData(address);
  return insertData(data);
}
