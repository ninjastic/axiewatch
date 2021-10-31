import { HStack, Text, Tooltip } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { ScholarAddress } from '../../ScholarAddress';
import { scholarSelector } from '../../../../../recoil/scholars';

interface ScholarFieldNameProps {
  address: string;
}

export const ScholarFieldName = ({ address }: ScholarFieldNameProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));

  return (
    <HStack spacing={1}>
      <Tooltip label={<Text maxW="200px">{address?.replace('0x', 'ronin:')}</Text>}>
        <Text
          fontSize="md"
          fontWeight="bold"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          overflow="hidden"
          maxW="200px"
        >
          {scholar.name}
        </Text>
      </Tooltip>

      <ScholarAddress address={address} hideAddress />
    </HStack>
  );
};
