import { Box, Stack, Heading, Text, UnorderedList, ListItem, Button } from '@chakra-ui/react';
import { useSetRecoilState } from 'recoil';

import { preferencesAtom } from '../../recoil/preferences';

export const PaymentsRiskWarning = (): JSX.Element => {
  const setPreferences = useSetRecoilState(preferencesAtom);

  const handleConfirm = () => {
    setPreferences(old => ({ ...old, doNotShowPaymentsRiskWarning: true }));
  };

  return (
    <Box h="full" maxW="1450px" margin="auto" p={3}>
      <Heading as="h4">Risks of using the automatic payment system</Heading>

      <Stack mt={5} spacing={5}>
        <Text>
          To use automatic payment system, a private-key of the scholar wallet is necessary. This comes with risks,
          since in normal conditions, you should NEVER share your keys with anyone.
        </Text>

        <Text fontWeight="bold" fontSize="24">
          What happens when you input your private-key on the website:
        </Text>

        <UnorderedList px={8}>
          <ListItem>Your private-key will be encrypted locally using a password of your choice.</ListItem>
          <ListItem>The encrypted private-key will be stored on your browser storage.</ListItem>
          <ListItem>
            When you refresh the page, you will need to input the same password to decrypt the private-key.
          </ListItem>
          <ListItem>
            The decrypted private-key will be temporarily stored in the website state (until you refresh).
          </ListItem>
          <ListItem fontWeight="bold">NO PRIVATE-KEY DATA EVER LEAVES YOUR BROWSER.</ListItem>
        </UnorderedList>

        <Text fontWeight="bold" fontSize="24">
          Risks you should be aware of:
        </Text>

        <Stack spacing={3}>
          <Text fontWeight="bold">- Malicious silent update</Text>

          <Text>
            We could potentially send an malicious update that gets your stored private-keys (once you decrypt it) and
            send to a third-party server. We won&apos;t ever do that, but you should be cautious anyways.
          </Text>
        </Stack>

        <Stack spacing={3}>
          <Text fontWeight="bold">- Browser/device malware</Text>

          <Text>
            You could get infected with a malware on your browser or device, which could potentially steal your
            decrypted private-keys (after you put the password).
          </Text>
        </Stack>

        <Stack spacing={3}>
          <Text fontWeight="bold">- Code bug</Text>

          <Text>
            This dashboard is in development, so bugs should be expected. We always try our best to fix them and no f*ck
            up, but for now, we recommend that you send payments in batch (rather than sending all of them at once), if
            you have many scholars.
          </Text>
        </Stack>
      </Stack>

      <Box mt={10}>
        <Button onClick={handleConfirm}>I understand the risks</Button>
      </Box>
    </Box>
  );
};
