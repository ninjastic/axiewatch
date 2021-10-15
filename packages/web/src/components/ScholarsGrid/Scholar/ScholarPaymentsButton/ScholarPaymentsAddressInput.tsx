import { Stack, Input, Flex, Button, FormLabel, FormControl } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRecoilState } from 'recoil';
import { toast } from 'react-toastify';

import { scholarSelector } from '../../../../recoil/scholars';
import { checkValidAddress } from '../../../../services/utils/checkValidAddress';

interface ScholarPaymentsAddressInputParams {
  address: string;
  onSave: () => void;
}

interface FormData {
  paymentAddress: string;
}

export const ScholarPaymentsAddressInput = ({ address, onSave }: ScholarPaymentsAddressInputParams): JSX.Element => {
  const [scholar, setScholar] = useRecoilState(scholarSelector(address));

  const handleSubmit = ({ paymentAddress }: FormData) => {
    if (!checkValidAddress(paymentAddress)) {
      toast('Payment address is invalid.', {
        type: 'error',
      });
      return;
    }

    setScholar(old => ({ ...old, paymentAddress }));

    onSave();
  };

  return (
    <Formik initialValues={{ paymentAddress: scholar.paymentAddress }} onSubmit={handleSubmit}>
      {({ values, handleChange }) => (
        <Form>
          <Stack spacing={5}>
            <FormControl id="paymentAddress">
              <FormLabel>Payment Address (Ronin)</FormLabel>

              <Input
                name="paymentAddress"
                placeholder="Payment Address"
                value={values.paymentAddress}
                onChange={handleChange}
              />
            </FormControl>

            <Flex justifyContent="flex-end">
              <Button width={200} type="submit">
                Save
              </Button>
            </Flex>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
