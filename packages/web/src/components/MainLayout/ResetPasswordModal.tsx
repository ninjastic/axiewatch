import { Stack, Button, FormControl, FormLabel, Input, Box } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';

import { modalSelector } from 'src/recoil/modal';
import { useAuth } from '../../services/hooks/useAuth';

export const ResetPasswordModal = (): JSX.Element => {
  const modal = useRecoilValue(modalSelector('resetPasswordModal'));

  const { updatePasword } = useAuth();
  const { accessToken } = modal.extra;

  const handleSubmit = async (data: any) => {
    if (!data.password) {
      toast('Password can not be empty', {
        type: 'error',
      });
      return;
    }

    if (data.password !== data.repeatPassword) {
      toast("Passwords don't match", {
        type: 'error',
      });
      return;
    }

    await updatePasword(accessToken, data.password);
    modal.onClose();
  };

  return (
    <Box p={5}>
      <Formik initialValues={{ password: '', repeatPassword: '' }} onSubmit={handleSubmit}>
        {({ values, handleChange }) => (
          <Form>
            <Stack spacing={5}>
              <FormControl>
                <FormLabel>Password</FormLabel>

                <Input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Repeat Password</FormLabel>

                <Input
                  type="password"
                  name="repeatPassword"
                  autoComplete="new-password"
                  placeholder="Repeat Password"
                  value={values.repeatPassword}
                  onChange={handleChange}
                />
              </FormControl>

              <Button type="submit">Complete</Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
