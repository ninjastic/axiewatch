import { Text, GridItem } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { ScholarAddress } from '../../ScholarAddress';
import { scholarSelector } from '../../../../../recoil/scholars';

interface ScholarFieldNameProps {
  address: string;
}

export const ScholarFieldName = ({ address }: ScholarFieldNameProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));

  return (
    <GridItem colSpan={5}>
      <Text fontSize="md" fontWeight="bold" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" maxW="200px">
        {scholar.name}
      </Text>

      <ScholarAddress address={address} />
    </GridItem>
  );
};
