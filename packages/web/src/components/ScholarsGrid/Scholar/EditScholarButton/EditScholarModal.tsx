import {
  Box,
  FormLabel,
  Button,
  Input,
  HStack,
  Stack,
  FormControl,
  Flex,
  Text,
  Checkbox,
  Tooltip,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import { useRecoilState, useRecoilValue } from 'recoil';
import { BiCheckCircle } from 'react-icons/bi';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';

import { scholarSelector } from '../../../../recoil/scholars';
import { modalSelector } from '../../../../recoil/modal';
import { checkValidAddress } from '../../../../services/utils/checkValidAddress';
import { ScholarSharesForm } from '../../../ScholarSharesForm';
import { ConfirmDeleteButton } from '../ConfirmDeleteButton';

interface EditScholarModalParams {
  name: string;
  address: string;
}

interface FormData {
  name: string;
  address: string;
  paymentAddress: string;
  shares: {
    scholar: number;
    manager: number;
    investor: number;
  };
  inactive: boolean;
}

export const EditScholarModal = ({ name, address }: EditScholarModalParams): JSX.Element => {
  const { onClose } = useRecoilValue(modalSelector('editScholarModal'));

  const [scholar, setScholar] = useRecoilState(scholarSelector(address));

  const handleUpdate = (data: FormData) => {
    if (data.paymentAddress && !checkValidAddress(data.paymentAddress)) {
      toast('Payment address is invalid.', {
        type: 'error',
      });
      return;
    }

    if (!data.name) {
      toast('The scholar name can not be empty.', {
        type: 'error',
      });
      return;
    }

    setScholar(oldScholar => ({
      ...oldScholar,
      ...data,
      shares: {
        manager: data.shares.manager,
        investor: data.shares.investor,
        scholar: 100 - (data.shares.manager + data.shares.investor),
      },
    }));

    onClose();

    toast(`Scholar ${scholar?.address.substr(0, 5)} was updated.`, {
      type: 'success',
    });
  };

  return (
    <Formik
      initialValues={{
        name,
        address,
        paymentAddress: scholar.paymentAddress,
        shares: {
          scholar: scholar.shares?.scholar ?? 50,
          manager: scholar.shares?.manager ?? 50,
          investor: scholar.shares?.investor ?? 0,
        },
        inactive: scholar.inactive,
      }}
      onSubmit={handleUpdate}
    >
      {({ values, handleChange, setFieldValue, submitForm }) => (
        <Stack spacing={5}>
          <FormControl id="address">
            <FormLabel>Address (Ronin)</FormLabel>

            <Text opacity={0.9}>{values.address}</Text>
          </FormControl>

          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>

            <Input name="name" placeholder="Name" defaultValue={values.name} onChange={handleChange} />
          </FormControl>

          <FormControl id="paymentAddress">
            <FormLabel>Payment Address (Ronin)</FormLabel>

            <Input
              name="paymentAddress"
              placeholder="Payment Address (optional)"
              defaultValue={values.paymentAddress}
              onChange={handleChange}
            />
          </FormControl>

          <ScholarSharesForm
            managerValue={values.shares.manager}
            investorValue={values.shares.investor ?? 0}
            setFieldValue={setFieldValue}
          />

          <FormControl id="inactive">
            <HStack>
              <Checkbox
                name="inactive"
                isChecked={values.inactive}
                onChange={e => setFieldValue('inactive', e.target.checked)}
              >
                Inactive
              </Checkbox>

              <Tooltip label="Moved to the end of the list, hidden on the calendar page and from the dashboard data.">
                <Box>
                  <AiOutlineInfoCircle />
                </Box>
              </Tooltip>
            </HStack>
          </FormControl>

          <Flex justify="space-between" align="center" mt={5} py={3}>
            <ConfirmDeleteButton scholarAddress={address} />

            <Button leftIcon={<BiCheckCircle />} onClick={submitForm}>
              Update
            </Button>
          </Flex>
        </Stack>
      )}
    </Formik>
  );
};
