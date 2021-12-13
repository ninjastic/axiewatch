import { Stack, HStack } from '@chakra-ui/react';

import { PriceTicker } from './PriceTicker';
import { ExportButton } from './ExportButton';
import { PreferencesButton } from './PreferencesButton';
import { NewScholarButton } from './NewScholarButton';
import { SlpOverview } from './SlpOverview/SlpOverview';

export const Header = (): JSX.Element => {
  return (
    <Stack
      justify="space-between"
      align={{ base: 'center', lg: 'flex-start ' }}
      direction={{ base: 'column', lg: 'row' }}
      spacing={{ base: 5, lg: 3 }}
    >
      <SlpOverview />

      <Stack spacing={3} direction={{ base: 'column', lg: 'row' }}>
        <HStack spacing={3}>
          <PriceTicker />
          <ExportButton />
          <PreferencesButton />
        </HStack>

        <NewScholarButton />
      </Stack>
    </Stack>
  );
};
