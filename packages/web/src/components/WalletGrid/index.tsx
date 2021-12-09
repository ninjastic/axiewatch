import { Grid } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import lodash from 'lodash';

import { scholarsMap } from '../../recoil/scholars';
import { WalletCard } from './WalletCard';
import { preferencesAtom } from '../../recoil/preferences';

export const WalletGrid = (): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const preferences = useRecoilValue(preferencesAtom);

  const addresses = scholars.map(scholar => scholar.address);
  const managerAddress = preferences.managerAddress.replace('ronin:', '0x');
  const addressesWithManager = preferences.managerAddress
    ? lodash.uniqWith([managerAddress, ...addresses], (a, b) => a.toLowerCase() === b.toLowerCase())
    : addresses;

  return (
    <Grid
      pt={{ base: 3, xl: 10 }}
      pb={10}
      templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }}
      gap={3}
    >
      {addressesWithManager.map(address => (
        <WalletCard key={address} address={address} />
      ))}
    </Grid>
  );
};
