import { useMemo } from 'react';
import { useQueries, UseQueryOptions, UseQueryResult } from 'react-query';

import { serverApi } from '../api';

interface UseBatchWalletTransactionsData {
  isLoading: boolean;
  results: UseQueryResult<any, any>[];
  totalTransactions: number;
}

export const useBatchWalletTransactions = (addresses: string[]): UseBatchWalletTransactionsData => {
  const queries: UseQueryOptions[] = addresses.map(address => ({
    queryKey: ['walletTransactions', address],
    queryFn: async () => {
      const { data } = await serverApi.get(`/explorer/txs/${address}`, {
        params: {
          from: 0,
          size: 50,
        },
        timeout: 1000 * 60 * 1,
      });

      const dataWithContext = {
        ...data,
        results: data.results.map((tx: any) => ({ ...tx, context: address })),
      };

      return { address, transactions: dataWithContext };
    },
    staleTime: Infinity,
    refetchOnMount: 'always',
  }));

  const results: UseQueryResult<any, any>[] = useQueries(queries);
  const isLoading = useMemo(() => results.some(r => r.isLoading), [results]);

  const totalTransactions = useMemo(
    () => results.filter(r => r.isSuccess).reduce((total, curr) => total + curr.data.transactions.total, 0),
    [results]
  );

  return { isLoading, results, totalTransactions };
};
