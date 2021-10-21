import { Text, GridItem, SkeletonText, HStack } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';

import { formatter } from '../../../../../services/formatter';
import { scholarSelector } from '../../../../../recoil/scholars';
import { priceAtom } from '../../../../../recoil/price';
import { preferencesAtom } from '../../../../../recoil/preferences';

interface ScholarFieldManagerShareProps {
  address: string;
  isLoading: boolean;
}

export const ScholarFieldManagerShare = ({ address, isLoading }: ScholarFieldManagerShareProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));
  const preferences = useRecoilValue(preferencesAtom);
  const price = useRecoilValue(priceAtom);

  const slp = useMemo(
    () => (preferences.includeRoninBalance ? scholar.slp + scholar.roninSlp : scholar.slp),
    [preferences.includeRoninBalance, scholar.roninSlp, scholar.slp]
  );

  const slpValue = useMemo(() => Math.floor((slp * scholar.shares.manager) / 100), [scholar.shares.manager, slp]);

  const fiatValue = useMemo(
    () => formatter((slp * price.values.slp * scholar.shares.manager) / 100, price.locale),
    [price.locale, price.values.slp, scholar.shares.manager, slp]
  );

  return (
    <GridItem colSpan={4}>
      <SkeletonText isLoaded={!isLoading} noOfLines={2}>
        <HStack spacing={0}>
          <Text fontWeight="bold" mr={1}>
            Manager
          </Text>
          <Text opacity={0.8} fontSize="sm">
            ({scholar.shares.manager}%)
          </Text>
        </HStack>

        <HStack>
          <Text>{slpValue}</Text>
          <Text opacity={0.8} fontSize="sm">
            ({fiatValue})
          </Text>
        </HStack>
      </SkeletonText>
    </GridItem>
  );
};
