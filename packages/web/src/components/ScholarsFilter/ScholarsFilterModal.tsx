import { Stack, Button, HStack, Text, Code, Flex, Input, Checkbox, Box, FormLabel } from '@chakra-ui/react';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { BiCheckCircle } from 'react-icons/bi';

import { modalSelector } from '../../recoil/modal';
import { scholarFilter, ScholarFilter } from '../../recoil/scholars';

interface FilterInputProps {
  setFilter: Dispatch<SetStateAction<ScholarFilter>>;
  formValues: ScholarFilter;
}

const FilterInputTotalSLP = ({ setFilter, formValues }: FilterInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (Number.isNaN(Number(inputValue))) return;

    setFilter(old => ({
      ...old,
      SLP: { ...old.SLP, [e.target.name]: inputValue },
    }));
  };

  return (
    <Box>
      <FormLabel>Total SLP</FormLabel>

      <HStack spacing={5} opacity={0.9}>
        <Text fontSize="lg">from</Text>
        <Code d="flex" minH={7} minW={14} justifyContent="center" alignItems="center">
          <Input
            h={7}
            w={14}
            name="above"
            value={formValues.SLP.above || ''}
            placeholder="ANY"
            variant="unstyled"
            textAlign="center"
            onChange={handleChange}
          />
        </Code>

        <Text fontSize="lg">to</Text>
        <Code d="flex" minH={7} minW={14} justifyContent="center" alignItems="center">
          <Input
            h={7}
            w={14}
            name="under"
            value={formValues.SLP.under || ''}
            placeholder="ANY"
            variant="unstyled"
            textAlign="center"
            onChange={handleChange}
          />
        </Code>
      </HStack>
    </Box>
  );
};

function FilterOnlyClaimable({ setFilter, formValues }: FilterInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;

    setFilter(old => ({
      ...old,
      onlyClaimable: checked,
    }));
  };

  return (
    <Flex>
      <Checkbox onChange={handleChange} defaultChecked={formValues.onlyClaimable} checked={formValues.onlyClaimable}>
        Show only claimable
      </Checkbox>
    </Flex>
  );
}

export const ScholarsFilterModal = (): JSX.Element => {
  const modal = useRecoilValue(modalSelector('scholarsFilterModal'));

  const [filter, setFilter] = useRecoilState(scholarFilter);
  const [formValues, setFormValues] = useState<ScholarFilter>(filter);

  const handleSave = () => {
    setFilter(formValues);
    modal.onClose();
  };

  return (
    <Stack p={5} spacing={6}>
      <FilterInputTotalSLP setFilter={setFormValues} formValues={formValues} />

      <FilterOnlyClaimable setFilter={setFormValues} formValues={formValues} />

      <Button leftIcon={<BiCheckCircle />} onClick={handleSave}>
        Save
      </Button>
    </Stack>
  );
};
