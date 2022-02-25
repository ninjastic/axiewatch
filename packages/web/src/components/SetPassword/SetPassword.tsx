import { Heading, Button, Input, Flex, Stack, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { AES, enc } from 'crypto-js';
import { toast } from 'react-toastify';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { useCreateModal } from '../../services/hooks/useCreateModal';
import { hasPasswordAtom, passwordAtom, resetPasswordAndPrivateKeysSelector } from '../../recoil/wallets';
import { modalSelector } from 'src/recoil/modal';

const SetPasswordFooter = (): JSX.Element => {
  const resetPasswordAndPrivateKeys = useSetRecoilState(resetPasswordAndPrivateKeysSelector);
  const modal = useRecoilValue(modalSelector('confirmResetModal'));

  const handleConfirm = () => {
    resetPasswordAndPrivateKeys();
    modal.onClose();
  };

  return (
    <>
      <Button onClick={modal.onClose}>No</Button>

      <Button colorScheme="red" ml={3} onClick={handleConfirm}>
        Yes
      </Button>
    </>
  );
};

export const SetPassword = (): JSX.Element => {
  const [hasPassword, setHasPassword] = useRecoilState(hasPasswordAtom);
  const setPassword = useSetRecoilState(passwordAtom);

  const confirmResetModal = useCreateModal({
    id: 'confirmResetModal',
    title: 'Are you sure?',
    content: 'Are you sure you want to reset your password and private-keys?',
    footer: <SetPasswordFooter />,
  });

  const handleSave = (data: any) => {
    if (!data.password || (!hasPassword.value && !data.repeatPassword)) {
      toast('Your password can not be empty.', {
        type: 'error',
      });
      return;
    }

    if (!hasPassword.value && data.password !== data.repeatPassword) {
      toast('Passwords do not match.', {
        type: 'error',
      });
      return;
    }

    if (hasPassword.value && hasPassword.hash) {
      try {
        const raw = AES.decrypt(hasPassword.hash, data.password)?.toString(enc.Utf8);

        const isValid = raw === 'passwordCheck';

        if (!isValid) {
          toast('Password is invalid.', {
            type: 'error',
          });

          return;
        }
      } catch (error: any) {
        //
      }
    }

    const hash = AES.encrypt('passwordCheck', data.password).toString();

    setPassword(data.password);
    setHasPassword({ value: true, hash });
  };

  return (
    <Flex h="full" flexDir="column" align="center" justify="center">
      <Formik initialValues={{ password: '', repeatPassword: '' }} onSubmit={handleSave}>
        {({ values, handleChange }) => (
          <Form>
            <Stack spacing={5} w="400px">
              <Heading textAlign="center">Password</Heading>

              {hasPassword.value && <Text>Input your password to do onchain transactions.</Text>}

              {!hasPassword.value && <Text>Setup a password to do onchain transactions.</Text>}

              <Input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                value={values.password}
                autoFocus
              />

              {!hasPassword.value && (
                <Input
                  name="repeatPassword"
                  type="password"
                  placeholder="Repeat password"
                  onChange={handleChange}
                  value={values.repeatPassword}
                  autoFocus
                />
              )}

              <Button mt={2} ml="auto" type="submit">
                Continue
              </Button>

              {hasPassword.value && (
                <Button onClick={confirmResetModal.onOpen} opacity={0.9} textAlign="center" variant="link">
                  Or reset password and private-keys
                </Button>
              )}
            </Stack>
          </Form>
        )}
      </Formik>
    </Flex>
  );
};
