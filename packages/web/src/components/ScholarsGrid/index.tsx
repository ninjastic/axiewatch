import { Box, Stack, Text, SimpleGrid } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';

import { scholarsMap, scholarSort, scholarFilter, scholarsSortSelector } from '../../recoil/scholars';
import { Scholar } from './Scholar';
import { Card } from '../Card';

export const ScholarsGrid = (): JSX.Element => {
  const map = useRecoilValue(scholarsMap);
  const sort = useRecoilValue(scholarSort);
  const filters = useRecoilValue(scholarFilter);

  const getScholars = useRecoilCallback(
    ({ snapshot }) =>
      () =>
        snapshot.getLoadable(scholarsSortSelector).getValue(),
    []
  );

  const scholars = useMemo(() => getScholars(), [map, sort, filters, getScholars]);

  return (
    <Box>
      <SimpleGrid gap={3} columns={{ base: 1, lg: 2, xl: 1 }}>
        {scholars.map(scholar => (
          <Scholar key={scholar.address} address={scholar.address} />
        ))}
      </SimpleGrid>

      {!scholars.length && (
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
    </Box>
  );
};
