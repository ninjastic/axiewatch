import { Box, Text, Spinner } from '@chakra-ui/react';
import { useQuery } from 'react-query';

import { serverApi } from '../../../../services/api';
import { APIScholarResponse } from '@src/types/api';

interface PveStatsProps {
  address: string;
  shouldLoad?: boolean;
}

export const PveStats = ({ address, shouldLoad = true }: PveStatsProps): JSX.Element => {
  const { data, isLoading, isError } = useQuery(
    ['scholar', address],
    async () => {
      const response = await serverApi.get<APIScholarResponse>('/scholar', {
        params: { address },
      });

      return response.data;
    },
    {
      staleTime: 1000 * 60 * 15,
      enabled: shouldLoad,
      retry: false,
    }
  );

  if (isLoading) {
    return (
      <Box>
        <Spinner size="sm" />
      </Box>
    );
  }

  if (isError || !data.pve) {
    return (
      <Box>
        <Text opacity={0.9}>Error</Text>
      </Box>
    );
  }

  return (
    <Text>
      {data.pve?.slp} / {data.pve?.maxSlp}
    </Text>
  );
};
