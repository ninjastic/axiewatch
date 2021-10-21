import { Box, Text, HStack, Spinner } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { AxiosError } from 'axios';
import Image from 'next/image';

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
      retry: (count: number, error: AxiosError) => {
        if (error?.response?.status === 500 || count >= 3) return false;
        return true;
      },
    }
  );

  if (isLoading) {
    return (
      <Box>
        <Spinner size="sm" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        <Text opacity={0.8}>Error</Text>
      </Box>
    );
  }

  return (
    <HStack align="flex-start">
      <Image src="/images/axies/slp.png" width="18px" height="18px" alt="slp" />

      <Text>
        {data?.pve.slp} / {data?.pve.maxSlp}
      </Text>
    </HStack>
  );
};
