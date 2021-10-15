import {
  Input,
  Button,
  FormControl,
  FormLabel,
  Stack,
  InputGroup,
  InputRightElement,
  Spinner,
  Box,
  Text,
  useOutsideClick,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { Formik } from 'formik';
import { useRecoilState, useRecoilValue } from 'recoil';
import { toast } from 'react-toastify';

import { scholarsMap } from '../../../recoil/scholars';
import { preferencesAtom } from '../../../recoil/preferences';
import { modalSelector } from '../../../recoil/modal';
import { getAxieNameFromAddress } from '../../../services/utils/getAxieNameFromAddress';
import { checkValidAddress } from '../../../services/utils/checkValidAddress';
import { ScholarSharesForm } from '../../ScholarSharesForm';

interface HandleSaveData {
  name: string;
  address: string;
  paymentAddress: string;
  shares: {
    manager: number;
    scholar: number;
    investor: number;
  };
}

export const ManualForm = (): JSX.Element => {
  const { onClose } = useRecoilValue(modalSelector('newScholarModal'));

  const [scholars, setScholars] = useRecoilState(scholarsMap);
  const preferences = useRecoilValue(preferencesAtom);

  const nextNumber = scholars.length + 1;

  const [loadingAddress, setLoadingAddress] = useState(false);
  const [loadedName, setLoadedName] = useState('');

  const loadedNameBoxRef = useRef(null);

  useOutsideClick({
    ref: loadedNameBoxRef,
    handler: () => setLoadedName(''),
  });

  const handleSave = (data: HandleSaveData) => {
    const addressWithoutPrefix = data.address.replace('ronin:', '0x');

    if (!data.address) {
      toast('Missing ronin address', {
        type: 'error',
      });

      return;
    }

    if (!checkValidAddress(addressWithoutPrefix)) {
      toast('Address is invalid', {
        type: 'error',
      });

      return;
    }

    if (data.paymentAddress && !checkValidAddress(data.paymentAddress)) {
      toast('Payment address is invalid', {
        type: 'error',
      });

      return;
    }

    if (scholars.find(scholar => scholar.address === addressWithoutPrefix)) {
      toast('This address already exists', {
        type: 'error',
      });

      return;
    }

    if (data.shares.investor + data.shares.manager + Math.abs(data.shares.scholar) > 100) {
      toast('The sum of all shares can not exceed 100%', {
        type: 'error',
      });

      return;
    }

    setScholars(old => [
      ...old,
      {
        name: data.name?.trim() || `Scholar ${nextNumber}`,
        address: addressWithoutPrefix?.trim(),
        paymentAddress: data.paymentAddress?.trim(),
        shares: {
          manager: data.shares.manager,
          investor: data.shares.investor,
          scholar: 100 - (data.shares.manager + data.shares.investor),
        },
        inactive: false,
      },
    ]);
    onClose();
  };

  const handleChangeAddress = async (
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void,
    address: string
  ) => {
    setFieldValue('address', address);
    setLoadingAddress(true);

    const name = await getAxieNameFromAddress({ address });

    setLoadingAddress(false);

    if (name) {
      setLoadedName(name);
    }
  };

  return (
    <Formik
      initialValues={{
        name: ``,
        address: '',
        paymentAddress: '',
        shares: {
          manager: preferences.shares.manager ?? 50,
          scholar: preferences.shares.scholar ?? 50,
          investor: preferences.shares.investor ?? 0,
        },
      }}
      onSubmit={handleSave}
    >
      {({ submitForm, values, handleChange, setFieldValue }) => (
        <Stack spacing={5}>
          <FormControl id="address" isRequired>
            <FormLabel>Address (Ronin)</FormLabel>

            <InputGroup>
              <Input
                name="address"
                placeholder="Address"
                value={values.address}
                onChange={e => handleChangeAddress(setFieldValue, e.target.value)}
                onFocus={e => handleChangeAddress(setFieldValue, e.target.value)}
              />
              {loadingAddress && (
                <InputRightElement>
                  <Spinner size="sm" />
                </InputRightElement>
              )}
            </InputGroup>
            {loadedName && (
              <Box
                ref={loadedNameBoxRef}
                bg="black"
                p={2}
                position="absolute"
                zIndex="888"
                w="100%"
                roundedBottom="sm"
                border="1px"
                borderColor="gray.600"
                cursor="pointer"
                onClick={() => {
                  setFieldValue('name', loadedName);
                  setLoadedName('');
                }}
              >
                <Text>{loadedName}</Text>
              </Box>
            )}
          </FormControl>

          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <Input name="name" placeholder={`Scholar ${nextNumber}`} value={values.name} onChange={handleChange} />
          </FormControl>

          <FormControl id="paymentAddress">
            <FormLabel>Scholar Payment Address (Ronin)</FormLabel>
            <Input
              name="paymentAddress"
              placeholder="Payment Address (optional)"
              value={values.paymentAddress}
              onChange={handleChange}
            />
          </FormControl>

          <ScholarSharesForm
            managerValue={values.shares.manager}
            investorValue={values.shares.investor ?? 0}
            setFieldValue={setFieldValue}
          />

          <Button onClick={submitForm}>Save</Button>
        </Stack>
      )}
    </Formik>
  );
};
