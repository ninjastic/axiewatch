import { Button, Spinner, Flex, HStack, Box, Text } from '@chakra-ui/react';
import { BsArrowRepeat } from 'react-icons/bs';

interface RequestStatusFloatingButtonProps {
  errored?: any[];
  isLoading?: boolean;
  isFetching?: boolean;
  refetch?: () => void;
}

export const RequestStatusFloatingButton = ({
  errored,
  isLoading,
  isFetching,
  refetch,
}: RequestStatusFloatingButtonProps): JSX.Element => {
  const shouldShowRetry = !isLoading && errored?.length > 0;

  return (
    <>
      {shouldShowRetry && (
        <Button
          pos="fixed"
          right={5}
          bottom={5}
          borderRadius="full"
          onClick={refetch}
          bg="red.700"
          isLoading={isFetching}
          _hover={{ opacity: isFetching ? 1 : 0.85 }}
        >
          <Flex flexDirection="column" align="center" justify="center">
            {!isFetching && (
              <HStack>
                <BsArrowRepeat />
                <Text fontWeight="bold">Retry {errored.length} failed</Text>
              </HStack>
            )}
          </Flex>
        </Button>
      )}

      {isFetching && !shouldShowRetry && (
        <Box pos="fixed" right={5} bottom={5} borderRadius="full" p={3} variant="ghost">
          <Flex flexDirection="column" align="center" justify="center">
            <Spinner />
          </Flex>
        </Box>
      )}
    </>
  );
};
