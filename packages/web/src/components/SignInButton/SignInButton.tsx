import { Button } from '@chakra-ui/react';
import { FaSignInAlt } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import Router from 'next/router';

import { useAuth } from '../../services/hooks/useAuth';

export const SignInButton = (): JSX.Element => {
  const { user } = useAuth();

  if (user) {
    return (
      <Button leftIcon={<CgProfile />} onClick={() => Router.push('/profile')} variant="outline">
        {user.email.replace(/@.*/, '')}
      </Button>
    );
  }

  return (
    <Button
      leftIcon={<FaSignInAlt />}
      onClick={() => Router.push('/signin')}
      variant="accent"
      colorScheme="teal"
      size="sm"
    >
      Sign In
    </Button>
  );
};
