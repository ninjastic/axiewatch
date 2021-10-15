import { Text, Box, Flex, Stack, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';

import { useAuth } from '../services/hooks/useAuth';

export const SignUpPage = (): JSX.Element => {
  const { signUp, session, isLoading } = useAuth();

  useEffect(() => {
    if (session) {
      Router.push('/');
    }
  }, [session]);

  const handleSubmit = async (data: any) => {
    if (data.password !== data.repeatPassword) {
      toast("Passwords don't match", {
        type: 'error',
      });

      return;
    }

    await signUp({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Flex h="full" maxW="450px" margin="auto" direction="column" align="center" justify="center" p={3}>
      <Text fontSize="2xl" fontWeight="bold">
        Create account
      </Text>

      <Box w="100%" mt={5}>
        <Formik initialValues={{ email: '', password: '', repeatPassword: '' }} onSubmit={handleSubmit}>
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

                <FormControl id="repeat-password">
                  <FormLabel>Repeat Password</FormLabel>
                  <Input
                    name="repeatPassword"
                    placeholder="Repeat Password"
                    type="password"
                    value={values.repeatPassword}
                    onChange={handleChange}
                  />
                </FormControl>

                <Button isLoading={isLoading} type="submit">
                  Sign Up
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>

        <Box textAlign="center" mt={5}>
          <Text opacity={0.8}>
            Already have an account?{' '}
            <Text fontWeight="bold" as="span">
              <Link href="/signin">Sign in.</Link>
            </Text>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default SignUpPage;
