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
  FormErrorMessage,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import { useRecoilState, useRecoilValue } from 'recoil';
import { BiCheckCircle } from 'react-icons/bi';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { ScholarMap, scholarSelector } from '../../../../recoil/scholars';
import { modalSelector } from '../../../../recoil/modal';
import { checkValidAddress } from '../../../../services/utils/checkValidAddress';
import { ScholarSharesForm } from '../../../ScholarSharesForm';
import { ConfirmDeleteButton } from '../ConfirmDeleteButton';

interface EditScholarModalParams {
  name: string;
  address: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().min(3).max(50).required(),
  address: Yup.string()
    .required()
    .test('isAddress', 'Address is invalid', address => checkValidAddress(address)),
  paymentAddress: Yup.string()
    .notRequired()
    .test('isPaymentAddress', 'Payment address is invalid', paymentAddress =>
      paymentAddress ? checkValidAddress(paymentAddress) : true
    ),
  shares: Yup.object()
    .shape({
      scholar: Yup.number(),
      manager: Yup.number(),
      investor: Yup.number(),
    })
    .required(),
  discordId: Yup.number().typeError('Discord ID must be a number'),
  inactive: Yup.boolean(),
});

export const EditScholarModal = ({ name, address }: EditScholarModalParams): JSX.Element => {
  const { onClose } = useRecoilValue(modalSelector(`editScholarModal:${address}`));

  const [scholar, setScholar] = useRecoilState(scholarSelector(address));

  const handleUpdate = (data: ScholarMap) => {
    setScholar(oldScholar => ({
      ...oldScholar,
      ...data,
      shares: {
        manager: data.shares.manager,
        investor: data.shares.investor,
        scholar: 100 - (data.shares.manager + data.shares.investor),
      },
      discordId: data.discordId,
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
        discordId: scholar.discordId,
        inactive: scholar.inactive,
      }}
      validationSchema={validationSchema}
      onSubmit={handleUpdate}
    >
      {({ values, handleChange, setFieldValue, submitForm, errors, touched }) => (
        <Stack spacing={5}>
          <FormControl id="address" isRequired isInvalid={!!errors.address && touched.address}>
            <FormLabel>Address (Ronin)</FormLabel>
            <Text opacity={0.9}>{values.address}</Text>
            <FormErrorMessage>{errors.address}</FormErrorMessage>
          </FormControl>

          <FormControl id="name" isRequired isInvalid={!!errors.name && touched.name}>
            <FormLabel>Name</FormLabel>
            <Input name="name" placeholder="Name" defaultValue={values.name} onChange={handleChange} />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl id="paymentAddress" isInvalid={!!errors.paymentAddress && touched.paymentAddress}>
            <FormLabel>Payment Address (Ronin)</FormLabel>
            <Input
              name="paymentAddress"
              placeholder="Payment Address (optional)"
              defaultValue={values.paymentAddress}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.paymentAddress}</FormErrorMessage>
          </FormControl>

          <ScholarSharesForm
            managerValue={values.shares.manager}
            investorValue={values.shares.investor ?? 0}
            setFieldValue={setFieldValue}
          />

          <FormControl id="discordId" isInvalid={!!errors.discordId && touched.discordId}>
            <FormLabel>Discord ID (optional)</FormLabel>
            <Input
              name="discordId"
              placeholder="133630993356554240"
              defaultValue={values.discordId}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.discordId}</FormErrorMessage>
          </FormControl>

          <FormControl id="inactive" isInvalid={!!errors.inactive && touched.inactive}>
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
