import { Text, SkeletonText } from '@chakra-ui/react';

import { PveStats } from '../../PveStats';

interface ScholarFieldAdventureSlpProps {
  address: string;
  isLoading: boolean;
}

export const ScholarFieldAdventureSlp = ({ address, isLoading }: ScholarFieldAdventureSlpProps): JSX.Element => {
  return (
    <SkeletonText isLoaded={!isLoading} noOfLines={2}>
      <Text opacity={0.9} fontSize="xs">
        Adventure
      </Text>
      <PveStats address={address} />
    </SkeletonText>
  );
};
