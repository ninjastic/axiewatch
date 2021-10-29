import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Box, HStack, Text, Code, Input, FormLabel } from '@chakra-ui/react';

import { ScholarAxiesFilter } from '../../../recoil/scholars';

interface FilterProps {
  setFilter: Dispatch<SetStateAction<ScholarAxiesFilter>>;
  formValues: ScholarAxiesFilter;
}

export const FilterBreedInput = ({ setFilter, formValues }: FilterProps): JSX.Element => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>): JSX.Element => {
    const inputValue = e.target.value;

    if (Number.isNaN(Number(inputValue)) && inputValue !== '') return;
    if (Number(inputValue) < 0 || Number(inputValue) > 7) return;

    setFilter(old => ({
      ...old,
      breed: { ...old.breed, [e.target.name]: inputValue },
    }));
  };

  return (
    <Box>
      <FormLabel>Breed count</FormLabel>

      <HStack spacing={5}>
        <Text fontSize="lg" opacity={0.9}>
          from
        </Text>

        <Code d="flex" minH={7} minW={14} justifyContent="center" alignItems="center">
          <Input
            h={7}
            w={14}
            name="above"
            value={formValues.breed.above ?? ''}
            placeholder="0"
            variant="unstyled"
            textAlign="center"
            onChange={handleChange}
          />
        </Code>

        <Text fontSize="lg" opacity={0.9}>
          to
        </Text>
        <Code d="flex" minH={7} minW={14} justifyContent="center" alignItems="center">
          <Input
            h={7}
            w={14}
            name="under"
            value={formValues.breed.under ?? ''}
            placeholder="7"
            variant="unstyled"
            textAlign="center"
            onChange={handleChange}
          />
        </Code>
      </HStack>
    </Box>
  );
};
