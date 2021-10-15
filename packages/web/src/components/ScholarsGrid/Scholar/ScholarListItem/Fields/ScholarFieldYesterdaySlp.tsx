import { Text, GridItem, SkeletonText, HStack, Image } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { scholarSelector } from '../../../../../recoil/scholars';

interface ScholarFieldYesterdaySlpProps {
  address: string;
  isLoading: boolean;
}

export const ScholarFieldYesterdaySlp = ({ address, isLoading }: ScholarFieldYesterdaySlpProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));

  return (
    <GridItem colSpan={4}>
      <SkeletonText isLoaded={!isLoading} noOfLines={2}>
        <Text fontWeight="bold" mr={1}>
          Yesterday
        </Text>

        <HStack>
          <Image src="/images/axies/slp.png" width="18px" alt="slp" />

          <Text>{scholar.yesterdaySlp ?? '-'}</Text>
        </HStack>
      </SkeletonText>
    </GridItem>
  );
};
