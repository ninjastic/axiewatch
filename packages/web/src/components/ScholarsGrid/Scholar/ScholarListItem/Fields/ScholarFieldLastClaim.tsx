import { Text, SkeletonText, Tooltip, Stack, HStack } from '@chakra-ui/react';
import { AiOutlineClockCircle } from 'react-icons/ai';
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

  const lastClaimText = useMemo(() => (lastClaim === 0 ? 'never' : dayjs.unix(lastClaim).fromNow(true)), [lastClaim]);
  const formatted = useMemo(() => dayjs.unix(lastClaim).format('DD MMM YYYY, HH:mm:ss'), [lastClaim]);

  return (
    <SkeletonText isLoaded={!isLoading} noOfLines={2}>
      <Tooltip label={formatted} isDisabled={lastClaim === 0}>
        <Stack spacing={0}>
          <Text opacity={0.9} fontSize="xs">
            Last Claim
          </Text>

          <HStack>
            <AiOutlineClockCircle />
            <Text fontSize="sm">{lastClaimText}</Text>
          </HStack>
        </Stack>
      </Tooltip>
    </SkeletonText>
  );
};
