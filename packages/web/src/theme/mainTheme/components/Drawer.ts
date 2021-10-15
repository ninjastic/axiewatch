import { mode } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

export const DrawerStyles = {
  parts: ['dialog'],
  baseStyle: (props: Dict[]): any => ({
    dialog: {
      bg: mode('light.background', 'dark.background')(props),
    },
  }),
};
