import { Box, Flex, Stack, Text, SimpleGrid, Button } from '@chakra-ui/react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { useMemo } from 'react';
import lodash from 'lodash';

import dayjs from '../../services/dayjs';
import { scholarFilter, scholarSelector, scholarsMap, scholarSort } from '../../recoil/scholars';
import { useBatchScholar } from '@src/services/hooks/useBatchScholar';
import { Scholar } from './Scholar';
import { Card } from '../Card';
import { ParsedScholarData } from '@src/services/utils/parseScholarData';
import { preferencesAtom } from '@src/recoil/preferences';

const useFilterScholars = (scholars: ParsedScholarData[]): ParsedScholarData[] => {
  const { search, onlyClaimable, SLP } = useRecoilValue(scholarFilter);
  const preferences = useRecoilValue(preferencesAtom);
  const sort = useRecoilValue(scholarSort);
  const unixNow = dayjs().unix();

  const getScholarState = useRecoilCallback(({ snapshot }) => (address: string) => {
    return snapshot.getLoadable(scholarSelector(address)).getValue();
  });

  const filtered = scholars.filter(scholar => {
    const state = getScholarState(scholar.address);

    if (search && !state.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (onlyClaimable && unixNow < state.nextClaim) return false;
    if (SLP.above && state.slp < SLP.above) return false;
    if (SLP.under && state.slp > SLP.under) return false;

    return true;
  });

  if (!sort) {
    return filtered;
  }

  const sortedAndFiltered = filtered.sort((scholarA, scholarB) => {
    const stateA = getScholarState(scholarA.address);
    const stateB = getScholarState(scholarB.address);

    const slpValues = {
      a: preferences.includeRoninBalance ? scholarA.slp + scholarA.roninSlp : scholarA.slp,
      b: preferences.includeRoninBalance ? scholarB.slp + scholarB.roninSlp : scholarB.slp,
    };

    switch (sort) {
      case 'Total SLP':
        if (slpValues.a > slpValues.b) return -1;
        if (slpValues.a < slpValues.b) return 1;
        return 1;
      case 'Arena Elo':
        if (scholarA.pvpElo > scholarB.pvpElo) return -1;
        if (scholarA.pvpElo < scholarB.pvpElo) return 1;
        return 0;
      case 'SLP per Day':
        if (scholarA.slpDay > scholarB.slpDay) return -1;
        if (scholarA.slpDay < scholarB.slpDay) return 1;
        return 0;
      case 'SLP Today':
        if (scholarA.todaySlp !== null && scholarB.todaySlp !== null) {
          if (scholarA.todaySlp > scholarB.todaySlp) return -1;
          return 1;
        }
        if (scholarA.todaySlp && !scholarB.todaySlp) return -1;
        if (!scholarA.todaySlp && scholarB.todaySlp) return 1;
        return 0;
      case 'SLP Yesterday':
        if (scholarA.yesterdaySlp !== null && scholarB.yesterdaySlp !== null) {
          if (scholarA.yesterdaySlp > scholarB.yesterdaySlp) return -1;
          return 1;
        }
        if (scholarA.yesterdaySlp && !scholarB.yesterdaySlp) return -1;
        if (!scholarA.yesterdaySlp && scholarB.yesterdaySlp) return 1;
        return 0;
      case 'Next Claim':
        if (scholarA.nextClaim === 0) return 1;
        if (scholarB.nextClaim === 0) return -1;
        if (dayjs.unix(scholarA.nextClaim).isBefore(dayjs.unix(scholarB.nextClaim))) return -1;
        return 1;
      case 'Name':
        if (stateA.name.toLowerCase() > stateB.name.toLowerCase()) return 1;
        if (stateA.name.toLowerCase() < stateB.name.toLowerCase()) return -1;
        return 0;
      default:
        return 1;
    }
  });

  return sortedAndFiltered;
};

interface ScholarsGridProps {
  page: number;
  perPage: number;
  setPage(value: number): void;
}

export const ScholarsGrid = ({ page, setPage, perPage }: ScholarsGridProps): JSX.Element => {
  const map = useRecoilValue(scholarsMap);
  const addresses = useMemo(() => map.map(scholar => scholar.address), [map]);

  const { isLoading, data } = useBatchScholar({ addresses });
  const filteredScholars = useFilterScholars(data);

  const paginationData = useMemo(
    () => filteredScholars.slice(page * perPage, (page + 1) * perPage),
    [filteredScholars, page, perPage]
  );
  const numberOfPages = Math.ceil(filteredScholars.length / perPage);

  return (
    <Box>
      {isLoading && !!map.length && (
        <SimpleGrid gap={3}>
          {lodash.times(Math.min(map.length, 20)).map(x => (
            <Scholar key={x} address="0x" isLoading />
          ))}
        </SimpleGrid>
      )}

      {!isLoading && !!map.length && (
        <SimpleGrid gap={3} columns={{ base: 1, lg: 2, xl: 1 }} mt={2}>
          {paginationData.map(scholar => (
            <Scholar key={scholar.address} address={scholar.address} />
          ))}
        </SimpleGrid>
      )}

      {!map.length && (
        <Card py={8}>
          <Stack>
            <Text fontSize="lg" textAlign="center" fontWeight="bold" variant="faded">
              Oopss... there is nothing to see here
            </Text>

            <Text textAlign="center" variant="faded">
              Try adding your first scholar!
            </Text>
          </Stack>
        </Card>
      )}

      {!!map.length && !isLoading && !filteredScholars.length && (
        <Card py={8}>
          <Stack>
            <Text fontSize="lg" textAlign="center" fontWeight="bold" variant="faded">
              Oopss... there is nothing to see here
            </Text>

            <Text textAlign="center" variant="faded">
              No results match your filters
            </Text>
          </Stack>
        </Card>
      )}

      {!isLoading && !!map.length && numberOfPages > 1 && (
        <Flex align="center" justify="space-between" py={5}>
          <Button onClick={() => setPage(page - 1)} isDisabled={page <= 0}>
            Prev
          </Button>

          <Text>
            Page {page + 1} of {Math.max(numberOfPages, 1)}
          </Text>

          <Button onClick={() => setPage(page + 1)} isDisabled={page + 1 >= numberOfPages}>
            Next
          </Button>
        </Flex>
      )}
    </Box>
  );
};
