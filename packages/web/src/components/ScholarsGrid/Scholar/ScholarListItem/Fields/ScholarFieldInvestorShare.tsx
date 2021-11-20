import { Text, SkeletonText, HStack, Stack, Tooltip } from '@chakra-ui/react';
import { GiReceiveMoney } from 'react-icons/gi';
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
      <Text>{fiatValue}</Text>

      <HStack>
        <Text opacity={0.9} fontSize="sm">
          {percentage}% share
        </Text>
      </HStack>
    </Stack>
  );
};

interface ScholarFieldInvestorShareProps {
  address: string;
  isLoading: boolean;
}

export const ScholarFieldInvestorShare = ({ address, isLoading }: ScholarFieldInvestorShareProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));
  const preferences = useRecoilValue(preferencesAtom);

  const slp = preferences.includeRoninBalance ? scholar.slp + scholar.roninSlp : scholar.slp;
  const slpValue = Math.floor((slp * (scholar?.shares?.investor ?? 0)) / 100);

  return (
    <SkeletonText isLoaded={!isLoading} noOfLines={2}>
      <Tooltip label={<TooltipComponent percentage={scholar?.shares?.investor} slp={slp} />}>
        <Stack spacing={0}>
          <Text opacity={0.9} fontSize="xs">
            Investor
          </Text>

          <HStack>
            <GiReceiveMoney />
            <Text>{slpValue}</Text>
          </HStack>
        </Stack>
      </Tooltip>
    </SkeletonText>
  );
};
