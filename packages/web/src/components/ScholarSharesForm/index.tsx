import {
  FormLabel,
  FormControl,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormHelperText,
  Box,
  Checkbox,
  Stack,
} from '@chakra-ui/react';
import { useState } from 'react';

import { Card } from '../Card';

interface ScholarSharesFormParams {
  label?: string;
  managerValue: number;
  investorValue: number;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}

export const ScholarSharesForm = ({
  label,
  managerValue,
  investorValue,
  setFieldValue,
}: ScholarSharesFormParams): JSX.Element => {
  const [hasInvestor, setHasInvestor] = useState(!!investorValue);

  function handleChangeShare(type: string, value: number) {
    if (value > 100) return;

    if (Number.isNaN(value)) {
      setFieldValue(type, 0);
      return;
    }

    setFieldValue(type, value);
    setFieldValue('shares.scholar', 100 - (managerValue + investorValue));
  }

  return (
    <Card id="shares" p={5}>
      <FormLabel fontWeight="bold">{label || 'Share Division'}</FormLabel>

      <Stack spacing={3}>
        <Box>
          <Checkbox
            isChecked={hasInvestor}
            onChange={e => {
              setHasInvestor(e.target.checked);
              handleChangeShare('shares.investor', 0);
            }}
          >
            Does it have a investor?
          </Checkbox>
        </Box>

        <FormControl id="shares.manager">
          <FormHelperText fontSize={13} mb={1}>
            The manager will get...
          </FormHelperText>
          <NumberInput
            defaultValue={40}
            max={100}
            keepWithinRange
            value={`${managerValue}%`}
            onChange={(_, value) => handleChangeShare('shares.manager', value)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        {hasInvestor && (
          <FormControl id="shares.investor">
            <FormHelperText fontSize={13} mb={1}>
              and the investor...
            </FormHelperText>
            <NumberInput
              defaultValue={60}
              max={100}
              keepWithinRange
              value={`${investorValue}%`}
              onChange={(_, value) => handleChangeShare('shares.investor', value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        )}

        <FormControl id="shares.scholar">
          <FormHelperText fontSize={13} mb={1}>
            Leaving the scholar with...
          </FormHelperText>
          <NumberInput
            defaultValue={60}
            max={100}
            keepWithinRange
            value={`${100 - (managerValue + investorValue)}%`}
            isDisabled
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </Stack>
    </Card>
  );
};
