import { Text, Stack, SkeletonText } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { scholarSelector } from '../../../../../recoil/scholars';

interface ScholarFieldTodaySlpProps {
  address: string;
  isLoading: boolean;
}

export const ScholarFieldTodaySlp = ({ address, isLoading }: ScholarFieldTodaySlpProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));

  return (
    <SkeletonText isLoaded={!isLoading} noOfLines={2}>
      <Stack spacing={0}>
        <Text opacity={0.9} fontSize="xs">
          Today
        </Text>

        <Text>{scholar.todaySlp ?? '-'}</Text>
      </Stack>
    </SkeletonText>
  );
};
