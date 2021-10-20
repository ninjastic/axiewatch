import { Text, GridItem, SkeletonText, Tooltip } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';

import dayjs from '../../../../../services/dayjs';
import { scholarSelector } from '../../../../../recoil/scholars';

interface ScholarFieldNextClaimProps {
  address: string;
  isLoading: boolean;
}

export const ScholarFieldNextClaim = ({ address, isLoading }: ScholarFieldNextClaimProps): JSX.Element => {
  const { lastClaim, nextClaim } = useRecoilValue(scholarSelector(address));

  const nextClaimIsBeforeText = lastClaim === 0 ? '-' : 'now ✨';

  const nextClaimText = useMemo(
    () => (dayjs.unix(nextClaim).isBefore(dayjs()) ? nextClaimIsBeforeText : dayjs.unix(nextClaim).fromNow()),
    [nextClaim, nextClaimIsBeforeText]
  );

  const formatted = useMemo(() => dayjs.unix(nextClaim).format('DD MMM YYYY, HH:mm:ss'), [nextClaim]);

  return (
    <GridItem colSpan={4}>
      <SkeletonText isLoaded={!isLoading} noOfLines={2}>
        <Tooltip label={formatted} isDisabled={lastClaim === 0}>
          <div>
            <Text fontWeight="bold">Next claim</Text>
            <Text>{nextClaimText}</Text>
          </div>
        </Tooltip>
      </SkeletonText>
    </GridItem>
  );
};
