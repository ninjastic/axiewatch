import { FormControl, FormLabel } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { Select } from 'chakra-react-select';

import { AxieClass, ScholarAxiesFilter } from '../../../recoil/scholars';

interface FilterProps {
  setFilter: Dispatch<SetStateAction<ScholarAxiesFilter>>;
  formValues: ScholarAxiesFilter;
}

export const FilterClassSelect = ({ setFilter, formValues }: FilterProps): JSX.Element => {
  const classes = [
    { label: 'All', value: '' },
    { label: 'Aquatic', value: 'Aquatic' },
    { label: 'Reptile', value: 'Reptile' },
    { label: 'Plant', value: 'Plant' },
    { label: 'Bird', value: 'Bird' },
    { label: 'Beast', value: 'Beast' },
    { label: 'Bug', value: 'Bug' },
    { label: 'Dusk', value: 'Dusk' },
    { label: 'Mech', value: 'Mech' },
    { label: 'Dawn', value: 'Dawn' },
  ];

  function handleChange(selected: string) {
    setFilter(old => ({
      ...old,
      class: selected as AxieClass,
    }));
  }

  return (
    <FormControl>
      <FormLabel>Class</FormLabel>

      <Select
        onChange={(selected: any) => handleChange(selected?.value ?? '')}
        options={classes}
        name="class"
        closeMenuOnSelect
        defaultValue={{
          label: formValues.class !== '' ? formValues.class ?? 'All' : 'All',
          value: formValues.class !== '' ? formValues.class ?? 'All' : 'All',
        }}
      />
    </FormControl>
  );
};
