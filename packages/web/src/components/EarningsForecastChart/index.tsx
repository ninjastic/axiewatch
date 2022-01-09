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
import { scholarsMap } from '@src/recoil/scholars';
import { useBatchScholar } from '@src/services/hooks/useBatchScholar';
import { usePrice } from '@src/services/hooks/usePrice';
import { formatter } from '@src/services/formatter';
import { Card } from '@components/Card';

interface CustomTooltip {
  detailColors: {
    infoColor: string;
    scholarsColor: string;
    managerColor: string;
    investorColor: string;
  };
}

const CustomTooltip = ({
  active,
  payload,
  label,
  detailColors,
}: TooltipProps<any, any> & CustomTooltip): JSX.Element => {
  const price = usePrice();

  if (!active || !payload) {
    return null;
  }

  console.log(detailColors);

  const total = Math.floor(payload.reduce((p, c) => p + c.value, 0));
  const scholars = Math.floor(payload.find(p => p.dataKey === 'scholars')?.value);
  const manager = Math.floor(payload.find(p => p.dataKey === 'manager')?.value);
  const investor = Math.floor(payload.find(p => p.dataKey === 'investor')?.value);

  return (
    <Card rounded="lg" shadow="dark-lg" p={2}>
      <Text fontSize="sm" color={detailColors.infoColor} textAlign="center">
        {dayjs.utc(label).subtract(1, 'day').format('DD MMM YYYY')}
      </Text>

      <Divider my={1} />

      <Stack spacing={0} textAlign="center">
        <Text fontWeight="bold">{total} SLP</Text>

        <Text fontSize="sm" color={detailColors.infoColor}>
          {formatter(total * price.values.slp, price.locale)}
        </Text>
      </Stack>

      <Divider my={1} />

      <HStack>
        <Stack spacing={0} color={detailColors.scholarsColor} fontSize="xs">
          <Text fontWeight="bold">SCHOLARS</Text>
          <Text>{scholars} SLP</Text>
        </Stack>

        <Stack spacing={0} color={detailColors.managerColor} fontSize="xs">
          <Text fontWeight="bold">MANAGER</Text>
          <Text>{manager} SLP</Text>
        </Stack>

        <Stack spacing={0} color={detailColors.investorColor} fontSize="xs">
          <Text fontWeight="bold">INVESTOR</Text>
          <Text>{investor} SLP</Text>
        </Stack>
      </HStack>
    </Card>
  );
};

export const EarningsForecastChart = (): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const addresses = scholars.map(scholar => scholar.address);
  const { colors } = useTheme();

  const managerColor = useColorModeValue(colors.purple[700], colors.purple[400]);
  const scholarsColor = useColorModeValue(colors.blue[700], colors.blue[400]);
  const investorColor = useColorModeValue(colors.indigo[700], colors.indigo[400]);
  const infoColor = useColorModeValue(colors.gray[700], colors.gray[100]);

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
        <YAxis
          dataKey="total"
          tick={{
            fill: infoColor,
          }}
        />
        <XAxis
          dataKey="day"
          tickFormatter={date => dayjs.utc(date).subtract(1, 'day').format('DD/MM')}
          tick={{
            fill: infoColor,
          }}
        />
        <Area type="monotone" stackId="1" dataKey="investor" stroke={investorColor} fill={investorColor} />
        <Area type="monotone" stackId="1" dataKey="manager" stroke={managerColor} fill={managerColor} />
        <Area type="monotone" stackId="1" dataKey="scholars" stroke={scholarsColor} fill={scholarsColor} />
        <Tooltip content={<CustomTooltip detailColors={{ infoColor, investorColor, managerColor, scholarsColor }} />} />
        <Legend />
      </AreaChart>
    </ResponsiveContainer>
  );
};
