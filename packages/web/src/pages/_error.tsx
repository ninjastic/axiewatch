import { Flex, Heading, Text, Box, Textarea } from '@chakra-ui/react';

interface ErrorProps {
  error: string;
}

const Error = ({ error }: ErrorProps): JSX.Element => {
  return (
    <Flex h="full" flexDir="column" justify="center" align="center">
      <Heading>Internal Error</Heading>
      <Text>Please report this on the EBC discord server.</Text>

      <Box mt={3}>
        <Textarea value={error} />
      </Box>
    </Flex>
  );
};

Error.getInitialProps = ({ err }) => {
  return { error: err };
};

export default Error;
