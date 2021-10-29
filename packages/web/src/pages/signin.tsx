import { Text, Box, Flex, Stack, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link';

import { useAuth } from '../services/hooks/useAuth';

const SignInPage = (): JSX.Element => {
  const { signIn, session, isLoading } = useAuth();

  useEffect(() => {
    if (session) {
      Router.push('/profile');
    }
  }, [session]);

  const handleSubmit = async (data: any) => {
    await signIn({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Flex h="full" maxW="450px" margin="auto" direction="column" align="center" justify="center" p={3}>
      <Text fontSize="2xl" fontWeight="bold">
        Authenticate
      </Text>

      <Box w="100%" mt={5}>
        <Formik initialValues={{ email: '', password: '' }} onSubmit={handleSubmit}>
          {({ handleChange, values }) => (
            <Form>
              <Stack spacing={5}>
                <FormControl id="email">
                  <FormLabel>Email</FormLabel>
                  <Input name="email" placeholder="Email" type="email" value={values.email} onChange={handleChange} />
                </FormControl>

                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                  />
                </FormControl>

                <Button isLoading={isLoading} type="submit">
                  Sign In
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>

        <Box textAlign="center" mt={5}>
          <Text opacity={0.9}>
            <Text fontWeight="bold" as="span">
              <Link href="/reset">Reset your password</Link>
            </Text>{' '}
            or{' '}
            <Text fontWeight="bold" as="span">
              <Link href="/signup">Sign Up</Link>
            </Text>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default SignInPage;
