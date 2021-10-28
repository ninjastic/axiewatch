import { Stack, Text, SimpleGrid, Button } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';

import { useBatchScholar } from '../../services/hooks/useBatchScholar';
import { scholarsMap } from '../../recoil/scholars';
import { AccumulatedSlpCard } from './AccumulatedSlpCard';
import { TotalScholarsCard } from './TotalScholarsCard';
import { NextClaimCard } from './NextClaimCard';
import { SlpAmountCard } from './SlpAmountCard';
import { Card } from '../Card';

export const SummaryCards = (): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const addresses = scholars.filter(scholar => !scholar.inactive).map(scholar => scholar.address);

  const { results, isLoading, isError, refetchAll } = useBatchScholar({ addresses });
  const resultsWithSuccess = results.filter(result => result.isSuccess);

  const farmedYesterday = useMemo(
    () =>
      resultsWithSuccess.reduce((prev, currResult) => {
        const { scholar } = currResult.data;

        const yesterday = currResult.data.historical?.yesterday?.totalSlp;
        const today = currResult.data.historical?.today?.totalSlp;

        if (!yesterday) return prev;

        if (!today) {
          return prev + (scholar.totalSlp - yesterday);
        }

        return prev + (today - yesterday);
      }, 0),
    [resultsWithSuccess]
  );

  const farmedToday = useMemo(
    () =>
      resultsWithSuccess.reduce((prev, currResult) => {
        const { scholar } = currResult.data;
        const todayStart = currResult.data.historical?.today?.totalSlp;

        if (!todayStart) return prev;

        return prev + (scholar.totalSlp - todayStart);
      }, 0),
    [resultsWithSuccess]
  );

  return (
    <Stack h="100%">
      <Text fontWeight="bold" fontSize="lg">
        Summary
      </Text>

      {!isError && (
        <SimpleGrid columns={1} gap={2}>
          <TotalScholarsCard data={results} isLoading={isLoading} />

          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={2}>
            <AccumulatedSlpCard data={results} isLoading={isLoading} />
            <NextClaimCard data={results} isLoading={isLoading} />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={2}>
            <SlpAmountCard label="Yesterday" amount={farmedYesterday} isLoading={isLoading} />
            <SlpAmountCard label="Today" amount={farmedToday} isLoading={isLoading} />
          </SimpleGrid>
        </SimpleGrid>
      )}

      {isError && (
        <Card p={3} h="100%">
          <Stack align="center" justify="center" h="100%">
            <Text fontWeight="bold">Something went wrong...</Text>
            <Button onClick={() => refetchAll()}>Retry</Button>
          </Stack>
        </Card>
      )}
    </Stack>
  );
};
