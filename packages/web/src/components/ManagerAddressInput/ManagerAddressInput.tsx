import { Heading, Stack, Input, Flex, Button, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useSetRecoilState } from 'recoil';
import { toast } from 'react-toastify';

import { preferencesAtom } from '../../recoil/preferences';
import { checkValidAddress } from '../../services/utils/checkValidAddress';

export const ManagerAddressInput = (): JSX.Element => {
  const setPreferences = useSetRecoilState(preferencesAtom);

  const handleSave = (data: any) => {
    if (!checkValidAddress(data.managerAddress)) {
      toast('Address is invalid.', {
        type: 'error',
      });
      return;
    }

    setPreferences(old => ({ ...old, managerAddress: data.managerAddress }));
  };

  return (
    <Flex h="full" w="500px" flexDir="column" margin="auto" align="center" justify="center">
      <Formik initialValues={{ managerAddress: '' }} onSubmit={handleSave}>
        {({ values, handleChange }) => (
          <Form>
            <Stack spacing={5}>
              <Heading textAlign="center">Manager address</Heading>

              <Text>Please specify which address to send the manager share of the SLP.</Text>

              <Input
                placeholder="Ronin address"
                name="managerAddress"
                onChange={handleChange}
                value={values.managerAddress}
                autoFocus
              />

              <Button mt={2} ml="auto" type="submit">
                Continue
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Flex>
  );
};
