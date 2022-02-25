import { Button, FormControl, Stack, HStack, Textarea, Text } from '@chakra-ui/react';
import { Formik } from 'formik';
import { useRecoilState, useRecoilValue } from 'recoil';
import { toast } from 'react-toastify';

import { scholarsMap, ScholarMap } from '../../../recoil/scholars';
import { preferencesAtom } from '../../../recoil/preferences';
import { modalSelector } from '../../../recoil/modal';
import { checkValidAddress } from 'src/services/utils/checkValidAddress';

interface HandleSaveData {
  addresses: string;
}

export const ListForm = (): JSX.Element => {
  const { onClose } = useRecoilValue(modalSelector('newScholarModal'));

  const [scholars, setScholars] = useRecoilState(scholarsMap);
  const preferences = useRecoilValue(preferencesAtom);

  const nextNumber = scholars.length + 1;

  const handleSave = (data: HandleSaveData) => {
    const lines = data.addresses.split('\n');
    const newList = [] as ScholarMap[];

    function cleanString(text: string) {
      return text && text?.replaceAll('"', '').trim();
    }

    let error = '';

    lines
      .map(line => line.trim())
      .filter(line => !!line)
      .forEach((line, index) => {
        const [rawAddress, rawName, rawScholar, rawManager, rawInvestor, rawPaymentAddress] = line.split(',');

        const address = cleanString(rawAddress)?.replace('ronin:', '0x');
        const name = cleanString(rawName) || `Scholar ${nextNumber + index}`;
        const scholarShare = cleanString(rawScholar);
        const managerShare = cleanString(rawManager);
        const investorShare = cleanString(rawInvestor);
        const paymentAddress = cleanString(rawPaymentAddress)?.replace('ronin:', '0x');

        const scholarAlreadyExists = scholars.find(scholar => scholar.address.toLowerCase() === address.toLowerCase());
        const duplicatedNewScholar = newList.find(n => n.address.toLowerCase() === address);

        if (scholarAlreadyExists || duplicatedNewScholar) {
          return;
        }

        if (!checkValidAddress(address)) {
          error = `Line ${index} error: Address is invalid`;
          return;
        }

        const toAdd = {
          name,
          address,
          paymentAddress,
          shares: {
            scholar: scholarShare ? Number(scholarShare) : preferences.shares.scholar,
            manager: managerShare ? Number(managerShare) : preferences.shares.manager,
            investor: investorShare ? Number(investorShare) : preferences.shares.investor ?? 0,
          },
          inactive: false,
        };

        newList.push(toAdd);
      });

    if (error) {
      toast(error, {
        type: 'error',
      });

      return;
    }

    if (!newList.length) {
      toast('Missing scholars data', {
        type: 'error',
      });

      return;
    }

    setScholars(old => [...old, ...newList]);

    toast(`Added ${newList.length} of ${lines.length} scholars.`, {
      type: 'success',
    });

    onClose();
  };

  return (
    <Formik
      initialValues={{
        addresses: '',
      }}
      onSubmit={handleSave}
    >
      {({ submitForm, values, handleChange }) => (
        <Stack spacing={5}>
          <FormControl id="address">
            <Stack>
              <Stack spacing={0}>
                <Text>Format:</Text>
                <Text>address, name, scholar%, manager%, investor%, scholarPaymentAddress</Text>
              </Stack>

              <Textarea
                name="addresses"
                placeholder="ronin:Abcd,John,60,30,10,ronin:Nxyz"
                value={values.addresses}
                onChange={handleChange}
                height={200}
              />
            </Stack>
          </FormControl>

          <Stack spacing={0}>
            <HStack>
              <Text>Default split:</Text>

              <Text as="span" fontWeight="bold">
                {preferences.shares.scholar}/{preferences.shares.manager}/{preferences.shares.investor ?? 0}
              </Text>
            </HStack>

            <Text opacity={0.9} fontSize="sm">
              [scholar/manager/investor]
            </Text>
          </Stack>

          <Button onClick={submitForm}>Save</Button>
        </Stack>
      )}
    </Formik>
  );
};
