import { Box, Stack, Text, SimpleGrid } from '@chakra-ui/react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { useEffect, useMemo } from 'react';
import lodash from 'lodash';

import dayjs from '../../services/dayjs';
import { preferencesAtom } from 'src/recoil/preferences';
import {
  scholarFilter,
  ScholarMap,
  scholarSelector,
  scholarsMap,
  scholarSort,
  scholarsPerPageAtom,
} from '../../recoil/scholars';
import { useBatchScholar } from 'src/services/hooks/useBatchScholar';
import { Scholar } from './Scholar';
import { Card } from '../Card';
import { Pagination } from '../Pagination';
import { RequestStatusFloatingButton } from '../RequestStatusFloatingButton';

const useFilterScholars = (scholars: ScholarMap[]): ScholarMap[] => {
  const { search, onlyClaimable, SLP } = useRecoilValue(scholarFilter);
  const preferences = useRecoilValue(preferencesAtom);
  const sort = useRecoilValue(scholarSort);

  const getScholarState = useRecoilCallback(({ snapshot }) => (address: string) => {
    return snapshot.getLoadable(scholarSelector(address)).getValue();
  });

  const filtered = useMemo(
    () =>
      scholars.filter(scholar => {
        const state = getScholarState(scholar.address);
        const unixNow = dayjs().unix();

        if (search && !state.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (onlyClaimable && unixNow < state.nextClaim) return false;
        if (SLP.above && state.slp < SLP.above) return false;
        if (SLP.under && state.slp > SLP.under) return false;

        return true;
      }),
    [SLP.above, SLP.under, getScholarState, onlyClaimable, scholars, search]
  );

  const sortedAndFiltered = useMemo(
    () =>
      filtered.sort((scholarA, scholarB) => {
        const stateA = getScholarState(scholarA.address);
        const stateB = getScholarState(scholarB.address);

        const slpValues = {
          a: preferences.includeRoninBalance ? stateA.slp + stateA.roninSlp : stateA.slp,
          b: preferences.includeRoninBalance ? stateB.slp + stateB.roninSlp : stateB.slp,
        };

        switch (sort) {
          case 'Total SLP':
            if (slpValues.a > slpValues.b) return -1;
            if (slpValues.a < slpValues.b) return 1;
            return 1;
          case 'Arena Elo':
            if (stateA.pvpElo > stateB.pvpElo) return -1;
            if (stateA.pvpElo < stateB.pvpElo) return 1;
            return 0;
          case 'SLP per Day':
            if (stateA.slpDay > stateB.slpDay) return -1;
            if (stateA.slpDay < stateB.slpDay) return 1;
            return 0;
          case 'SLP Today':
            if (stateA.todaySlp !== null && stateB.todaySlp !== null) {
              if (stateA.todaySlp > stateB.todaySlp) return -1;
              return 1;
            }
            if (stateA.todaySlp && !stateB.todaySlp) return -1;
            if (!stateA.todaySlp && stateB.todaySlp) return 1;
            return 0;
          case 'SLP Yesterday':
            if (stateA.yesterdaySlp !== null && stateB.yesterdaySlp !== null) {
              if (stateA.yesterdaySlp > stateB.yesterdaySlp) return -1;
              return 1;
            }
            if (stateA.yesterdaySlp && !stateB.yesterdaySlp) return -1;
            if (!stateA.yesterdaySlp && stateB.yesterdaySlp) return 1;
            return 0;
          case 'Next Claim':
            if (stateA.nextClaim === 0) return 1;
            if (stateB.nextClaim === 0) return -1;
            if (dayjs.unix(stateA.nextClaim).isBefore(dayjs.unix(stateB.nextClaim))) return -1;
            return 1;
          case 'Name':
            if (stateA.name.toLowerCase() > stateB.name.toLowerCase()) return 1;
            if (stateA.name.toLowerCase() < stateB.name.toLowerCase()) return -1;
            return 0;
          default:
            return 1;
        }
      }),
    [filtered, getScholarState, preferences.includeRoninBalance, sort]
  );

  const hasInactive = useMemo(() => filtered.find(scholar => scholar.inactive), [filtered]);

  if (!sort) {
    if (!hasInactive) return filtered;

    return filtered.sort((a, b) => {
      if (a.inactive && !b.inactive) return 1;
      if (b.inactive && !a.inactive) return -1;
      return 0;
    });
  }

  if (!hasInactive) return sortedAndFiltered;

  return sortedAndFiltered.sort((a, b) => {
    if (a.inactive && !b.inactive) return 1;
    if (b.inactive && !a.inactive) return -1;
    return 0;
  });
};

interface ScholarsGridProps {
  page: number;
  setPage(value: number): void;
}

export const ScholarsGrid = ({ page, setPage }: ScholarsGridProps): JSX.Element => {
  const map = useRecoilValue(scholarsMap);
  const addresses = useMemo(() => map.map(scholar => scholar.address), [map]);

  const filters = useRecoilValue(scholarFilter);
  const perPage = useRecoilValue(scholarsPerPageAtom);

  const { isLoading, data, refetch, isRefetching, isFetching } = useBatchScholar({ addresses });

  const filteredScholars = useFilterScholars(map);
  const erroredScholars = useMemo(
    () => (!isLoading ? data.filter(scholar => scholar.errored || scholar.pvpErrored) : []),
    [data, isLoading]
  );

  const paginationData = useMemo(
    () => filteredScholars.slice((page - 1) * perPage, page * perPage),
    [filteredScholars, page, perPage]
  );
  const numberOfPages = Math.ceil(filteredScholars.length / perPage);

  useEffect(() => {
    setPage(1);
  }, [filters, setPage]);

  return (
    <Box>
      {isLoading && !!map.length && (
        <SimpleGrid gap={3} columns={{ base: 1, lg: 2, xl: 1 }}>
          {lodash.times(Math.min(map.length, 20)).map(x => (
            <Scholar key={x} address="0x" isLoading />
          ))}
        </SimpleGrid>
      )}

      {!isLoading && !!map.length && (
        <SimpleGrid gap={3} columns={{ base: 1, lg: 2, xl: 1 }}>
          {paginationData.map(scholar => (
            <Scholar key={scholar.address} address={scholar.address} />
          ))}
        </SimpleGrid>
      )}

      {!map.length && (
        <Card py={10} px={2}>
          <Stack>
            <Text fontSize="lg" textAlign="center" fontWeight="bold" variant="faded">
              There is nothing to see here...
            </Text>

            <Text textAlign="center" variant="faded">
              Add your first scholar or sync your account
            </Text>
          </Stack>
        </Card>
      )}

      {!!map.length && !isLoading && !filteredScholars.length && (
        <Card py={8} px={2}>
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
        <Pagination page={page} setPage={setPage} numberOfPages={numberOfPages} />
      )}

      <RequestStatusFloatingButton
        errored={erroredScholars}
        isLoading={isLoading}
        isFetching={isRefetching || isFetching}
        refetch={refetch}
      />
    </Box>
  );
};
