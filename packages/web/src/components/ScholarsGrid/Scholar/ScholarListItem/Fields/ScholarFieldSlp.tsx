import { Text, GridItem, SkeletonText, HStack, Image } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';

import { formatter } from '../../../../../services/formatter';
import { priceAtom } from '../../../../../recoil/price';
import { scholarSelector } from '../../../../../recoil/scholars';
import { preferencesAtom } from '../../../../../recoil/preferences';

interface ScholarFieldSlpProps {
  address: string;
  isLoading: boolean;
}

export const ScholarFieldSlp = ({ address, isLoading }: ScholarFieldSlpProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));
  const preferences = useRecoilValue(preferencesAtom);
  const price = useRecoilValue(priceAtom);

  const slp = useMemo(
    () => (preferences.includeRoninBalance ? scholar.slp + scholar.roninSlp : scholar.slp),
    [preferences.includeRoninBalance, scholar.roninSlp, scholar.slp]
  );

  const fiatValue = useMemo(
    () => formatter(slp * price.values.slp, price.locale),
    [price.locale, price.values.slp, slp]
  );

  return (
    <GridItem colSpan={4}>
      <SkeletonText isLoaded={!isLoading} noOfLines={2}>
        <HStack>
          <Image src="/images/axies/slp.png" width="18px" alt="slp" />

          <Text>{slp}</Text>
        </HStack>

        <Text opacity={0.8} fontSize="sm">
          (≈{fiatValue})
        </Text>
      </SkeletonText>
    </GridItem>
  );
};
