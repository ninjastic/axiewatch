import { Flex, Heading, Text } from '@chakra-ui/react';

const NotFound404 = (): JSX.Element => {
  return (
    <Flex h="full" flexDir="column" justify="center" align="center">
      <Heading>404</Heading>
      <Text>Page not found</Text>
    </Flex>
  );
};

export default NotFound404;
