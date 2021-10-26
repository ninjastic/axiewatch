import { Stack, Text, SimpleGrid } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';

import { useBatchScholar } from '../../services/hooks/useBatchScholar';
import { scholarsMap } from '../../recoil/scholars';
import { AccumulatedSlpCard } from './AccumulatedSlpCard';
import { TotalScholarsCard } from './TotalScholarsCard';
import { NextClaimCard } from './NextClaimCard';
import { SlpAmountCard } from './SlpAmountCard';

export const SummaryCards = (): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const addresses = scholars.filter(scholar => !scholar.inactive).map(scholar => scholar.address);

  const { results, isLoading } = useBatchScholar({ addresses });
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
    <Stack>
      <Text fontWeight="bold" fontSize="lg">
        Summary
      </Text>

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
    </Stack>
  );
};
