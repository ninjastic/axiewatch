import { Text, SkeletonText, Tooltip, Stack, HStack } from '@chakra-ui/react';
import { AiOutlineClockCircle } from 'react-icons/ai';
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
    <SkeletonText isLoaded={!isLoading} noOfLines={2}>
      <Tooltip label={formatted} isDisabled={lastClaim === 0}>
        <Stack spacing={0}>
          <Text opacity={0.9} fontSize="xs">
            Next Claim
          </Text>

          <HStack>
            <AiOutlineClockCircle />
            <Text fontSize="sm">{nextClaimText}</Text>
          </HStack>
        </Stack>
      </Tooltip>
    </SkeletonText>
  );
};
