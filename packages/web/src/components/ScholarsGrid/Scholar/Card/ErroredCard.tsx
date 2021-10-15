import { Stack, Box, Text, ButtonGroup, Button } from '@chakra-ui/react';
import { BsArrowRepeat } from 'react-icons/bs';
import { useRecoilValue } from 'recoil';

import { scholarSelector } from '../../../../recoil/scholars';
import { ConfirmDeleteButton } from '../ConfirmDeleteButton';
import { ScholarAddress } from '../ScholarAddress';

interface ErroredCardProps {
  address: string;
  refetch: () => void;
}

export function ErroredCard({ address, refetch }: ErroredCardProps) {
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

      <ButtonGroup>
        <Button
          leftIcon={<BsArrowRepeat />}
          onClick={e => {
            e.stopPropagation();
            refetch();
          }}
        >
          Retry
        </Button>
        <ConfirmDeleteButton scholarAddress={address} />
      </ButtonGroup>
    </Stack>
  );
}
