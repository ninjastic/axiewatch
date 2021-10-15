import { Text, GridItem, SkeletonText, HStack, Image } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { scholarSelector } from '../../../../../recoil/scholars';

interface ScholarFieldTodaySlpProps {
  address: string;
  isLoading: boolean;
}

export const ScholarFieldTodaySlp = ({ address, isLoading }: ScholarFieldTodaySlpProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));

  return (
    <GridItem colSpan={3}>
      <SkeletonText isLoaded={!isLoading} noOfLines={2}>
        <Text fontWeight="bold" mr={1}>
          Today
        </Text>

        <HStack>
          <Image src="/images/axies/slp.png" width="18px" alt="slp" />

          <Text>{scholar.todaySlp ?? '-'}</Text>
        </HStack>
      </SkeletonText>
    </GridItem>
  );
};
