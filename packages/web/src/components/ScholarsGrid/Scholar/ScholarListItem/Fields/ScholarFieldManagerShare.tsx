import { Text, GridItem, SkeletonText, HStack } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

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

  const slp = preferences.includeRoninBalance ? scholar.slp + scholar.roninSlp : scholar.slp;
  const slpValue = Math.floor((slp * scholar.shares.manager) / 100);
  const fiatValue = formatter((slp * price.values.slp * scholar.shares.manager) / 100, price.locale);

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
