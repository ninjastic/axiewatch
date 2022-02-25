import { Box, Flex, HStack, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { WalletOverview } from '../components/WalletOverview';
import { PreferencesButton } from '../components/Header/PreferencesButton';
import { PriceTicker } from '../components/Header/PriceTicker';
import { WalletTransactions } from '../components/WalletTransactions';
import { WalletSales } from 'src/components/WalletSales';
import { WalletGrid } from 'src/components/WalletGrid';

export const WalletPage = (): JSX.Element => {
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

      <Tabs mt={10} isLazy>
        <TabList>
          <Tab>Wallets</Tab>
          <Tab>Transactions</Tab>
          <Tab>Sales</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box pb={5}>
              <WalletGrid />
            </Box>
          </TabPanel>

          <TabPanel>
            <Box pb={5}>
              <WalletTransactions />
            </Box>
          </TabPanel>

          <TabPanel>
            <Box pb={5}>
              <WalletSales />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default dynamic(() => Promise.resolve(WalletPage), { ssr: false });
