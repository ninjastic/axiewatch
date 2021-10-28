import { useQueries, UseQueryOptions, UseQueryResult } from 'react-query';
import { atom, useRecoilCallback, useRecoilState } from 'recoil';
import { useCallback, useMemo } from 'react';

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
  isError: boolean;
  refetchAll: () => void;
  results: UseQueryResult<APIScholarResponse>[];
}

const erroredAtom = atom<string[]>({
  key: 'erroredAtom',
  default: [],
});

export const useBatchScholar = ({ addresses, enabled = true }: UseBatchScholarProps): UseBatchScholarData => {
  const [errored, setErrored] = useRecoilState(erroredAtom);

  const setScholarState = useRecoilCallback(({ set, snapshot }) => (scholar: ScholarSetter) => {
    const prevState = snapshot.getLoadable(scholarState(scholar.address)).getValue();
    set(scholarState(scholar.address), { ...prevState, ...scholar });
  });

  const queries: UseQueryOptions[] = addresses.map(address => ({
    queryKey: ['scholar', address],
    queryFn: async () => {
      const { data } = await serverApi.get<APIScholarResponse>('/scholar', {
        params: { address },
      });

      const scholarData = parseScholarData({ data });
      setScholarState({ address, ...scholarData });

      return data;
    },
    enabled: enabled && !errored.includes(address),
    onError: () => setErrored(prev => [...prev, address]),
    staleTime: 1000 * 60 * 15,
    retry: false,
  }));

  const results = useQueries(queries) as UseQueryResult<APIScholarResponse>[];
  const isLoading = useMemo(() => results.some(r => r.isLoading), [results]);
  const isError = useMemo(() => results.every(r => r.isError), [results]);

  const refetchAll = useCallback(() => {
    results.forEach(result => result.refetch());
  }, [results]);

  return { isLoading, isError, refetchAll, results };
};
