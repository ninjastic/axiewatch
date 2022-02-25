import { useQuery } from 'react-query';

import { AxieClass } from 'src/types/api';
import { serverApi } from '../api';

export type AxieGeneType = 'd' | 'r2' | 'r1';

export interface AxieGene {
  partId: string;
  name: string;
  class: AxieClass;
  type: AxieGeneType;
}

export interface AxieSale {
  id: string;
  skin: string;
  cls: AxieClass;
  tag: string;
  region: string;
  back: Record<AxieGeneType, AxieGene>;
  ears: Record<AxieGeneType, AxieGene>;
  mouth: Record<AxieGeneType, AxieGene>;
  eyes: Record<AxieGeneType, AxieGene>;
  tail: Record<AxieGeneType, AxieGene>;
  horn: Record<AxieGeneType, AxieGene>;
  pattern: Record<AxieGeneType, string>;
}

export interface WalletTransactionSale {
  context: string;
  txHash: string;
  txTimestamp: number;
  sellerId: string;
  buyerId: string;
  price: number;
  axie: AxieSale;
}

export type APIWalletSalesResponse = Array<WalletTransactionSale>;

interface UseBatchWalletSalesData {
  data: WalletTransactionSale[];
  isLoading: boolean;
  isFetching: boolean;
}

interface UseBatchWalletSalesProps {
  addresses: string[];
  limit?: number;
  skip?: number;
  page?: number;
}

export const useBatchWalletSales = ({
  addresses,
  limit = 20,
  skip = 0,
  page = 1,
}: UseBatchWalletSalesProps): UseBatchWalletSalesData => {
  const { data, isLoading, isFetching } = useQuery(
    ['walletSales', addresses, limit, skip, page],
    async () => {
      const response = await serverApi.post<APIWalletSalesResponse>('/sales', {
        address: addresses,
        limit: limit * page,
        skip: limit * (page - 1),
      });

      return response.data;
    },
    {
      staleTime: 1000 * 60 * 15,
      keepPreviousData: true,
    }
  );

  return { isLoading, isFetching, data: data ?? [] };
};
