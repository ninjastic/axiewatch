import { Text, Flex } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useAuth } from '../services/hooks/useAuth';
import { SignInForm } from 'src/components/SignInForm';

const SignInPage = (): JSX.Element => {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session && router.pathname === '/signin') {
      router.push('/profile');
    }
  }, [router, session]);

  return (
    <Flex h="full" maxW="450px" margin="auto" direction="column" align="center" justify="center" p={3}>
      <Text fontSize="2xl" fontWeight="bold">
        Authenticate
      </Text>

      <SignInForm />
    </Flex>
  );
};

export default SignInPage;
