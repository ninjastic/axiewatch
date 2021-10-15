import { FormControl, FormLabel } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { useRecoilValue } from 'recoil';
import { Select } from 'chakra-react-select';

import { axiePartsAtom, ScholarAxiesFilter } from '../../../recoil/scholars';

interface FilterProps {
  setFilter: Dispatch<SetStateAction<ScholarAxiesFilter>>;
  formValues: ScholarAxiesFilter;
}

export const FiltersPartsSelector = ({ setFilter, formValues }: FilterProps): JSX.Element => {
  const parts = useRecoilValue(axiePartsAtom);

  const defaultValue = formValues.parts.map(part => ({
    label: part.replace(/\w+-/i, '').replace(/-/g, ' '),
    value: part,
  }));

  const options = parts.map(part => ({
    label: part.replace(/\w+-/i, '').replace(/-/g, ' '),
    value: part,
  }));

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
        onChange={selectedValues => handleChange(selectedValues.map(selected => selected.value))}
        options={options}
        name="parts"
        closeMenuOnSelect
        defaultValue={defaultValue}
        isMulti
      />
    </FormControl>
  );
};
