import { Tabs, Tab, TabList, TabPanels, TabPanel, Box } from '@chakra-ui/react';

import { ManualForm } from './ManualForm';
import { ListForm } from './ListForm';
import { OtherImportForm } from './OtherImportForm';

export const NewScholarModal = (): JSX.Element => {
  return (
    <Box>
      <Tabs variant="soft-rounded">
        <TabList mb={3}>
          <Tab>Manual</Tab>
          <Tab>Bulk Import</Tab>
          <Tab>Others</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ManualForm />
          </TabPanel>

          <TabPanel>
            <ListForm />
          </TabPanel>

          <TabPanel>
            <OtherImportForm />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
