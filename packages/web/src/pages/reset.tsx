import { Text, Box, Flex, Stack, FormControl, FormLabel, Input, Button, FormErrorMessage } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import * as Yup from 'yup';

import { useAuth } from '../services/hooks/useAuth';

interface ResetPasswordData {
  email: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
});

function ResetPasswordPage() {
  const { resetPassword, isLoading } = useAuth();

  const handleSubmitReset = async (data: ResetPasswordData) => {
    await resetPassword(data.email);
  };

  return (
    <Flex h="full" maxW="450px" margin="auto" direction="column" align="center" justify="center" p={3}>
      <Text fontSize="2xl" fontWeight="bold">
        Reset Password
      </Text>

      <Box w="100%" mt={5}>
        <Formik initialValues={{ email: '' }} validationSchema={validationSchema} onSubmit={handleSubmitReset}>
          {({ handleChange, values, errors, touched }) => (
            <Form>
              <Stack spacing={5}>
                <FormControl id="email" isInvalid={!!errors.email && touched.email}>
                  <FormLabel>Email</FormLabel>
                  <Input name="email" placeholder="Email" type="email" value={values.email} onChange={handleChange} />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <Button isLoading={isLoading} type="submit">
                  Request Email
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>

        <Box textAlign="center" mt={5}>
          <Text opacity={0.9}>
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
