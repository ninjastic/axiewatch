import { Flex, Heading, Text } from '@chakra-ui/react';

const Error = (): JSX.Element => {
  return (
    <Flex h="full" flexDir="column" justify="center" align="center">
      <Heading>Internal Error</Heading>
      <Text>Please report this on the EBC discord server.</Text>
    </Flex>
  );
};

export default Error;
