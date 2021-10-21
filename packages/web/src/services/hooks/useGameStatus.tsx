import { useQuery, UseQueryResult } from 'react-query';

import { APIGameStatusResponse } from '../../types/api';
import { serverApi } from '../api';

export const useGameStatus = (): UseQueryResult<APIGameStatusResponse> => {
  const result = useQuery(
    'status',
    async () => {
      const { data } = await serverApi.get<APIGameStatusResponse>('/status');

      return data;
    },
    {
      staleTime: 1000 * 60 * 10,
    }
  );

  return result;
};
