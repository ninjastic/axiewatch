import { Box } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { SidebarContent } from './SidebarContent';

const SidebarComponent = (): JSX.Element => (
  <Box
    w="235px"
    h="100%"
    top="65px"
    sx={{
      display: { base: 'none', '2xl': 'block' },
    }}
    pos="sticky"
  >
    <SidebarContent />
  </Box>
);

export const Sidebar = dynamic(() => Promise.resolve(SidebarComponent), {
  ssr: false,
});
