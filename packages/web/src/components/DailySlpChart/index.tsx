import { SkeletonCircle, Text, Flex, Stack, HStack, Divider, useTheme, useColorModeValue } from '@chakra-ui/react';
import { BarChart, ResponsiveContainer, XAxis, YAxis, Bar, Tooltip, CartesianGrid, Legend, LabelList } from 'recharts';
import { useRecoilValue } from 'recoil';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import dayjs from '../../services/dayjs';
import { formatter } from '../../services/formatter';
import { scholarsMap } from '../../recoil/scholars';
import { usePrice } from '../../services/hooks/usePrice';
import { useBatchScholar } from 'src/services/hooks/useBatchScholar';
import { Card } from '../Card';

const CustomTooltip = ({ active, payload, label }: any): JSX.Element => {
  const price = usePrice();
  const { colors } = useTheme();

  const tooltipSecondaryColor = useColorModeValue(colors.darkGray[700], colors.darkGray[200]);

  if (!active || !payload) {
    return null;
  }

  const amount = Math.floor(payload.reduce((p, c) => p + c.payload[c.dataKey], 0));

  return (
    <Card rounded="lg" shadow="dark-lg" p={2}>
      <Text fontSize="sm" color={tooltipSecondaryColor} textAlign="center">
        {dayjs.utc(label).subtract(1, 'day').format('DD MMM YYYY')}
      </Text>

      <Divider my={1} />

      <Stack spacing={0} textAlign="center">
        <Text fontWeight="bold">{amount} SLP</Text>

        <Text fontSize="sm" color={tooltipSecondaryColor}>
          {formatter(amount * price.values.slp, price.locale)}
        </Text>
      </Stack>

      <Divider my={1} />

      <HStack>
        {payload.map(p => (
          <Stack key={p.dataKey} color={p.color} spacing={0} fontSize="xs">
            <Text fontWeight="bold">{p.dataKey.toUpperCase()}</Text>

            <Text>{Math.floor(p.value)} SLP</Text>
          </Stack>
        ))}
      </HStack>
    </Card>
  );
};

interface HistoricalSlpDate {
  day: string;
  total: number;
  manager: number;
  scholars: number;
  investor: number;
}

const DailySlpChartComponent = (): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const addresses = scholars.filter(scholar => !scholar.inactive).map(scholar => scholar.address);

  const { colors } = useTheme();
  const { data, isLoading } = useBatchScholar({ addresses });

  const chartData = useMemo(() => {
    return data
      .reduce((prevResult, currResult) => {
        const draft = [...prevResult];
        const scholar = scholars.find(schol => schol.address === currResult.address);

        if (!scholar) return draft;

        currResult.historical?.dates.forEach((date, index, array) => {
          const dayIndex = draft.findIndex(d => d.day === date.day);
          const prevDate = array[index - 1];

          if (!prevDate) return;

          if (dayjs.utc(prevDate.day).add(1, 'day').day() !== dayjs.utc(date.day).day()) return;

          if (dayIndex !== -1) {
            const value = date.totalSlp - prevDate.totalSlp;
            draft[dayIndex].total += value;
            draft[dayIndex].manager += (value * scholar?.shares.manager) / 100;
            draft[dayIndex].scholars += (value * scholar?.shares.scholar) / 100;
            draft[dayIndex].investor += (value * (scholar?.shares.investor ?? 0)) / 100;
            return;
          }

          const value = date.totalSlp - prevDate.totalSlp;

          draft.push({
            day: date.day,
            total: value,
            manager: (value * scholar?.shares.manager) / 100,
            scholars: (value * scholar?.shares.scholar) / 100,
            investor: (value * (scholar?.shares.investor ?? 0)) / 100,
          });
        });

        return draft;
      }, [] as HistoricalSlpDate[])
      .sort((a, b) => {
        if (a.day > b.day) return 1;
        if (a.day < b.day) return -1;
        return 0;
      });
  }, [data, scholars]);

  if (isLoading) {
    return (
      <Flex align="center" justify="center" h="150px">
        <SkeletonCircle alignSelf="center" />
      </Flex>
    );
  }

  if (!chartData.length) {
    return (
      <Flex align="center" justify="center" h="150px">
        <Text variant="faded">Oopss... there is nothing to see here</Text>
      </Flex>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        maxBarSize={80}
      >
        <XAxis
          dataKey="day"
          tickFormatter={date => dayjs.utc(date).subtract(1, 'day').format('DD/MM')}
          tick={{
            fill: colors.darkGray[500],
          }}
        />
        <YAxis />

        <Bar dataKey="investor" fill="#58508d" stackId="1" />
        <Bar dataKey="manager" fill="#bc5090" stackId="1" />
        <Bar dataKey="scholars" fill="#ffa600" stackId="1">
          <LabelList dataKey="total" position="top" style={{ fontSize: '80%', fill: colors.darkGray[500] }} />
        </Bar>

        <Tooltip content={<CustomTooltip />} />
        <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DailySlpChart = dynamic(() => Promise.resolve(DailySlpChartComponent), { ssr: false });
