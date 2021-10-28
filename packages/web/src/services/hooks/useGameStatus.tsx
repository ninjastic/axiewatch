import dayjs from 'dayjs';
import { useQuery, UseQueryResult } from 'react-query';

import { APIGameStatusResponse } from '../../types/api';
import { serverApi } from '../api';

type UseGameStatusData = UseQueryResult<APIGameStatusResponse, unknown> & {
  isMaintenance: boolean;
};

export const useGameStatus = (): UseGameStatusData => {
  const result = useQuery(
    'status',
    async () => {
      const { data } = await serverApi.get<APIGameStatusResponse>('/status');

      return data;
    },
    {
      staleTime: 1000 * 60 * 1,
    }
  );

  const now = dayjs().unix();
  const isMaintenance = result.isSuccess && now > result.data?.from && result.data?.to > now;

  return { ...result, isMaintenance };
};
