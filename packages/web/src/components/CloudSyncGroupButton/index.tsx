import { Box, Text, Button, ButtonGroup, Stack } from '@chakra-ui/react';
import { FiUpload, FiDownload } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { serverApi } from '../../services/api';
import { ScholarMap, scholarsMap } from '../../recoil/scholars';
import { useCreateModal } from '../../services/hooks/useCreateModal';
import { useAuth } from '../../services/hooks/useAuth';
import { UploadScholarsModal } from './UploadScholarsModal';
import { DownloadScholarsModal } from './DownloadScholarsModal';

export const CloudSyncGroupButton = (): JSX.Element => {
  const auth = useAuth();

  const scholars = useRecoilValue(scholarsMap);

  const [uploadedScholars, setUploadedScholars] = useState<ScholarMap[]>([] as ScholarMap[]);
  const [isLoadingCloud, setIsLoadingCloud] = useState(true);

  const uploadedScholarsModal = useCreateModal({
    id: 'uploadedScholarsModal',
    title: 'Upload Scholars',
    content: <UploadScholarsModal uploadedScholars={uploadedScholars} />,
    size: '2xl',
  });

  const downloadScholarsModal = useCreateModal({
    id: 'downloadScholarsModal',
    title: 'Download scholars',
    size: '2xl',
    content: <DownloadScholarsModal uploadedScholars={uploadedScholars} />,
  });

  useEffect(() => {
    async function loadScholarsCloud() {
      const { data } = await serverApi.get('/sync', {
        headers: { authorization: auth.session?.access_token },
      });

      if (data) {
        setUploadedScholars(data?.scholars ?? []);
        setIsLoadingCloud(false);
      }
    }

    if (auth.user) {
      loadScholarsCloud();
    }
  }, [auth.user, scholars, auth.session?.access_token]);

  return (
    <Stack spacing={3}>
      <Box>
        <Text fontWeight="bold">CloudSync Scholars</Text>
        <Text fontSize="sm" opacity={0.9}>
          Keep your scholars synced on our servers so we can track them daily for you. Remember to re-sync every time
          you make a change.
        </Text>
      </Box>

      <ButtonGroup>
        <Button leftIcon={<FiUpload />} onClick={uploadedScholarsModal.onOpen} isLoading={isLoadingCloud}>
          Upload ({scholars.length})
        </Button>

        <Button
          onClick={downloadScholarsModal.onOpen}
          leftIcon={<FiDownload />}
          isLoading={isLoadingCloud}
          isDisabled={!uploadedScholars.length}
        >
          Download ({uploadedScholars.length})
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
