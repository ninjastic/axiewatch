import { Text, SkeletonText, HStack, Stack, Tooltip } from '@chakra-ui/react';
import { MdBusinessCenter } from 'react-icons/md';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';

import { formatter } from '../../../../../services/formatter';
import { scholarSelector } from '../../../../../recoil/scholars';
import { priceAtom } from '../../../../../recoil/price';
import { preferencesAtom } from '../../../../../recoil/preferences';

interface TooltipComponentProps {
  percentage: number;
  slp: number;
}

const TooltipComponent = ({ percentage, slp }: TooltipComponentProps): JSX.Element => {
  const price = useRecoilValue(priceAtom);

  const fiatValue = useMemo(
    () => formatter((slp * price.values.slp * percentage) / 100, price.locale),
    [percentage, price.locale, price.values.slp, slp]
  );

  return (
    <Stack spacing={0} align="center">
      <Text>{String(fiatValue)}</Text>

      <HStack>
        <Text opacity={0.9} fontSize="sm">
          {String(percentage)}% share
        </Text>
      </HStack>
    </Stack>
  );
};

interface ScholarFieldManagerShareProps {
  address: string;
  isLoading: boolean;
}

export const ScholarFieldManagerShare = ({ address, isLoading }: ScholarFieldManagerShareProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));
  const preferences = useRecoilValue(preferencesAtom);

  const slp = useMemo(
    () => (preferences.includeRoninBalance ? scholar.slp + scholar.roninSlp : scholar.slp),
    [preferences.includeRoninBalance, scholar.roninSlp, scholar.slp]
  );

  const slpValue = useMemo(() => Math.floor((slp * scholar?.shares?.manager) / 100), [scholar?.shares?.manager, slp]);

  return (
    <SkeletonText isLoaded={!isLoading} noOfLines={2}>
      <Tooltip label={<TooltipComponent percentage={scholar?.shares?.manager} slp={slp} />}>
        <Stack spacing={0}>
          <Text opacity={0.9} fontSize="xs">
            Manager
          </Text>

          <HStack>
            <MdBusinessCenter />
            <Text>{String(slpValue)}</Text>
          </HStack>
        </Stack>
      </Tooltip>
    </SkeletonText>
  );
};
