import { useQueries, UseQueryOptions, UseQueryResult } from 'react-query';

import { ScholarHistoricalDate } from '../../types/api';
import { serverApi } from '../api';

interface ScholarDailyResponse {
  dates: ScholarHistoricalDate[];
  isTracking: boolean | null;
}

interface ScholarDailyResult extends ScholarDailyResponse {
  address: string;
}

interface useBatchScholarDailyProps {
  addresses: string[];
}

interface UseBatchScholarData {
  isLoading: boolean;
  results: UseQueryResult<ScholarDailyResult>[];
}

export const useBatchScholarDaily = ({ addresses }: useBatchScholarDailyProps): UseBatchScholarData => {
  const queries: UseQueryOptions[] = addresses.map(address => ({
    queryKey: ['daily', address],
    queryFn: async () => {
      const { data } = await serverApi.get<ScholarDailyResponse>('/daily', {
        params: { address },
      });

      return { ...data, address };
    },
    staleTime: 1000 * 60 * 15,
  }));

  const results = useQueries(queries) as UseQueryResult<ScholarDailyResult>[];
  const isLoading = results.some(r => r.isLoading);

  return { isLoading, results };
};
