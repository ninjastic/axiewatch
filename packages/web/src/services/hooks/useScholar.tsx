import { useQuery, UseQueryResult } from 'react-query';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { useEffect } from 'react';

import { APIScholarResponse } from '../../types/api';
import { serverApi } from '../api';
import { parseScholarData } from '../utils/parseScholarData';
import { scholarParseOptionsAtom, ScholarState, scholarState } from '../../recoil/scholars';

type ScholarSetter = Partial<ScholarState> & { address: string };

interface UseScholarProps {
  address: string;
}

export const useScholar = ({ address }: UseScholarProps): UseQueryResult<APIScholarResponse> => {
  const scholarParseOptions = useRecoilValue(scholarParseOptionsAtom);

  const setScholarState = useRecoilCallback(({ set, snapshot }) => (scholar: ScholarSetter) => {
    const prevState = snapshot.getLoadable(scholarState(scholar.address)).getValue();
    set(scholarState(scholar.address), { ...prevState, ...scholar });
  });

  const result = useQuery(
    ['scholar', address],
    async () => {
      const response = await serverApi.get<APIScholarResponse>('/scholar', {
        params: { address, pvp: true, slp: true },
      });

      return response.data;
    },
    {
      staleTime: 1000 * 60 * 15,
      retry: (count: number) => {
        if (count >= 3) {
          setScholarState({ address, errored: true });
          return false;
        }
        return true;
      },
    }
  );

  useEffect(() => {
    if (result.data) {
      const scholarData = parseScholarData({
        data: result.data,
        options: {
          includeTodayOnAverageSlp: scholarParseOptions.includeTodayOnAverageSlp,
        },
      });
      setScholarState({ address, ...scholarData });
    }
  }, [result.data, scholarParseOptions.includeTodayOnAverageSlp]);

  return result;
};
