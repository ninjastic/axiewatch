import {
  Flex,
  SkeletonCircle,
  Text,
  Divider,
  Stack,
  HStack,
  Button,
  useTheme,
  useColorModeValue,
} from '@chakra-ui/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, TooltipProps, Legend } from 'recharts';
import { useRecoilValue } from 'recoil';

import dayjs from '../../services/dayjs';
import { scholarsMap } from 'src/recoil/scholars';
import { useBatchScholar } from 'src/services/hooks/useBatchScholar';
import { usePrice } from 'src/services/hooks/usePrice';
import { formatter } from 'src/services/formatter';
import { Card } from 'components/Card';

const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>): JSX.Element => {
  const price = usePrice();
  const { colors } = useTheme();

  const tooltipSecondaryColor = useColorModeValue(colors.darkGray[700], colors.darkGray[200]);

  if (!active || !payload) {
    return null;
  }

  const total = Math.floor(payload.reduce((p, c) => p + c.value, 0));
  const scholars = Math.floor(payload.find(p => p.dataKey === 'scholars')?.value);
  const manager = Math.floor(payload.find(p => p.dataKey === 'manager')?.value);
  const investor = Math.floor(payload.find(p => p.dataKey === 'investor')?.value);

  return (
    <Card rounded="lg" shadow="dark-lg" p={2}>
      <Text fontSize="sm" color={tooltipSecondaryColor} textAlign="center">
        {dayjs.utc(label).subtract(1, 'day').format('DD MMM YYYY')}
      </Text>

      <Divider my={1} />

      <Stack spacing={0} textAlign="center">
        <Text fontWeight="bold">{total} SLP</Text>

        <Text fontSize="sm" color={tooltipSecondaryColor}>
          {formatter(total * price.values.slp, price.locale)}
        </Text>
      </Stack>

      <Divider my={1} />

      <HStack>
        <Stack spacing={0} color="#58508d" fontSize="xs">
          <Text fontWeight="bold">INVESTOR</Text>
          <Text>{investor} SLP</Text>
        </Stack>

        <Stack spacing={0} color="#bc5090" fontSize="xs">
          <Text fontWeight="bold">MANAGER</Text>
          <Text>{manager} SLP</Text>
        </Stack>

        <Stack spacing={0} color="#ffa600" fontSize="xs">
          <Text fontWeight="bold">SCHOLARS</Text>
          <Text>{scholars} SLP</Text>
        </Stack>
      </HStack>
    </Card>
  );
};

export const EarningsForecastChart = (): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const addresses = scholars.map(scholar => scholar.address);
  const { colors } = useTheme();

  const { data, isLoading, isError } = useBatchScholar({ addresses });

  const accumulated = data.reduce(
    (prev, currResult) => {
      const scholar = scholars.find(schol => schol.address === currResult.address);
      const total = prev[0] + currResult.slp;
      const manager = prev[1] + (currResult.slp * scholar.shares.manager) / 100;
      const investor = prev[2] + (currResult.slp * (scholar.shares.investor ?? 0)) / 100;
      return [total, manager, investor];
    },
    [0, 0, 0]
  );

  const totalSlpDay = data.reduce(
    (prev, currResult) => {
      const scholar = scholars.find(schol => schol.address === currResult.address);
      const total = prev[0] + currResult.slpDay;
      const manager = prev[1] + (currResult.slpDay * scholar.shares.manager) / 100;
      const investor = prev[2] + (currResult.slpDay * (scholar.shares.investor ?? 0)) / 100;
      return [total, manager, investor];
    },
    [0, 0, 0]
  );

  const dates = Array(30)
    .fill(null)
    .map((_, index) => {
      const day = dayjs()
        .add(index + 1, 'days')
        .toISOString();
      const total = accumulated[0] + (index + 1) * totalSlpDay[0];
      const manager = accumulated[1] + (index + 1) * totalSlpDay[1];
      const investor = accumulated[2] + (index + 1) * totalSlpDay[2];

      return {
        day,
        total,
        manager,
        investor,
        scholars: total - manager - investor,
      };
    });

  if (isLoading) {
    return (
      <Flex align="center" justify="center" h="290px">
        <SkeletonCircle alignSelf="center" />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Stack align="center" justify="center" h="290px">
        <Text fontWeight="bold">Something went wrong...</Text>
        <Button onClick={() => undefined}>Retry</Button>
      </Stack>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={290}>
      <AreaChart
        data={dates}
        margin={{
          top: 20,
          right: 20,
          left: 10,
          bottom: 5,
        }}
      >
        <YAxis dataKey="total" />
        <XAxis
          dataKey="day"
          tickFormatter={date => dayjs.utc(date).subtract(1, 'day').format('DD/MM')}
          tick={{
            fill: colors.darkGray[500],
          }}
        />
        <Area type="monotone" stackId="1" dataKey="investor" stroke="#58508d" fill="#58508d" />
        <Area type="monotone" stackId="1" dataKey="manager" stroke="#bc5090" fill="#bc5090" />
        <Area type="monotone" stackId="1" dataKey="scholars" stroke="#ffa600" fill="#ffa600" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </AreaChart>
    </ResponsiveContainer>
  );
};
