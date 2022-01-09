import { mode } from '@chakra-ui/theme-tools';

export const MenuStyles = {
  parts: ['item', 'list'],
  baseStyle: (props: any) => ({
    item: {
      bg: mode('light.card', 'dark.bgLevel4')(props),
    },
    list: {
      bg: mode('light.card', 'dark.bgLevel4')(props),
      border: 0,
    },
  }),
};
