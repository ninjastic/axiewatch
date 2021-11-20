import { useQuery } from 'react-query';
import { useRecoilTransaction_UNSTABLE } from 'recoil';
import { useEffect } from 'react';

import { APIScholarResponse } from '../../types/api';
import { serverApi } from '../api';
import { scholarState, ScholarState } from '../../recoil/scholars';
import { ParsedScholarData, parseScholarData } from '../utils/parseScholarData';

type ScholarSetter = Partial<ScholarState> & { address: string };

interface UseBatchScholarData {
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  isRefetching: boolean;
  data: ParsedScholarData[];
}

interface UseBatchScholarProps {
  addresses: string[];
  enabled?: boolean;
}

export const useBatchScholar = ({ addresses, enabled }: UseBatchScholarProps): UseBatchScholarData => {
  const setBatchScholarData = useRecoilTransaction_UNSTABLE(({ set, get }) => (scholars: ScholarSetter[]) => {
    return scholars.forEach(scholar => {
      const prevState = get(scholarState(scholar.address));
      set(scholarState(scholar.address), { ...prevState, ...scholar });
    });
  });

  const { isLoading, isRefetching, isError, refetch, data } = useQuery(
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
      enabled: enabled && !!addresses.length,
      staleTime: 1000 * 60 * 15,
    }
  );

  useEffect(() => {
    if (data) {
      setBatchScholarData(data);
    }
  }, [data, setBatchScholarData]);

  return { isLoading, isError, refetch, isRefetching, data: data ?? [] };
};
