import { Stack, Box, Text } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { scholarSelector } from '../../../../recoil/scholars';
import { ConfirmDeleteButton } from '../ConfirmDeleteButton';
import { ScholarAddress } from '../ScholarAddress';

interface ErroredCardProps {
  address: string;
}

export const ErroredCard = ({ address }: ErroredCardProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));

  return (
    <Stack d="flex" flexDir="column" justifyContent="center" alignItems="center" spacing={5} p={5} h="100%">
      <Box>
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

        <ScholarAddress address={address} />
      </Box>

      <Text fontWeight="bold">Something went wrong...</Text>

      <ConfirmDeleteButton scholarAddress={address} />
    </Stack>
  );
};
