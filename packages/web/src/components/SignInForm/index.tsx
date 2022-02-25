import { Text, Box, Stack, FormControl, FormLabel, Input, Button, FormErrorMessage } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import * as Yup from 'yup';
import { UserCredentials } from '@supabase/supabase-js';

import { useAuth } from 'src/services/hooks/useAuth';

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

export const SignInForm = (): JSX.Element => {
  const { signIn, isLoading } = useAuth();

  const handleSubmit = async (data: UserCredentials) => {
    await signIn({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Box w="100%" mt={5}>
      <Formik initialValues={{ email: '', password: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
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

              <Button isLoading={isLoading} type="submit">
                Sign In
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>

      <Box textAlign="center" mt={5}>
        <Text opacity={0.9}>
          <b>
            <Link href="/reset">Reset your password</Link>
          </b>{' '}
          or{' '}
          <b>
            <Link href="/signup">Sign Up</Link>
          </b>
        </Text>
      </Box>
    </Box>
  );
};
