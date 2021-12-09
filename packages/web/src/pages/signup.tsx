import { Text, Box, Flex, Stack, FormControl, FormLabel, Input, Button, FormErrorMessage } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import * as Yup from 'yup';

import { useAuth } from '../services/hooks/useAuth';

interface SignUpData {
  email: string;
  password: string;
  repeatPassword: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().min(4).required(),
  repeatPassword: Yup.string()
    .min(4)
    .required()
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
});

export const SignUpPage = (): JSX.Element => {
  const { signUp, session, isLoading } = useAuth();

  useEffect(() => {
    if (session) {
      Router.push('/');
    }
  }, [session]);

  const handleSubmit = async (data: SignUpData) => {
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
        <Formik
          initialValues={{ email: '', password: '', repeatPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, values, errors, touched }) => (
            <Form>
              <Stack spacing={5}>
                <FormControl id="email" isInvalid={!!errors.email && touched.email}>
                  <FormLabel>Email</FormLabel>
                  <Input name="email" placeholder="Email" type="email" value={values.email} onChange={handleChange} />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl id="password" isInvalid={!!errors.password && touched.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <FormControl id="repeatPassword" isInvalid={!!errors.repeatPassword && touched.repeatPassword}>
                  <FormLabel>Repeat Password</FormLabel>
                  <Input
                    name="repeatPassword"
                    placeholder="Repeat Password"
                    type="password"
                    value={values.repeatPassword}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.repeatPassword}</FormErrorMessage>
                </FormControl>

                <Button isLoading={isLoading} type="submit">
                  Sign Up
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>

        <Box textAlign="center" mt={5}>
          <Text opacity={0.9}>
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
