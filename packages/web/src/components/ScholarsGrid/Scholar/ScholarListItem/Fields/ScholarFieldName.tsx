import { HStack, Text, Tooltip, SkeletonText } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { ScholarAddress } from '../../ScholarAddress';
import { scholarSelector } from '../../../../../recoil/scholars';

interface ScholarFieldNameProps {
  address: string;
  isLoading: boolean;
}

export const ScholarFieldName = ({ address, isLoading }: ScholarFieldNameProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));

  return (
    <SkeletonText isLoaded={!isLoading} noOfLines={1} maxW={isLoading ? '100px' : '200px'}>
      <HStack spacing={1}>
        <Tooltip label={<Text maxW="200px">{address?.replace('0x', 'ronin:')}</Text>} isDisabled={isLoading}>
          <Text
            fontSize="md"
            fontWeight="bold"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
            maxW="200px"
          >
            {scholar?.name}
          </Text>
        </Tooltip>

        <ScholarAddress address={address} hideAddress />
      </HStack>
    </SkeletonText>
  );
};
