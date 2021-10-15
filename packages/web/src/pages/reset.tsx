import { Text, Box, Flex, Stack, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { useAuth } from '../services/hooks/useAuth';

function ResetPasswordPage() {
  const { resetPassword, isLoading } = useAuth();

  const handleSubmitReset = async (data: any) => {
    await resetPassword(data.email);
  };

  return (
    <Flex h="full" maxW="450px" margin="auto" direction="column" align="center" justify="center" p={3}>
      <Text fontSize="2xl" fontWeight="bold">
        Reset Password
      </Text>

      <Box w="100%" mt={5}>
        <Formik initialValues={{ email: '' }} onSubmit={handleSubmitReset}>
          {({ handleChange, values }) => (
            <Form>
              <Stack spacing={5}>
                <FormControl id="email">
                  <FormLabel>Email</FormLabel>
                  <Input name="email" placeholder="Email" type="email" value={values.email} onChange={handleChange} />
                </FormControl>

                <Button isLoading={isLoading} type="submit">
                  Request Email
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>

        <Box textAlign="center" mt={5}>
          <Text opacity={0.8}>
            Go back to{' '}
            <Text fontWeight="bold" as="span">
              <Link href="/signin">Sign In</Link>
            </Text>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}

export default dynamic(() => Promise.resolve(ResetPasswordPage), {
  ssr: false,
});
