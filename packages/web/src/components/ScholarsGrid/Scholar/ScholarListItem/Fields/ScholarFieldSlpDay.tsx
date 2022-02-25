import { Text, SkeletonText, SimpleGrid, Tooltip, Stack } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { useCallback } from 'react';

import { formatter } from '../../../../../services/formatter';
import { scholarSelector } from '../../../../../recoil/scholars';
import { priceAtom } from '../../../../../recoil/price';
import { averageRangeAtom } from 'src/recoil/preferences';

interface ScholarFieldSlpDayProps {
  address: string;
  isLoading: boolean;
}

const TooltipScholarSLP = ({ address }: { address: string }): JSX.Element => {
  const price = useRecoilValue(priceAtom);
  const scholar = useRecoilValue(scholarSelector(address));

  return (
    <SimpleGrid>
      <Text>
        {scholar.slpDay} SLP / day ({formatter(scholar.slpDay * price.values.slp, price.locale)})
      </Text>

      <Text>
        {scholar.slpDay * 7} SLP / week ({formatter(scholar.slpDay * price.values.slp * 7, price.locale)})
      </Text>

      <Text>
        {scholar.slpDay * 30} SLP / month ({formatter(scholar.slpDay * price.values.slp * 30, price.locale)})
      </Text>

      <Text fontSize="smaller" opacity={0.9} mt={2}>
        Note: Approximated with the SLP/day
      </Text>
    </SimpleGrid>
  );
};

export const ScholarFieldSlpDay = ({ address, isLoading }: ScholarFieldSlpDayProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));
  const averageRange = useRecoilValue(averageRangeAtom);

  const getSlpDayColor = useCallback(() => {
    if (scholar.slpDay >= (averageRange?.top ?? 120)) return 'green.200';
    if (scholar.slpDay >= (averageRange?.bottom ?? 120) && scholar.slpDay < (averageRange?.top ?? 120))
      return 'red.200';
    if (scholar.slpDay < (averageRange?.bottom ?? 120)) return 'red.300';
    return 'white';
  }, [averageRange?.bottom, averageRange?.top, scholar.slpDay]);

  return (
    <SkeletonText isLoaded={!isLoading} noOfLines={2}>
      <Tooltip label={<TooltipScholarSLP address={scholar.address} />} isDisabled={isLoading}>
        <Stack spacing={0}>
          <Text opacity={0.9} fontSize="xs">
            Average
          </Text>

          <Text color={getSlpDayColor as any} fontWeight="bold" fontSize="sm">
            {scholar.slpDay} / day
          </Text>
        </Stack>
      </Tooltip>
    </SkeletonText>
  );
};
