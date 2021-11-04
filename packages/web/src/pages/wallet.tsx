import { Box, Flex, HStack, Grid, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import dynamic from 'next/dynamic';
import lodash from 'lodash';

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
  const addressesWithManager = preferences.managerAddress
    ? lodash.uniqWith([managerAddress, ...addresses], (a, b) => a.toLowerCase() === b.toLowerCase())
    : addresses;

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

      <Tabs mt={5} isLazy>
        <TabList>
          <Tab>Wallets</Tab>
          <Tab>Transactions</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
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
          </TabPanel>

          <TabPanel>
            <Box pb={5}>
              <WalletTransactions />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default dynamic(() => Promise.resolve(WalletPage), { ssr: false });
