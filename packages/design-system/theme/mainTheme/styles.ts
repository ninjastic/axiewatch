import { mode } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

export const styles = {
  global: (props: Dict[]): any => ({
    body: {
      bg: mode('light.bgLevel1', 'dark.bgLevel4')(props),
    },
    ':focus:not(:focus-visible):not([role="dialog"]):not([role="menu"]):not([role="region"])': {
      boxShadow: 'none !important',
    },
  }),
};
