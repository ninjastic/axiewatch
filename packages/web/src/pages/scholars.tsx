import { Stack, HStack, Flex, Box, Button, Tooltip } from '@chakra-ui/react';
import { AiOutlineCloudSync } from 'react-icons/ai';
import dynamic from 'next/dynamic';

import { useAuth } from '../services/hooks/useAuth';
import { Header } from '../components/Header';
import { ScholarsGrid } from '../components/ScholarsGrid';
import { ScholarsSorter } from '../components/ScholarsSorter';
import { ScholarsFilterButton } from '../components/ScholarsFilter';
import { useCreateModal } from '../services/hooks/useCreateModal';
import { CloudSyncGroupButton } from '../components/CloudSyncGroupButton';

function SyncButton() {
  const { session } = useAuth();

  const syncModal = useCreateModal({
    id: 'syncModal',
    title: () => 'Sync Scholars',
    content: () => (
      <Box p={5}>
        <CloudSyncGroupButton />
      </Box>
    ),
  });

  return (
    <Tooltip label="Sign in to use the CloudSync" isDisabled={!!session}>
      <Box>
        <Button disabled={!session} leftIcon={<AiOutlineCloudSync />} variant="ghost" onClick={syncModal.onOpen}>
          Sync
        </Button>
      </Box>
    </Tooltip>
  );
}

export const ScholarsPage = (): JSX.Element => {
  return (
    <Box maxW="1450px" margin="auto">
      <Flex direction="column" justify="space-between" px={3} py={6}>
        <Header />

        <Stack spacing={5} mt={8}>
          <HStack justify="flex-end" spacing={5}>
            <SyncButton />
            <ScholarsFilterButton />
            <ScholarsSorter />
          </HStack>

          <ScholarsGrid />
        </Stack>
      </Flex>
    </Box>
  );
};

export default dynamic(() => Promise.resolve(ScholarsPage), { ssr: false });
