import { Flex, SkeletonCircle, Text, Divider, Stack, useTheme, useColorModeValue } from '@chakra-ui/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useRecoilValue } from 'recoil';

import { scholarsMap } from '@src/recoil/scholars';
import { useBatchScholar } from '@src/services/hooks/useBatchScholar';
import { parseScholarData } from '@src/services/utils/parseScholarData';
import { usePrice } from '@src/services/hooks/usePrice';
import { formatter } from '@src/services/formatter';
import dayjs from '@src/services/dayjs';
import { Card } from '@components/Card';

const CustomTooltip = ({ active, payload, label }: any): JSX.Element => {
  const price = usePrice();
  const { colors } = useTheme();

  const tooltipSecondaryColor = useColorModeValue(colors.darkGray[700], colors.darkGray[200]);

  if (!active || !payload) {
    return null;
  }

  const amount = Math.floor(payload.reduce((p, c) => p + c.payload[c.dataKey], 0));

  return (
    <Card rounded="lg" shadow="lg" p={2}>
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
    </Card>
  );
};

export const EarningsProjectionChart = (): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const addresses = scholars.map(scholar => scholar.address);
  const { colors } = useTheme();

  const { results, isLoading } = useBatchScholar({ addresses });
  const resultsWithSuccess = results.filter(result => result.isSuccess);

  const accumulated = resultsWithSuccess.reduce((prev, currResult) => {
    const value = Math.abs(currResult.data.scholar.total - currResult.data.scholar.blockchain_related.balance);
    return prev + value;
  }, 0);

  const totalSlpDay = resultsWithSuccess.reduce((prev, currResult) => {
    const scholarData = parseScholarData({ data: currResult.data });

    return prev + scholarData.slpDay;
  }, 0);

  const dates = Array(30)
    .fill(null)
    .map((_, index) => {
      const day = dayjs()
        .add(index + 1, 'days')
        .toISOString();
      const value = accumulated + (index + 1) * totalSlpDay;

      return {
        day,
        value,
      };
    });

  if (isLoading) {
    return (
      <Flex align="center" justify="center" h="290px">
        <SkeletonCircle alignSelf="center" />
      </Flex>
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
        <YAxis dataKey="value" />
        <XAxis
          dataKey="day"
          tickFormatter={date => dayjs.utc(date).subtract(1, 'day').format('DD/MM')}
          tick={{
            fill: colors.darkGray[500],
          }}
        />
        <Area type="monotone" dataKey="value" />
        <Tooltip content={<CustomTooltip />} />
      </AreaChart>
    </ResponsiveContainer>
  );
};
