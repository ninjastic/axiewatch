import { Stack, HStack, useMediaQuery } from '@chakra-ui/react';

import { PriceTicker } from './PriceTicker';
import { ExportButton } from './ExportButton';
import { PreferencesButton } from './PreferencesButton';
import { NewScholarButton } from './NewScholarButton/NewScholarButton';
import { SlpOverview } from './SlpOverview/SlpOverview';

export function Header() {
  const [isWideVersion] = useMediaQuery('(min-width: 750px)');

  return (
    <Stack
      justify="space-between"
      align={isWideVersion ? 'flex-start' : 'center'}
      direction={isWideVersion ? 'row' : 'column'}
      spacing={isWideVersion ? 3 : 5}
    >
      <SlpOverview />

      <HStack spacing={3}>
        <PriceTicker />
        <ExportButton />
        <PreferencesButton />
        <NewScholarButton />
      </HStack>
    </Stack>
  );
}
