import { Box, Flex, HStack, Grid } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import dynamic from 'next/dynamic';

import { scholarsMap } from '../recoil/scholars';
import { WalletOverview } from '../components/WalletOverview';
import { PreferencesButton } from '../components/Header/PreferencesButton';
import { PriceTicker } from '../components/Header/PriceTicker';
import { WalletCard } from '../components/WalletCard';
import { WalletTransactions } from '../components/WalletTransactions';
import { preferencesAtom } from '../recoil/preferences';

export const WalletPage = (): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const preferences = useRecoilValue(preferencesAtom);

  const managerAddress = preferences.managerAddress.replace('ronin:', '0x');

  const addresses = scholars.map(scholar => scholar.address);
  const addressesWithManager = preferences.managerAddress ? [managerAddress, ...addresses] : addresses;

  return (
    <Box h="full" maxW="1450px" margin="auto" p={3}>
      <Flex flexDir={{ base: 'column-reverse', xl: 'row' }}>
        <WalletOverview />

        <Box ml="auto" mb={{ base: 5, xl: 0 }}>
          <HStack>
            <PriceTicker coins={['slp', 'axs']} />
            <PreferencesButton />
          </HStack>
        </Box>
      </Flex>

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

      <Box pb={5}>
        <WalletTransactions />
      </Box>
    </Box>
  );
};

export default dynamic(() => Promise.resolve(WalletPage), { ssr: false });
