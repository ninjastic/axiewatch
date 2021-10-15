import { Button, Stack, Input, Flex, FormControl, FormLabel } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { toast } from 'react-toastify';

import { scholarSelector } from '../../../../recoil/scholars';
import { walletMapAtom, walletSelector } from '../../../../recoil/wallets';
import { testRoninPrivateKey } from '../../../../services/utils/testRoninPrivateKey';

interface WalletSetterParams {
  address: string;
  onSave: () => any;
}

interface FormData {
  privateKey: string;
}

export const ScholarPrivateKeyInput = ({ address, onSave }: WalletSetterParams): JSX.Element => {
  const setWalletMap = useSetRecoilState(walletMapAtom);
  const setWallet = useSetRecoilState(walletSelector(address));

  const scholar = useRecoilValue(scholarSelector(address));

  const handleSave = async ({ privateKey }: FormData) => {
    const isPrivKeyCorrect = await testRoninPrivateKey({
      address: scholar.address,
      privateKey,
    });

    if (!isPrivKeyCorrect) {
      toast("Private-key doesn't resolve to the scholarship address.", {
        type: 'error',
      });
      return;
    }

    setWalletMap(old => [...old, address]);
    setWallet({ walletKey: privateKey, address: scholar.address });

    onSave();
  };

  return (
    <Formik initialValues={{ privateKey: '' }} onSubmit={handleSave}>
      {({ values, handleChange }) => (
        <Form>
          <Stack spacing={5}>
            <FormControl id="privateKey">
              <FormLabel>Private key (Ronin)</FormLabel>
              <Input
                name="privateKey"
                placeholder="Private key"
                type="password"
                value={values.privateKey}
                onChange={handleChange}
              />
            </FormControl>

            <Flex justifyContent="flex-end">
              <Button type="submit" width={200}>
                Save
              </Button>
            </Flex>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
