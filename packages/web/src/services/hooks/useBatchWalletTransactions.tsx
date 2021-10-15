import { useQueries, UseQueryOptions, UseQueryResult } from 'react-query';

import { serverApi } from '../api';

export function useBatchWalletTransactions(addresses: string[]) {
  const queries: UseQueryOptions[] = addresses.map(address => ({
    queryKey: ['walletTransactions', address],
    queryFn: async () => {
      const { data } = await serverApi.get(`/explorer/txs/${address}`, {
        params: {
          from: 0,
          size: 5,
        },
      });

      const dataWithContext = {
        ...data,
        results: data.results.map((tx: any) => ({ ...tx, context: address })),
      };

      return { address, transactions: dataWithContext };
    },
    staleTime: 1000 * 60 * 5,
  }));

  const results: UseQueryResult<any, any>[] = useQueries(queries);
  const isLoading = results.some(r => r.isLoading);

  return { isLoading, results };
}
