import { Button, DarkMode } from '@chakra-ui/react';
import { FaSignInAlt } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import Router from 'next/router';

import { useAuth } from '../../services/hooks/useAuth';

export const SignInButton = (): JSX.Element => {
  const { user } = useAuth();

  if (user) {
    return (
      <DarkMode>
        <Button leftIcon={<CgProfile />} onClick={() => Router.push('/profile')} variant="outline">
          {user.email.replace(/@.*/, '')}
        </Button>
      </DarkMode>
    );
  }

  return (
    <DarkMode>
      <Button leftIcon={<FaSignInAlt />} onClick={() => Router.push('/signin')} variant="outline">
        Sign In
      </Button>
    </DarkMode>
  );
};
