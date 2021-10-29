import { Text, Stack, SkeletonText } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { scholarSelector } from '../../../../../recoil/scholars';

interface ScholarFieldYesterdaySlpProps {
  address: string;
  isLoading: boolean;
}

export const ScholarFieldYesterdaySlp = ({ address, isLoading }: ScholarFieldYesterdaySlpProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));

  return (
    <SkeletonText isLoaded={!isLoading} noOfLines={2}>
      <Stack spacing={0}>
        <Text opacity={0.9} fontSize="xs">
          Yesterday
        </Text>

        <Text>{scholar.yesterdaySlp ?? '-'}</Text>
      </Stack>
    </SkeletonText>
  );
};
