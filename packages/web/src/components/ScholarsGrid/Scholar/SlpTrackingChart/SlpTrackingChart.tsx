import { Box, Text, Spinner, Button, HStack, useTheme, Flex, Stack, useColorModeValue } from '@chakra-ui/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from 'recharts';
import { RiExternalLinkFill } from 'react-icons/ri';
import { BsArrowRepeat } from 'react-icons/bs';
import { useQuery } from 'react-query';
import { AxiosError } from 'axios';
import { useMemo, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import Link from 'next/link';

import { APIScholarResponseSlpDate } from '../../../../types/api';
import dayjs from '../../../../services/dayjs';
import { serverApi } from '../../../../services/api';
import { useAuth } from '../../../../services/hooks/useAuth';
import { scholarSelector } from '../../../../recoil/scholars';
import { Card } from '../../../Card';

interface ApiResponse {
  dates: APIScholarResponseSlpDate[];
  isTracking: boolean | null;
}

interface DailyChartProps {
  address: string;
}

function CustomTooltip({ active, payload, label }: any) {
  const { colors } = useTheme();

  const tooltipSecondaryColor = useColorModeValue(colors.darkGray[700], colors.darkGray[200]);

  if (!active || !payload) {
    return null;
  }

  return (
    <Card rounded="lg" shadow="lg" p={2}>
      <Text color={tooltipSecondaryColor} fontSize="sm">
        {dayjs.utc(label).format('DD MMM YYYY')}
      </Text>
      <Text textAlign="center" fontWeight="bold">
        {payload[0].payload.slpAmount} SLP
      </Text>
    </Card>
  );
}

export function SlpTrackingChart({ address }: DailyChartProps) {
  const scholar = useRecoilValue(scholarSelector(address));

  const { colors } = useTheme();
  const { session, isUserLoading } = useAuth();

  const colorsChart = [
    useColorModeValue(colors.darkGray[700], colors.dark.chart.first),
    useColorModeValue(colors.darkGray[700], colors.dark.chart.second),
  ];

  const { data, isLoading, isError, refetch } = useQuery(
    ['daily', address],
    async () => {
      const response = await serverApi.get<ApiResponse>('/daily', {
        params: {
          address,
        },
        headers: {
          authorization: session?.access_token,
        },
      });

      return response.data;
    },
    {
      staleTime: 1000 * 60 * 60 * 2, // 2 hours
      enabled: !isUserLoading,
      retry: (count: number, error: AxiosError) => {
        if (error?.response?.status === 500 || count >= 3) return false;
        return true;
      },
    }
  );

  const dates = useMemo(() => {
    const formattedData =
      data?.dates
        .map((entry, index, array) => {
          const prevEntry = array[index - 1];
          if (!prevEntry) return null;

          if (dayjs.utc(prevEntry.day).add(1, 'day').day() !== dayjs.utc(entry.day).day()) return null;

          const slpDiff = entry.totalSlp - prevEntry.totalSlp;

          return {
            day: dayjs.utc(entry.day).subtract(1, 'day').toISOString(),
            slpAmount: slpDiff,
          };
        })
        .filter(v => v) ?? [];

    const lastEntry = data?.dates[data.dates.length - 1];

    if (!lastEntry) {
      return formattedData;
    }

    const lastEntryIsTodayStart = dayjs.utc(lastEntry.day).date() === dayjs.utc().date();

    const lastEntryIsRecent = dayjs.utc().diff(dayjs.utc(lastEntry.day), 'hours') <= 30;

    if (lastEntryIsRecent) {
      formattedData.push({
        day: lastEntryIsTodayStart ? dayjs.utc().toISOString() : dayjs().subtract(1, 'day').toISOString(),
        slpAmount: scholar.totalSlp - lastEntry.totalSlp,
      });
    }

    return formattedData;
  }, [data, scholar, session]);

  useEffect(() => {
    if (!dates.length) refetch();
  }, [session]);

  if (!scholar.loaded) {
    return (
      <Flex justify="center" h="50px">
        <Stack align="center" spacing={3}>
          <Text>Waiting for scholar data to load...</Text>
          <Spinner />
        </Stack>
      </Flex>
    );
  }

  if (isLoading) {
    return (
      <Flex justify="center" h="50px">
        <Spinner />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex justify="center" h="50px">
        <Button leftIcon={<BsArrowRepeat />} onClick={() => refetch()}>
          Retry
        </Button>
      </Flex>
    );
  }

  if (dates.length === 0 && data?.isTracking === null) {
    return (
      <Flex justify="center" h="50px">
        <HStack>
          <Text opacity={0.8}>Please, sign in and upload your scholars to the cloud to track.</Text>

          <Link href="/signin">
            <Box cursor="pointer">
              <RiExternalLinkFill />
            </Box>
          </Link>
        </HStack>
      </Flex>
    );
  }

  if (dates.length === 0 && data?.isTracking === false) {
    return (
      <Flex justify="center" h="50px">
        <HStack>
          <Text opacity={0.8}>Not tracked, please upload to the cloud on your profile</Text>

          <Link href="/profile">
            <Box cursor="pointer">
              <RiExternalLinkFill />
            </Box>
          </Link>
        </HStack>
      </Flex>
    );
  }

  if (!dates.length) {
    return (
      <Flex justify="center" h="50px">
        <Text opacity={0.8}>No data yet, check back in 1-2 days.</Text>
      </Flex>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={dates} margin={{ top: 20 }}>
        <XAxis
          dataKey="day"
          tickFormatter={date => dayjs.utc(date).format('DD/MM')}
          tick={{ fill: colors.gray[500] }}
        />

        <YAxis dataKey="slpAmount" axisLine={false} tickLine={false} tickCount={8} tick={{ fill: colors.gray[500] }} />

        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorsChart[0]} />
            <stop offset="95%" stopColor={colorsChart[1]} />
          </linearGradient>
        </defs>

        <Bar dataKey="slpAmount" stroke={colors['gray.500']} fill="url(#color)">
          <LabelList dataKey="slpAmount" position="top" style={{ fontSize: '80%', fill: colors.darkGray[500] }} />
        </Bar>

        <Tooltip content={<CustomTooltip />} />

        <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
