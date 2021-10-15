import { Stack, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { Formik } from 'formik';

interface ImportFormParams {
  onSubmit: (data: any) => void;
}

export function ImportForm({ onSubmit }: ImportFormParams) {
  return (
    <Formik
      initialValues={{
        walletSeed: '',
        derivationPath: "m/44'/60'/0'/0",
        maxDepth: 10,
      }}
      onSubmit={onSubmit}
    >
      {({ values, handleChange, submitForm }) => (
        <Stack spacing={5}>
          <FormControl id="Wallet seed">
            <FormLabel>Wallet seed</FormLabel>

            <Input
              name="walletSeed"
              placeholder="apple seed horse ..."
              type="password"
              value={values.walletSeed}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="Derivation path">
            <FormLabel>Derivation path</FormLabel>

            <Input
              name="derivationPath"
              placeholder="m/44'/60'/0'/0"
              value={values.derivationPath}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="Max depth">
            <FormLabel>Max depth</FormLabel>

            <Input name="maxDepth" placeholder="10" value={values.maxDepth} onChange={handleChange} />
          </FormControl>

          <Button onClick={submitForm}>Import</Button>
        </Stack>
      )}
    </Formik>
  );
}
