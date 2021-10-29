import { Box, Text, ButtonGroup, Button, Flex } from '@chakra-ui/react';
import { BsArrowRepeat } from 'react-icons/bs';
import { useRecoilValue } from 'recoil';

import { scholarSelector } from '../../../../recoil/scholars';
import { Card } from '../../../Card';
import { ConfirmDeleteButton } from '../ConfirmDeleteButton';
import { ScholarAddress } from '../ScholarAddress';

interface ErroredItemProps {
  address: string;
  refetch: () => void;
}

export const ErroredItem = ({ address, refetch }: ErroredItemProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));

  return (
    <Card w="100%" rounded="md">
      <Box minH="75px" d="flex" justifyContent="space-between" alignItems="center" px="5">
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

        <Flex direction="column" align="center">
          <Text fontWeight="bold">Something went wrong...</Text>
          <Text>Either the address is incorrect or the request failed.</Text>
        </Flex>

        <ButtonGroup>
          <Button leftIcon={<BsArrowRepeat />} onClick={() => refetch()}>
            Retry
          </Button>
          <ConfirmDeleteButton scholarAddress={address} />
        </ButtonGroup>
      </Box>
    </Card>
  );
};
