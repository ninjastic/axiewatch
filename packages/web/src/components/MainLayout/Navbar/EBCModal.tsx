import { Box, Text, HStack, Stack, Image, Button } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { modalSelector } from '../../../recoil/modal';

export const EBCModal = (): JSX.Element => {
  const modal = useRecoilValue(modalSelector('ebcModal'));

  return (
    <Box p={3}>
      <Stack spacing={6}>
        <HStack spacing={5}>
          <Image src="https://www.axielegend.com/images/ebc-logo.png" h="100px" alt="ebc" />

          <Text fontWeight="bold" fontSize="2xl">
            Axie Watch is now merging with the Elite Breeders Club!
          </Text>
        </HStack>

        <Text>
          Through this partnership we will be able to continue high quality development of the fastest growing
          scholarship management tool.
        </Text>

        <Text>
          EBC provides a suite of Axie tools and through this merger, we will be able to provide features and
          integrations not available anywhere else in Axie Infinity.
        </Text>

        <Text>
          I appreciate all the AxieWatch supporters that have helped me come this far and I can&#39;t wait to share with
          you all what comes next!
        </Text>

        <Button onClick={modal.onClose}>Got it!</Button>
      </Stack>
    </Box>
  );
};
