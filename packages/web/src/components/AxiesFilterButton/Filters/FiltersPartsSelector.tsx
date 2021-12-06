import { FormControl, FormLabel, HStack, Text } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { useRecoilValue } from 'recoil';
import { Select } from 'chakra-react-select';

import bodyParts from '../../../constants/body-parts.json';
import { AxieClass, axiePartsAtom, ScholarAxiesFilter } from '../../../recoil/scholars';
import { AxiePartIcon, AxiePartIconType } from '@src/components/Icons/AxiePartIcon';

interface FilterProps {
  setFilter: Dispatch<SetStateAction<ScholarAxiesFilter>>;
  formValues: ScholarAxiesFilter;
}

export const FiltersPartsSelector = ({ setFilter, formValues }: FilterProps): JSX.Element => {
  const parts = useRecoilValue(axiePartsAtom);

  const defaultValue = formValues.parts.map(part => {
    const bodyPart = bodyParts.find(bp => bp.partId === part);

    return {
      label: (
        <HStack>
          <AxiePartIcon
            type={bodyPart.type as AxiePartIconType}
            bg={bodyPart.class as AxieClass}
            borderRadius="sm"
            fontSize="lg"
          />
          <Text>{part.replace(/\w+-/i, '').replace(/-/g, ' ')}</Text>
        </HStack>
      ),
      value: part,
    };
  });

  const options = parts.map(part => {
    const bodyPart = bodyParts.find(bp => bp.partId === part);

    return {
      label: (
        <HStack>
          <AxiePartIcon
            type={bodyPart.type as AxiePartIconType}
            bg={bodyPart.class as AxieClass}
            borderRadius="sm"
            fontSize="lg"
          />
          <Text>{part.replace(/\w+-/i, '').replace(/-/g, ' ')}</Text>
        </HStack>
      ),
      value: part,
    };
  });

  function handleChange(selected: string[]) {
    setFilter(old => ({
      ...old,
      parts: selected,
    }));
  }

  return (
    <FormControl>
      <FormLabel>Parts</FormLabel>

      <Select
        onChange={(selectedValues: any[]) => handleChange(selectedValues.map(selected => selected.value))}
        options={options}
        name="parts"
        closeMenuOnSelect
        defaultValue={defaultValue}
        isMulti
      />
    </FormControl>
  );
};
