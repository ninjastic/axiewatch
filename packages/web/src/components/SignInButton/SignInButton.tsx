import { Button } from '@chakra-ui/react';
import Router from 'next/router';

import { useAuth } from '../../services/hooks/useAuth';

export const SignInButton = (): JSX.Element => {
  const { user } = useAuth();

  if (user) {
    return <Button onClick={() => Router.push('/profile')}>My Profile</Button>;
  }

  return <Button onClick={() => Router.push('/signin')}>Sign In</Button>;
};
