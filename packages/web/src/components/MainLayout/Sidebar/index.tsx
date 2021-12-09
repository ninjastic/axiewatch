import { Box } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { SidebarContent } from './SidebarContent';

const SidebarComponent = (): JSX.Element => (
  <Box
    w="235px"
    h="100%"
    pos="fixed"
    zIndex={9998}
    sx={{
      display: { base: 'none', '2xl': 'block' },
    }}
  >
    <SidebarContent />
  </Box>
);

export const Sidebar = dynamic(() => Promise.resolve(SidebarComponent), {
  ssr: false,
});
