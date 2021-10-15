import { Flex, Box, Text, Input, FormControl, FormLabel, Button, Stack, Divider } from '@chakra-ui/react';
import { useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';

import { useAuth } from '../services/hooks/useAuth';
import { CloudSyncGroupButton } from '../components/CloudSyncGroupButton';

export const ProfilePage = (): JSX.Element => {
  const { user, signOut, isUserLoading } = useAuth();

  useEffect(() => {
    if (!isUserLoading && !user) {
      Router.push('/signin');
    }
  }, [user, isUserLoading]);

  if (isUserLoading) {
    return null;
  }

  return (
    <Flex h="full" maxW="450px" margin="auto" direction="column" align="center" justify="center" p={3}>
      <Box w="100%" mt={5}>
        <Stack spacing={5}>
          <Text fontSize="2xl" fontWeight="bold">
            Profile
          </Text>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input defaultValue={user?.email} isReadOnly />
          </FormControl>

          <CloudSyncGroupButton />

          <Divider />

          <Button onClick={signOut}>Sign out</Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default dynamic(() => Promise.resolve(ProfilePage), { ssr: false });
