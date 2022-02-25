import {
  Stack,
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Switch,
  Text,
  HStack,
  useMediaQuery,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import { useRecoilState, useRecoilValue } from 'recoil';
import { BiCheckCircle } from 'react-icons/bi';
import { FiInfo } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { modalSelector } from '../../../recoil/modal';
import { averageRangeAtom, preferencesAtom } from '../../../recoil/preferences';
import { scholarFieldsAtom, scholarParseOptionsAtom } from '../../../recoil/scholars';
import { checkValidAddress } from '../../../services/utils/checkValidAddress';
import { ScholarSharesForm } from '../../ScholarSharesForm';
import { DangerSettingsButton } from './DangerSettingsButton';
import { CurrencySelect } from './CurrencySelect/CurrencySelect';
import { ScholarFieldsControlList } from './ScholarFieldsControl/ScholarFieldsControlList';

export const PreferencesModal = (): JSX.Element => {
  const { onClose } = useRecoilValue(modalSelector('preferencesModal'));

  const [preferences, setPreferences] = useRecoilState(preferencesAtom);
  const [scholarFields, setScholarFields] = useRecoilState(scholarFieldsAtom);
  const [scholarParseOptions, setScholarParseOptions] = useRecoilState(scholarParseOptionsAtom);
  const [averageRange, setAverageRange] = useRecoilState(averageRangeAtom);

  const [isWideVersion] = useMediaQuery('(min-width: 750px)');

  const handleSave = (data: any) => {
    const managerAddressWithoutPrefix = data.managerAddress.replace('ronin:', '0x');

    if (data.shares.investor + data.shares.manager + Math.abs(data.shares.scholar) > 100) {
      toast('The sum of all shares can not exceed 100%', {
        type: 'error',
      });

      return;
    }

    if (data.managerAddress && !checkValidAddress(managerAddressWithoutPrefix)) {
      toast('Manager address is invalid', {
        type: 'error',
      });

      return;
    }
    setPreferences(prev => ({
      ...prev,
      shares: {
        manager: data.shares.manager,
        investor: data.shares.investor,
        scholar: 100 - (data.shares.manager + (data.shares.investor ?? 0)),
      },
      managerAddress: data.managerAddress ? managerAddressWithoutPrefix : '',
      currency: data.currency,
      includeRoninBalance: data.includeRoninBalance,
    }));

    setScholarParseOptions(prev => ({
      ...prev,
      includeTodayOnAverageSlp: data.includeTodayOnAverageSlp,
    }));

    setScholarFields(data.scholarFields);

    setAverageRange(data.averageRange);

    onClose();
  };

  return (
    <Box px={2} py={3}>
      <Formik
        initialValues={{
          shares: {
            scholar: preferences.shares.scholar,
            manager: preferences.shares.manager,
            investor: preferences.shares.investor,
          },
          averageRange: {
            top: averageRange.top,
            bottom: averageRange.bottom,
          },
          managerAddress: preferences.managerAddress ? preferences.managerAddress.replace('0x', 'ronin:') : '',
          currency: preferences.currency,
          includeRoninBalance: preferences.includeRoninBalance,
          includeTodayOnAverageSlp: scholarParseOptions.includeTodayOnAverageSlp,
          scholarFields,
        }}
        onSubmit={handleSave}
      >
        {({ setFieldValue, values, submitForm, handleChange }) => (
          <Stack spacing={6}>
            <FormControl id="currency" maxW={600}>
              <FormLabel>Currency</FormLabel>

              <CurrencySelect setFieldValue={setFieldValue} />
            </FormControl>

            <FormControl id="managerAddress" maxW={600}>
              <FormLabel>Manager Address (Ronin)</FormLabel>

              <Input
                placeholder="Manager Address"
                value={values.managerAddress}
                name="managerAddres"
                onChange={e => setFieldValue('managerAddress', e.target.value)}
              />
            </FormControl>

            <Stack spacing={3}>
              <Text fontWeight="bold">Scholars</Text>

              <FormControl id="includeRoninBalance">
                <HStack>
                  <Switch
                    isChecked={values.includeRoninBalance}
                    onChange={e => setFieldValue('includeRoninBalance', e.target.checked)}
                  />
                  <Text>Include Ronin Balance</Text>
                </HStack>
              </FormControl>

              <FormControl id="includeTodayOnAverageSlp">
                <HStack>
                  <Switch
                    isChecked={values.includeTodayOnAverageSlp}
                    onChange={e => setFieldValue('includeTodayOnAverageSlp', e.target.checked)}
                  />
                  <Text>Include Today on Average SLP</Text>
                </HStack>
              </FormControl>
            </Stack>

            {isWideVersion && (
              <Stack spacing={3}>
                <Text fontWeight="bold">Scholar Fields</Text>

                <FormControl id="scholarFieldsSelector">
                  <ScholarFieldsControlList
                    fields={values.scholarFields}
                    onChange={fields => setFieldValue('scholarFields', fields)}
                  />
                </FormControl>
              </Stack>
            )}

            <FormControl id="averageColors">
              <FormLabel fontWeight="bold">Average SLP color</FormLabel>

              <Stack>
                <Flex align="center">
                  <Icon as={FiInfo} mr={1} />
                  <Text>Green if the value is above</Text>
                  <Input
                    value={values.averageRange.top}
                    name="averageRange.top"
                    onChange={handleChange}
                    maxW="75px"
                    mx={3}
                  />
                </Flex>

                <Flex align="center">
                  <Icon as={FiInfo} mr={1} />
                  <Text>
                    Orange if in the <b>{values.averageRange.top}</b> ~ <b>{values.averageRange.bottom}</b> range
                  </Text>
                </Flex>

                <Flex align="center">
                  <Icon as={FiInfo} mr={1} />
                  <Text>Red if the value is under</Text>
                  <Input
                    value={values.averageRange.bottom}
                    name="averageRange.bottom"
                    onChange={handleChange}
                    maxW="75px"
                    ml={3}
                  />
                </Flex>
              </Stack>
            </FormControl>

            <FormControl id="shares" maxW={600}>
              <ScholarSharesForm
                label="Default Share Division"
                managerValue={values.shares.manager}
                investorValue={values.shares.investor ?? 0}
                setFieldValue={setFieldValue}
              />
            </FormControl>

            <Button onClick={submitForm} leftIcon={<BiCheckCircle />} maxW={600}>
              Save
            </Button>

            <Divider />

            <DangerSettingsButton />
          </Stack>
        )}
      </Formik>
    </Box>
  );
};
