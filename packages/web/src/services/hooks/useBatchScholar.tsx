import { useQueries, UseQueryOptions, UseQueryResult } from 'react-query';
import { useRecoilCallback } from 'recoil';

import { APIScholarResponse } from '../../types/api';
import { serverApi } from '../api';
import { scholarState, ScholarState } from '../../recoil/scholars';
import { parseScholarData } from '../utils/parseScholarData';

type ScholarSetter = Partial<ScholarState> & { address: string };

interface UseBatchScholarProps {
  addresses: string[];
  enabled?: boolean;
}

interface UseBatchScholarData {
  isLoading: boolean;
  results: UseQueryResult<APIScholarResponse>[];
}

export const useBatchScholar = ({ addresses, enabled = true }: UseBatchScholarProps): UseBatchScholarData => {
  const setScholarState = useRecoilCallback(({ set, snapshot }) => (scholar: ScholarSetter) => {
    const prevState = snapshot.getLoadable(scholarState(scholar.address)).getValue();
    set(scholarState(scholar.address), { ...prevState, ...scholar });
  });

  const queries: UseQueryOptions[] = addresses.map(address => ({
    queryKey: ['scholar', address],
    queryFn: async () => {
      const { data } = await serverApi.get<APIScholarResponse>('/scholar', {
        params: { address, pvp: true, slp: true },
      });

      const scholarData = parseScholarData({ data });
      setScholarState({ address, ...scholarData });

      return data;
    },
    enabled,
    staleTime: 1000 * 60 * 15,
    retry: (count: number) => {
      if (count >= 3) {
        setScholarState({ address, errored: true });
        return false;
      }

      return true;
    },
  }));

  const results = useQueries(queries) as UseQueryResult<APIScholarResponse>[];
  const isLoading = results.some(r => r.isLoading);

  return { isLoading, results };
};
