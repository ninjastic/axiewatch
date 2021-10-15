import { GridItem, Text, SkeletonText } from '@chakra-ui/react';

import { PveStats } from '../../PveStats';

interface ScholarFieldAdventureSlpProps {
  address: string;
  isLoading: boolean;
}

export const ScholarFieldAdventureSlp = ({ address, isLoading }: ScholarFieldAdventureSlpProps): JSX.Element => {
  return (
    <GridItem colSpan={4}>
      <SkeletonText isLoaded={!isLoading} noOfLines={2}>
        <Text fontWeight="bold">Adventure</Text>
        <PveStats address={address} />
      </SkeletonText>
    </GridItem>
  );
};
