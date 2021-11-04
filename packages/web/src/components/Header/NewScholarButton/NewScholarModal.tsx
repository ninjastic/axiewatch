import { Tabs, Tab, TabList, TabPanels, TabPanel, Box } from '@chakra-ui/react';

import { ManualForm } from './ManualForm';
import { ListForm } from './ListForm';

export const NewScholarModal = (): JSX.Element => {
  return (
    <Box>
      <Tabs variant="soft-rounded">
        <TabList mb={3}>
          <Tab>Manual</Tab>
          <Tab>Bulk Import</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ManualForm />
          </TabPanel>

          <TabPanel>
            <ListForm />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
