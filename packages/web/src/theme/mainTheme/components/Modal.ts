import { mode } from '@chakra-ui/theme-tools';

export const ModalStyles = {
  parts: ['dialog'],
  baseStyle: (props: any) => ({
    dialog: {
      bg: mode('light.background', 'dark.background')(props),
    },
  }),
};
