import { Button, Spinner, Flex, HStack, Text } from '@chakra-ui/react';
import { BsArrowRepeat } from 'react-icons/bs';

interface RetryFailedButtonProps {
  errored: any[];
  isRefetching: boolean;
  refetch: () => void;
}

export const RetryFailedButton = ({ isRefetching, errored, refetch }: RetryFailedButtonProps): JSX.Element => {
  return (
    <Button pos="fixed" right={5} bottom={5} borderRadius="full" cursor="pointer" onClick={refetch} bg="red.700">
      <Flex flexDirection="column" align="center" justify="center">
        {isRefetching ? (
          <Spinner />
        ) : (
          <HStack>
            <BsArrowRepeat />
            <Text fontWeight="bold">Retry {errored.length} failed</Text>
          </HStack>
        )}
      </Flex>
    </Button>
  );
};
