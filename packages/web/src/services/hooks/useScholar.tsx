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
        params: { address },
      });

      return response.data;
    },
    {
      staleTime: 1000 * 60 * 15,
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
  }, [address, result, result.data, scholarParseOptions.includeTodayOnAverageSlp, setScholarState]);

  return result;
};
