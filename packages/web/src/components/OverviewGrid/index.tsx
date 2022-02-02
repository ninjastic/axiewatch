import {
  Stack,
  Text,
  SimpleGrid,
  Button,
  Heading,
  Box,
  useColorModeValue,
  Grid,
  GridItem,
  VStack,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';
import StatCard from '@axiewatch/design-system/components/molecules/StatCard';

import { useBatchScholar } from '../../services/hooks/useBatchScholar';
import { scholarsMap } from '../../recoil/scholars';
import { formatter } from '@src/services/formatter';
import { usePrice } from '@src/services/hooks/usePrice';
import EarningsCard from './EarningsCard';

export const OverviewGrid = (): JSX.Element => {
  const textColor = useColorModeValue('gray.500', 'darkGray.300');
  const insideCardBg = useColorModeValue('light.bgLevel1', 'dark.bgLevel2');
  const insideCardTotalBg = useColorModeValue('light.bgLevel3', 'dark.bgLevel3');

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

  const unclaimedSlp = data.reduce(
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
            <GridItem colSpan={1} rowSpan={3}>
              <StatCard cardColor="purple" h="full">
                <Heading size="md" fontWeight="semibold">
                  Unclaimed SLP
                </Heading>
                <StatCard mt={6} bg={insideCardBg}>
                  <Heading size="sm" fontWeight="semibold">
                    Manager
                  </Heading>
                  <Text fontSize="3xl" fontWeight="bold" mt={1}>
                    {unclaimedSlp.manager}
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                    {formatter(unclaimedSlp.manager * price.values.slp, price.locale)}
                  </Text>
                </StatCard>
                <StatCard mt={4} bg={insideCardBg}>
                  <Heading size="sm" fontWeight="semibold">
                    Scholars
                  </Heading>
                  <Text fontSize="3xl" fontWeight="bold" mt={1}>
                    {unclaimedSlp.scholars}
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                    {formatter(unclaimedSlp.scholars * price.values.slp, price.locale)}
                  </Text>
                </StatCard>
                <StatCard mt={4} bg={insideCardTotalBg} accentColor="purple">
                  <Heading size="sm" fontWeight="semibold">
                    Total
                  </Heading>
                  <Text fontSize="3xl" fontWeight="bold" mt={1}>
                    {unclaimedSlp.total}
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                    {formatter(unclaimedSlp.total * price.values.slp, price.locale)}
                  </Text>
                </StatCard>
              </StatCard>
            </GridItem>

            <GridItem rowSpan={3} colSpan={1}>
              <VStack spacing={6}>
                <StatCard cardColor="blue" h="full" w="full">
                  <Heading size="md" fontWeight="semibold">
                    Balance
                  </Heading>
                  <StatCard mt={6} bg={insideCardBg}>
                    <Heading size="sm" fontWeight="semibold">
                      Ronin
                    </Heading>
                    <Text fontSize="3xl" fontWeight="bold" mt={1}>
                      {unclaimedSlp.scholars}
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                      {formatter(unclaimedSlp.scholars * price.values.slp, price.locale)}
                    </Text>
                  </StatCard>
                  <StatCard mt={6} bg={insideCardBg}>
                    <Heading size="sm" fontWeight="semibold">
                      Total
                    </Heading>
                    <Text fontSize="3xl" fontWeight="bold" mt={1}>
                      {unclaimedSlp.scholars}
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                      {formatter(unclaimedSlp.scholars * price.values.slp, price.locale)}
                    </Text>
                  </StatCard>
                </StatCard>
                <StatCard accentColor="red" w="full">
                  <Heading size="sm" fontWeight="semibold">
                    Next SLP Claim
                  </Heading>
                  <Text fontSize="3xl" fontWeight="bold" mt={1}>
                    {unclaimedSlp.total}
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                    {formatter(unclaimedSlp.total * price.values.slp, price.locale)}
                  </Text>
                </StatCard>
              </VStack>
            </GridItem>

            <GridItem colSpan={1} rowSpan={3}>
              <StatCard cardColor="teal" h="full">
                <Heading size="md" fontWeight="semibold">
                  Accounts Summary
                </Heading>
                <StatCard mt={6} bg={insideCardBg}>
                  <Heading size="sm" fontWeight="semibold">
                    Number
                  </Heading>
                  <Text fontSize="3xl" fontWeight="bold" mt={1}>
                    {scholars.length}
                  </Text>
                </StatCard>
                <StatCard mt={4} bg={insideCardBg}>
                  <Heading size="sm" fontWeight="semibold">
                    Average MMR
                  </Heading>
                  <Text fontSize="3xl" fontWeight="bold" mt={1}>
                    {unclaimedSlp.scholars}
                  </Text>
                </StatCard>
                <StatCard mt={4} bg={insideCardBg}>
                  <Heading size="sm" fontWeight="semibold">
                    Axies
                  </Heading>
                  <Text fontSize="3xl" fontWeight="bold" mt={1}>
                    {unclaimedSlp.scholars}
                  </Text>
                </StatCard>
              </StatCard>
            </GridItem>

            <GridItem colSpan={{ base: 1, lg: 2 }} rowSpan={3}>
              <EarningsCard averageSlp={averageSlp} />
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
