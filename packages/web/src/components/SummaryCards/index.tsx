import { Stack, Text, SimpleGrid } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { useBatchScholar } from '../../services/hooks/useBatchScholar';
import { scholarsMap } from '../../recoil/scholars';
import { AccumulatedSlpCard } from './AccumulatedSlpCard';
import { TotalScholarsCard } from './TotalScholarsCard';
import { NextClaimCard } from './NextClaimCard';
import { SlpAmountCard } from './SlpAmountCard';

export const SummaryCards = (): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const addresses = scholars.map(scholar => scholar.address);

  const { results, isLoading } = useBatchScholar({ addresses });
  const resultsWithSuccess = results.filter(result => result.isSuccess);

  const farmedYesterday = !isLoading
    ? resultsWithSuccess.reduce((prev, currResult) => {
        const { scholar } = currResult.data;

        const yesterday = currResult.data.slp.yesterday?.totalSlp;
        const today = currResult.data.slp.today?.totalSlp;

        if (!yesterday) return prev;

        if (!today) {
          const currentTotal =
            Math.abs(scholar.total - scholar.blockchain_related.balance) + scholar.blockchain_related.checkpoint;

          return prev + (currentTotal - yesterday);
        }

        return prev + (today - yesterday);
      }, 0)
    : null;

  const farmedToday = !isLoading
    ? resultsWithSuccess.reduce((prev, currResult) => {
        const { scholar } = currResult.data;
        const todayStart = currResult.data.slp.today?.totalSlp;

        if (!todayStart) return prev;

        const currentTotal =
          Math.abs(scholar.total - scholar.blockchain_related.balance) + scholar.blockchain_related.checkpoint;

        return prev + (currentTotal - todayStart);
      }, 0)
    : null;

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
