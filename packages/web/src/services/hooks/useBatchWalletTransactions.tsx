import { useQuery } from 'react-query';

import { APIBatchExplorerResponse, ExplorerTransaction } from 'src/types/api';
import { serverApi } from '../api';

export type WalletTransaction = ExplorerTransaction & {
  context: string;
};

interface UseBatchWalletTransactionsData {
  data: WalletTransaction[];
  isLoading: boolean;
  isFetching: boolean;
}

export const useBatchWalletTransactions = (addresses: string[]): UseBatchWalletTransactionsData => {
  const { data, isLoading, isFetching } = useQuery(
    ['walletTransactions', addresses],
    async () => {
      const response = await serverApi.post<APIBatchExplorerResponse[]>('/batch-explorer', {
        addresses,
      });

      return response.data.reduce(
        (_txs, curr) => [..._txs, ...curr.results.map(result => ({ context: curr.address, ...result }))],
        []
      );
    },
    {
      staleTime: 1000 * 60 * 10,
    }
  );

  return { isLoading, isFetching, data: data ?? [] };
};
