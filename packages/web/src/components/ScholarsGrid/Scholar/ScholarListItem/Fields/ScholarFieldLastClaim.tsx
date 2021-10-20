import { Text, GridItem, SkeletonText, Tooltip } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';

import dayjs from '../../../../../services/dayjs';
import { scholarSelector } from '../../../../../recoil/scholars';

interface ScholarFieldLastClaimProps {
  address: string;
  isLoading: boolean;
}

export const ScholarFieldLastClaim = ({ address, isLoading }: ScholarFieldLastClaimProps): JSX.Element => {
  const { lastClaim } = useRecoilValue(scholarSelector(address));

  const lastClaimText = useMemo(() => (lastClaim === 0 ? 'never' : dayjs.unix(lastClaim).fromNow()), [lastClaim]);
  const formatted = useMemo(() => dayjs.unix(lastClaim).format('DD MMM YYYY, HH:mm:ss'), [lastClaim]);

  return (
    <GridItem colSpan={4}>
      <SkeletonText isLoaded={!isLoading} noOfLines={2}>
        <Tooltip label={formatted} isDisabled={lastClaim === 0}>
          <div>
            <Text fontWeight="bold">Last claim</Text>
            <Text>{lastClaimText}</Text>
          </div>
        </Tooltip>
      </SkeletonText>
    </GridItem>
  );
};
