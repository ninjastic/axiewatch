import { Stack, Text, SimpleGrid, Button, Heading, Box, useColorModeValue, Grid, GridItem } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';
import StatCard from '@axiewatch/design-system/components/molecules/StatCard';

import { useBatchScholar } from '../../services/hooks/useBatchScholar';
import { scholarsMap } from '../../recoil/scholars';
import { formatter } from '@src/services/formatter';
import { usePrice } from '@src/services/hooks/usePrice';
import EarningsCard from './EarningsCard';

export const OverviewGrid = (): JSX.Element => {
  const infoColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.700');

  const scholars = useRecoilValue(scholarsMap);
  const addresses = scholars.filter(scholar => !scholar.inactive).map(scholar => scholar.address);
  const { data, isLoading, isError } = useBatchScholar({ addresses });
  const price = usePrice();

  const activeScholars = useMemo(() => scholars.filter(scholar => !scholar.inactive), [scholars]);

  const totalSlpDay = useMemo(
    () =>
      data
        .filter(dataScholar => activeScholars.find(activeScholar => activeScholar.address === dataScholar.address))
        .reduce((prev, currResult) => {
          return prev + currResult.slpDay;
        }, 0),
    [activeScholars, data]
  );

  const lifetimeSlp = data.reduce(
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

  const averageSlp = useMemo(
    () => (activeScholars.length ? Math.floor(totalSlpDay / activeScholars.length) : 0),
    [activeScholars.length, totalSlpDay]
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

  return (
    <Stack h="100%">
      {!isError && (
        <>
          <Grid
            h="100%"
            templateRows={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }}
            templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(5, 1fr)' }}
            gap={6}
          >
            <GridItem colSpan={1}>
              <StatCard cardColor="purple">
                <Heading size="md" fontWeight="semibold">
                  Today
                </Heading>
                <Text fontSize="3xl" fontWeight="bold" color="white" mt={4}>
                  {farmedToday}
                </Text>
                <Text fontSize="sm" fontWeight="semibold" color="whiteAlpha.700">
                  {formatter(farmedToday * price.values.slp, price.locale)}
                </Text>
              </StatCard>
            </GridItem>

            <GridItem colSpan={1}>
              <StatCard cardColor="blue">
                <Heading size="md" fontWeight="semibold">
                  Yesterday
                </Heading>
                <Text fontSize="3xl" fontWeight="bold" color="white" mt={4}>
                  {farmedYesterday}
                </Text>
                <Text fontSize="sm" fontWeight="semibold" color="whiteAlpha.700">
                  {formatter(farmedYesterday * price.values.slp, price.locale)}
                </Text>
              </StatCard>
            </GridItem>

            <GridItem colSpan={1}>
              <StatCard cardColor="teal">
                <Heading size="md" fontWeight="semibold">
                  Average SLP
                </Heading>
                <Text fontSize="3xl" fontWeight="bold" color="white" mt={4} display="inline-block">
                  {averageSlp}
                </Text>
                <Text ml={2} fontSize="xs" fontWeight="semibold" color="whiteAlpha.700" display="inline-block">
                  /day
                </Text>

                <Text fontSize="sm" fontWeight="semibold" color="whiteAlpha.700">
                  {formatter(averageSlp * price.values.slp, price.locale)}
                </Text>
              </StatCard>
            </GridItem>
            <GridItem colSpan={{ base: 1, lg: 2 }} rowSpan={3}>
              <EarningsCard />
            </GridItem>
          </Grid>
        </>
      )}

      {isError && (
        <Box display="flex" justifyContent="center">
          <StatCard p={8} h="100%" accentColor="red">
            <Stack align="center" justify="center" h="100%" top="10px" spacing={8}>
              <Heading fontSize="xl" mr={16}>
                Something went wrong...
              </Heading>
              <Button onClick={() => undefined}>Retry</Button>
            </Stack>
          </StatCard>
        </Box>
      )}
    </Stack>
  );
};

{
  /* <StatCard accentColor="yellow">
              <Heading size="md" fontWeight="semibold">
                Lifetime SLP
              </Heading>

              <Text fontSize="3xl" fontWeight="bold" mt={4}>
                {Math.floor(lifetimeSlp.total)}
              </Text>
              <Text fontSize="sm" fontWeight="semibold" color={infoColor}>
                {formatter(Math.floor(lifetimeSlp.total) * price.values.slp, price.locale)}
              </Text>
            </StatCard> */
}
