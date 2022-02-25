import { Stat, StatLabel, StatNumber, Tooltip, Stack, Box, Text, Skeleton, StatHelpText } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { formatter } from 'src/services/formatter';
import { usePrice } from 'src/services/hooks/usePrice';
import { ScholarState, scholarsMap } from 'src/recoil/scholars';
import { Card } from 'components/Card';

interface AccumulatedSlpCardProps {
  data: ScholarState[];
  isLoading: boolean;
}

interface TotalTooltipProps {
  values: {
    total: number;
    manager: number;
    scholars: number;
    investor: number;
  };
  fiatValues: {
    total: string;
    manager: string;
    investor: string;
    scholars: string;
  };
}

const TotalTooltip = ({ values, fiatValues }: TotalTooltipProps): JSX.Element => {
  return (
    <Stack spacing={2}>
      <Box>
        <Text fontWeight="bold">Scholars</Text>
        <Text>
          {Math.floor(values.scholars)} SLP ({fiatValues.scholars})
        </Text>
      </Box>

      <Box>
        <Text fontWeight="bold">Manager</Text>
        <Text>
          {Math.floor(values.manager)} SLP ({fiatValues.manager})
        </Text>
      </Box>

      <Box>
        <Text fontWeight="bold">Investor</Text>
        <Text>
          {Math.floor(values.investor)} SLP ({fiatValues.investor})
        </Text>
      </Box>
    </Stack>
  );
};

export const AccumulatedSlpCard = ({ data, isLoading }: AccumulatedSlpCardProps): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const price = usePrice();

  const values = data.reduce(
    (prev, currResult) => {
      const state = scholars.find(scholar => scholar.address === currResult.address);

      const manager = (currResult.slp * state.shares.manager) / 100;
      const scholar = (currResult.slp * state.shares.scholar) / 100;
      const investor = (currResult.slp * (state.shares.investor ?? 0)) / 100;

      return {
        total: prev.total + currResult.slp,
        manager: prev.manager + manager,
        scholars: prev.scholars + scholar,
        investor: prev.investor + investor,
      };
    },
    { total: 0, manager: 0, scholars: 0, investor: 0 }
  );

  const fiatValues = useMemo(
    () => ({
      total: formatter(values.total * price.values.slp, price.locale),
      manager: formatter(values.manager * price.values.slp, price.locale),
      investor: formatter(values.investor * price.values.slp, price.locale),
      scholars: formatter(values.scholars * price.values.slp, price.locale),
    }),
    [values.investor, values.manager, values.scholars, values.total, price.locale, price.values.slp]
  );

  return (
    <Card p={3}>
      <Stat>
        <StatLabel>Accumulated</StatLabel>

        <StatNumber>
          <Tooltip label={<TotalTooltip values={values} fiatValues={fiatValues} />}>
            <Skeleton isLoaded={!isLoading} h="35px" w="175px">
              <Text>{Math.floor(values.total)} SLP</Text>
            </Skeleton>
          </Tooltip>
        </StatNumber>

        <Skeleton isLoaded={!isLoading} h="20px" w="100px" mt={1}>
          <StatHelpText>{fiatValues.total}</StatHelpText>
        </Skeleton>
      </Stat>
    </Card>
  );
};
