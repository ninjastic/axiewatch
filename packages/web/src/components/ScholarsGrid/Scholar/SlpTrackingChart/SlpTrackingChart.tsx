import { Box, Text, Spinner, Button, HStack, useTheme, Flex, Stack, useColorModeValue } from '@chakra-ui/react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  TooltipProps,
} from 'recharts';
import { RiExternalLinkFill } from 'react-icons/ri';
import { BsArrowRepeat } from 'react-icons/bs';
import { useQuery } from 'react-query';
import { useMemo, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import Link from 'next/link';

import dayjs from '../../../../services/dayjs';
import { formatter } from 'src/services/formatter';
import { usePrice } from 'src/services/hooks/usePrice';
import { ScholarHistoricalDate } from '../../../../types/api';
import { serverApi } from '../../../../services/api';
import { useAuth } from '../../../../services/hooks/useAuth';
import { scholarSelector } from '../../../../recoil/scholars';
import { Card } from '../../../Card';

interface ApiResponse {
  dates: ScholarHistoricalDate[];
  isTracking: boolean | null;
}

function CustomTooltip({ active, payload }: TooltipProps<any, any>) {
  const price = usePrice();
  const { colors } = useTheme();

  const tooltipSecondaryColor = useColorModeValue(colors.darkGray[700], colors.darkGray[200]);

  if (!active || !payload) {
    return null;
  }
  const amount = payload[0].payload.slpAmount;

  return (
    <Card rounded="lg" shadow="dark-lg" p={2}>
      <Text color={tooltipSecondaryColor} fontSize="sm">
        {dayjs.utc(payload[0].payload.day).format('DD MMM YYYY')}
      </Text>

      <Stack spacing={0} textAlign="center">
        <Text fontWeight="bold">{amount} SLP</Text>

        <Text fontSize="sm" color={tooltipSecondaryColor}>
          {formatter(amount * price.values.slp, price.locale)}
        </Text>
      </Stack>
    </Card>
  );
}

interface DailyChartProps {
  address: string;
  height?: number;
  showYAxis?: boolean;
  showXAxis?: boolean;
}

export const SlpTrackingChart = ({
  address,
  height = 240,
  showYAxis = true,
  showXAxis = true,
}: DailyChartProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));

  const { colors } = useTheme();
  const { session, isUserLoading } = useAuth();

  const { data, isLoading, isFetching, isRefetching, isError, refetch } = useQuery(
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
      staleTime: 1000 * 60 * 15, // 15 minutes
      enabled: !isUserLoading,
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
  }, [data, scholar]);

  useEffect(() => {
    if (!dates.length) refetch();
  }, [dates.length, refetch, session]);

  if (isLoading || isFetching || isRefetching) {
    return (
      <Flex justify="center" align="center" height={height}>
        <Spinner />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex justify="center" align="center" height={height}>
        <Button leftIcon={<BsArrowRepeat />} onClick={() => refetch()}>
          Retry
        </Button>
      </Flex>
    );
  }

  if (dates.length === 0 && data?.isTracking === null) {
    return (
      <Flex justify="center" align="center" height={height}>
        <HStack>
          <Text variant="faded">Sync -&gt; Upload your scholars to the cloud for their Daily SLP</Text>

          <Link href="/signin" passHref>
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
      <Flex justify="center" align="center" height={height}>
        <HStack>
          <Text variant="faded">Not tracked, please Sync -&gt; Upload for daily SLP</Text>

          <Link href="/profile" passHref>
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
      <Flex justify="center" align="center" height={height}>
        <Text variant="faded">No Daily SLP data yet, check back in 1-2 days</Text>
      </Flex>
    );
  }

  return (
    <ResponsiveContainer width="99%" height={height}>
      <BarChart data={dates} margin={{ top: 20 }}>
        {showXAxis && (
          <XAxis
            dataKey="day"
            tickFormatter={date => dayjs.utc(date).format('DD/MM')}
            tick={{ fill: colors.gray[500], fontSize: 12 }}
          />
        )}

        {showYAxis && (
          <YAxis
            dataKey="slpAmount"
            axisLine={false}
            tickLine={false}
            tickCount={8}
            tick={{ fill: colors.gray[500] }}
          />
        )}

        <Bar dataKey="slpAmount" stroke={colors['gray.500']} fill="#ffa600">
          <LabelList dataKey="slpAmount" position="top" style={{ fontSize: '80%', fill: colors.darkGray[500] }} />
        </Bar>

        <Tooltip content={<CustomTooltip />} />

        <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
      </BarChart>
    </ResponsiveContainer>
  );
};
