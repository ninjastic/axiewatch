import { FormControl, FormLabel } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { useRecoilValue } from 'recoil';
import { Select } from 'chakra-react-select';

import { ScholarAxiesFilter, scholarsMap } from '../../../recoil/scholars';
import { preferencesAtom } from 'src/recoil/preferences';

interface FilterProps {
  setFilter: Dispatch<SetStateAction<ScholarAxiesFilter>>;
  formValues: ScholarAxiesFilter;
}

export const FilterOwnerSelect = ({ setFilter, formValues }: FilterProps): JSX.Element => {
  const preferences = useRecoilValue(preferencesAtom);
  const scholars = useRecoilValue(scholarsMap);

  const managerWithoutRonin = preferences?.managerAddress.replace('ronin:', '0x');

  const defaultLabel =
    scholars.find(scholar => scholar.address === formValues.owner)?.name ??
    (formValues.owner === managerWithoutRonin ? 'Manager' : null);

  const options = [
    {
      label: 'All',
      value: '',
    },
    ...(preferences.managerAddress
      ? [
          {
            label: 'Manager',
            value: managerWithoutRonin,
          },
        ]
      : []),
    ...scholars.map(scholar => ({
      label: scholar.name,
      value: scholar.address,
    })),
  ];

  function handleChange(selected: string) {
    setFilter(old => ({
      ...old,
      owner: selected,
    }));
  }

  return (
    <FormControl>
      <FormLabel>Scholar</FormLabel>

      <Select
        onChange={(selected: any) => handleChange(selected?.value ?? '')}
        options={options}
        name="owner"
        closeMenuOnSelect
        defaultValue={{
          label: formValues.owner !== '' ? defaultLabel ?? 'All' : 'All',
          value: formValues.owner !== '' ? formValues.owner ?? 'All' : 'All',
        }}
      />
    </FormControl>
  );
};
