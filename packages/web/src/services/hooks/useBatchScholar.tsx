import { useQuery } from 'react-query';
import { useRecoilTransaction_UNSTABLE } from 'recoil';
import { useEffect } from 'react';

import { APIScholarResponse } from '../../types/api';
import { serverApi } from '../api';
import { scholarState, ScholarState } from '../../recoil/scholars';
import { parseScholarData } from '../utils/parseScholarData';

type ScholarSetter = Partial<ScholarState> & { address: string };

interface UseBatchScholarData {
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  isFetching: boolean;
  isRefetching: boolean;
  data: ScholarState[];
}

interface UseBatchScholarProps {
  addresses: string[];
  enabled?: boolean;
}

export const useBatchScholar = ({ addresses, enabled }: UseBatchScholarProps): UseBatchScholarData => {
  const setBatchScholarData = useRecoilTransaction_UNSTABLE(({ set }) => (scholars: ScholarSetter[]) => {
    return scholars.forEach(scholar => {
      set(scholarState(scholar.address), prev => ({ ...prev, ...scholar }));
    });
  });

  const { isLoading, isFetching, isRefetching, isError, refetch, data } = useQuery(
    ['scholars', addresses],
    async () => {
      const response = await serverApi.post<APIScholarResponse[]>('/batch-scholar', {
        addresses,
      });

      const parsedScholars = response.data.map(result => {
        const parsed = parseScholarData({ data: result });
        return parsed;
      });

      return parsedScholars;
    },
    {
      enabled: enabled && addresses.length > 0,
      staleTime: 1000 * 60 * 15,
    }
  );

  useEffect(() => {
    if (data) {
      setBatchScholarData(data);
    }
  }, [data, setBatchScholarData]);

  return { isLoading, isError, refetch, isRefetching, isFetching, data: data ?? [] };
};
