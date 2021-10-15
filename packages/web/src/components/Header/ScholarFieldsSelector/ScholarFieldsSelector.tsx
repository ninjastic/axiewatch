import { Select } from 'chakra-react-select';

import { ScholarFields } from '../../../recoil/scholars';

interface FieldValue {
  label: string;
  value: string;
}

interface ScholarFieldsSelectorProps {
  values: ScholarFields[];
  onChange(values: FieldValue[]): void;
}

export const ScholarFieldsSelector = ({ values, onChange }: ScholarFieldsSelectorProps): JSX.Element => {
  const options = [
    {
      label: 'Name',
      value: 'name',
      isFixed: true,
    },
    {
      label: 'SLP',
      value: 'slp',
    },
    {
      label: 'Scholar Share',
      value: 'scholarShare',
    },
    {
      label: 'Manager Share',
      value: 'managerShare',
    },
    {
      label: 'Investor Share',
      value: 'investorShare',
    },
    {
      label: 'Arena Elo',
      value: 'arenaElo',
    },
    {
      label: 'SLP Yesterday',
      value: 'yesterdaySlp',
    },
    {
      label: 'SLP Today',
      value: 'todaySlp',
    },
    {
      label: 'SLP per Day',
      value: 'slpDay',
    },
    {
      label: 'SLP Adventure',
      value: 'adventureSlp',
    },
    {
      label: 'Next Claim',
      value: 'nextClaim',
    },
    {
      label: 'Last Claim',
      value: 'lastClaim',
    },
  ];

  const defaultValue = values.map(field => {
    const currentField = options.find(option => option.value === field);
    return currentField;
  });

  return (
    <Select
      isMulti
      options={options}
      isClearable={false}
      closeMenuOnSelect={false}
      defaultValue={defaultValue}
      onChange={selectedValues => onChange(selectedValues.map(selected => selected.value as FieldValue))}
    />
  );
};
