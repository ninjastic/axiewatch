import { useRecoilValue } from 'recoil';
import { Select } from 'chakra-react-select';

import { preferencesAtom } from '../../../../recoil/preferences';

interface CurrencySelectProps {
  setFieldValue: (name: string, value: string) => void;
}

export const CurrencySelect = ({ setFieldValue }: CurrencySelectProps): JSX.Element => {
  const preferences = useRecoilValue(preferencesAtom);

  const currencies = [
    'usd',
    'eur',
    'php',
    'brl',
    'eth',
    'thb',
    'sgd',
    'aud',
    'cad',
    'idr',
    'chf',
    'gbp',
    'mxn',
    'inr',
    'ars',
    'vnd',
    'uah',
    'rub',
    'aed',
    'myr',
    'jpy',
    'ils',
  ];

  const options = currencies.map(currency => ({
    label: currency.toUpperCase(),
    value: currency,
  }));

  return (
    <Select
      options={options}
      onChange={(selected: any) => setFieldValue('currency', selected?.value ?? 'usd')}
      name="currency"
      closeMenuOnSelect
      defaultValue={{
        label: preferences.currency.toUpperCase() as any,
        value: preferences.currency as any,
      }}
    />
  );
};
