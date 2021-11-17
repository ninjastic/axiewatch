import { Text, SkeletonText, Stack, HStack, Tooltip } from '@chakra-ui/react';
import { IoSchoolOutline } from 'react-icons/io5';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';

import { formatter } from '../../../../../services/formatter';
import { priceAtom } from '../../../../../recoil/price';
import { scholarSelector } from '../../../../../recoil/scholars';
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

interface ScholarFieldScholarShareProps {
  address: string;
  isLoading: boolean;
}

export const ScholarFieldScholarShare = ({ address, isLoading }: ScholarFieldScholarShareProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));
  const preferences = useRecoilValue(preferencesAtom);

  const slp = useMemo(
    () => (preferences.includeRoninBalance ? scholar.slp + scholar.roninSlp : scholar.slp),
    [preferences.includeRoninBalance, scholar.roninSlp, scholar.slp]
  );

  const slpValue = useMemo(() => Math.floor((slp * scholar?.shares?.scholar) / 100), [scholar?.shares?.scholar, slp]);

  return (
    <SkeletonText isLoaded={!isLoading} w="100px" noOfLines={2}>
      <Tooltip label={<TooltipComponent percentage={scholar?.shares?.scholar} slp={slp} />}>
        <Stack spacing={0}>
          <Text opacity={0.9} fontSize="xs">
            Scholar
          </Text>

          <HStack>
            <IoSchoolOutline />
            <Text>{String(slpValue)}</Text>
          </HStack>
        </Stack>
      </Tooltip>
    </SkeletonText>
  );
};
