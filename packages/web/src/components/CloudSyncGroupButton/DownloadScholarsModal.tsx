import { Box, Text, Button, Stack, SimpleGrid } from '@chakra-ui/react';
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { ScholarMap, scholarsMap } from 'src/recoil/scholars';
import { serverApi } from '../../services/api';
import { useAuth } from '../../services/hooks/useAuth';
import { modalSelector } from 'src/recoil/modal';

interface UploadScholarsModalProps {
  uploadedScholars: ScholarMap[];
}

export const DownloadScholarsModal = ({ uploadedScholars }: UploadScholarsModalProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [scholars, setScholars] = useRecoilState(scholarsMap);
  const modal = useRecoilValue(modalSelector('downloadScholarsModal'));

  const auth = useAuth();

  const handleDownload = async () => {
    setIsLoading(true);

    const { data } = await serverApi.get('/sync', {
      headers: { authorization: auth.session?.access_token },
    });

    if (data?.scholars) {
      setScholars(data.scholars);
    }

    setIsLoading(false);
    modal.onClose();
  };

  return (
    <Stack spacing={5} p={2}>
      <Text>
        Are you sure you want to{' '}
        <Text as="span" fontWeight="bold" opacity={0.9}>
          download
        </Text>{' '}
        from the cloud and override your current local state?
      </Text>

      <SimpleGrid columns={2} maxH="320px" overflowY="auto">
        <Stack>
          <Text fontWeight="bold" fontSize="lg">
            Local ({scholars.length} scholars)
          </Text>

          <Box mt={3}>
            {scholars.map(scholar => (
              <Stack spacing={0} key={scholar.address}>
                <Text key={scholar.address} opacity={0.9} fontWeight="bold">
                  {scholar.name}
                </Text>

                <Text opacity={0.9} fontSize="sm">
                  {scholar.address.substr(0, 5)}...
                  {scholar.address.substr(scholar.address.length - 5)}
                </Text>
              </Stack>
            ))}
          </Box>
        </Stack>

        <Stack>
          <Text fontWeight="bold" fontSize="lg">
            {'<--'} Cloud ({uploadedScholars.length} scholars)
          </Text>

          <Box mt={3}>
            {uploadedScholars.map(scholar => (
              <Stack spacing={0} key={scholar.address}>
                <Text key={scholar.address} opacity={0.9} fontWeight="bold">
                  {scholar.name}
                </Text>

                <Text opacity={0.9} fontSize="sm">
                  {scholar.address.substr(0, 5)}...
                  {scholar.address.substr(scholar.address.length - 5)}
                </Text>
              </Stack>
            ))}
          </Box>
        </Stack>
      </SimpleGrid>

      <Button onClick={handleDownload} isLoading={isLoading}>
        Download to local
      </Button>
    </Stack>
  );
};
