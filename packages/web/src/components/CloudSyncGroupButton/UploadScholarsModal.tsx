import { Box, Text, Button, Stack, SimpleGrid } from '@chakra-ui/react';
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { serverApi } from '../../services/api';
import { useAuth } from '../../services/hooks/useAuth';
import { ScholarMap, scholarsMap } from '../../recoil/scholars';
import { modalSelector } from 'src/recoil/modal';

interface UploadScholarsModalProps {
  uploadedScholars: ScholarMap[];
}

export const UploadScholarsModal = ({ uploadedScholars }: UploadScholarsModalProps): JSX.Element => {
  const [scholars, setScholars] = useRecoilState(scholarsMap);
  const [isLoading, setIsLoading] = useState(false);
  const modal = useRecoilValue(modalSelector('uploadedScholarsModal'));

  const auth = useAuth();

  const handleUpload = async () => {
    setIsLoading(true);

    const { data } = await serverApi.post(
      '/sync',
      { scholars },
      {
        headers: { authorization: auth.session?.access_token },
      }
    );

    if (data?.scholars) {
      setScholars(data.scholars);
    }

    setIsLoading(false);
    modal.onClose();
  };

  return (
    <Stack spacing={5} p={3}>
      <Text>
        Are you sure you want to{' '}
        <Text as="span" fontWeight="bold" opacity={0.9}>
          upload
        </Text>{' '}
        and override your current scholars state on the cloud?
      </Text>

      <SimpleGrid columns={2} maxH="320px" overflowY="auto">
        <Stack>
          <Text fontWeight="bold" fontSize="lg">
            Local ({scholars.length} scholars) {'-->'}
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
            Cloud ({uploadedScholars.length} scholars)
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

      <Button onClick={handleUpload} isLoading={isLoading}>
        Upload to cloud
      </Button>
    </Stack>
  );
};
