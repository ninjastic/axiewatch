import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import StatCard from '@axiewatch/design-system/components/molecules/StatCard';
import { Text, Heading, Box } from '@chakra-ui/react';
import { useColorMode, useColorModeValue, useTheme } from '@chakra-ui/system';
import dayjs from 'dayjs';
import { useRecoilValue } from 'recoil';
import { transparentize } from '@chakra-ui/theme-tools';

import { scholarsMap } from '@src/recoil/scholars';
import { useBatchScholar } from '@src/services/hooks/useBatchScholar';
import { formatter } from '@src/services/formatter';
import { usePrice } from '@src/services/hooks/usePrice';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const randomizeArray = function (arg) {
  const array = arg.slice();
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

interface HistoricalSlpDate {
  day: string;
  total: number;
  manager: number;
  scholars: number;
  investor: number;
}

export const EarningsCard = (): JSX.Element => {
  const price = usePrice();
  const { colorMode } = useColorMode();
  const { colors } = useTheme();
  const scholars = useRecoilValue(scholarsMap);

  const addresses = scholars.filter(scholar => !scholar.inactive).map(scholar => scholar.address);

  const { data, isLoading } = useBatchScholar({ addresses });

  const totalColor = colors.purple[400];
  const scholarsColor = colors.blue[400];

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

  const [chartOptions, setChartOptions] = useState<ApexCharts.ApexOptions>({
    chart: {
      id: 'sparkline1',
      group: 'sparklines',
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      opacity: 1,
    },
    labels: chartData.map(data1 => data1.day),
    yaxis: {
      show: false,
    },
    xaxis: {
      type: 'datetime',
    },
    colors: [totalColor, scholarsColor],
    title: {
      text: '',
      style: {
        fontSize: '1px',
      },
    },
    tooltip: {
      followCursor: true,
      theme: colorMode,
    },
  });

  const [chartSeries, setChartSeries] = useState([
    {
      name: 'Total',
      data: chartData.map(data1 => data1.total),
    },
    {
      name: 'Manager',
      data: chartData.map(data1 => data1.manager),
    },
  ]);

  useEffect(() => {
    setChartOptions(c => ({
      ...c,
      tooltip: {
        ...c.tooltip,
        theme: colorMode,
      },
    }));
  }, [colorMode]);

  useEffect(() => {
    setChartSeries([
      {
        name: 'Total',
        data: chartData.map(data1 => data1.total),
      },
      {
        name: 'Manager',
        data: chartData.map(data1 => data1.manager),
      },
    ]);
  }, [chartData]);

  const farmedToday = useMemo(
    () =>
      data.reduce((prev, currResult) => {
        const { historical, totalSlp } = currResult;
        const todayStart = historical?.today?.totalSlp;

        if (!todayStart) return prev;

        return prev + (totalSlp - todayStart);
      }, 0),
    [data]
  );

  const farmedYesterday = useMemo(
    () =>
      data.reduce((prev, currResult) => {
        const { historical, totalSlp } = currResult;

        const yesterday = historical?.yesterday?.totalSlp;
        const today = historical?.today?.totalSlp;

        if (!yesterday) return prev;

        if (!today) {
          return prev + (totalSlp - yesterday);
        }

        return prev + (today - yesterday);
      }, 0),
    [data]
  );

  const textColor = useColorModeValue('gray.200', 'darkGray.300');
  const infoColor = useColorModeValue('gray.200', 'darkGray.300');

  return (
    <StatCard h="100%" p={6}>
      <Heading size="sm" fontWeight="bold" pb={4}>
        Earnings
      </Heading>

      <StatCard p={0} sx={{ backgroundColor: transparentize('purple.400', 0.2) }}>
        <Box m={4} display="flex" justifyContent="space-between">
          <Text fontSize="sm" fontWeight="semibold" color="purple.400">
            Daily SLP
          </Text>
          <Box textAlign="right">
            <Heading size="md" fontWeight="bold" color="purple.400">
              {chartData.reduce((prevResult, currResult) => prevResult + currResult.total, 0)}
            </Heading>
            <Text fontSize="xs" fontWeight="semibold" color="purple.300">
              SLP
            </Text>
          </Box>
        </Box>

        <ApexChart options={chartOptions} series={chartSeries} type="area" width="100%" height="130px" />
      </StatCard>

      <StatCard
        mt={6}
        bgColor="dark.bgLevel3"
        accentColor="yellow"
        boxShadow="2xl"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          <Text size="md" fontWeight="semibold" color={textColor}>
            Yesterday Total
          </Text>
          <Text fontSize="3xl" fontWeight="bold" color={textColor} mt={1}>
            {farmedYesterday}
          </Text>
          <Text fontSize="sm" fontWeight="semibold" color={infoColor}>
            {formatter(farmedYesterday * price.values.slp, price.locale)}
          </Text>
        </Box>

        <StatCard bgColor="dark.bgLevel2" zIndex={2}>
          <Text size="md" fontWeight="semibold" color={textColor}>
            Today Parcial
          </Text>
          <Text fontSize="3xl" fontWeight="bold" color={textColor} mt={1}>
            {farmedToday}
          </Text>
          <Text fontSize="sm" fontWeight="semibold" color={infoColor}>
            {formatter(farmedToday * price.values.slp, price.locale)}
          </Text>
        </StatCard>
      </StatCard>
    </StatCard>
  );
};

export default EarningsCard;
