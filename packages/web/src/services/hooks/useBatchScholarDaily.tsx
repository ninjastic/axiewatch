import { useQueries, UseQueryOptions, UseQueryResult } from 'react-query';

import { APIScholarResponseSlpDate } from '../../types/api';
import { serverApi } from '../api';

interface ScholarDailyResponse {
  dates: APIScholarResponseSlpDate[];
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
    retry: (count: number) => {
      if (count >= 3) {
        return false;
      }

      return true;
    },
  }));

  const results = useQueries(queries) as UseQueryResult<ScholarDailyResult>[];
  const isLoading = results.some(r => r.isLoading);

  return { isLoading, results };
};
