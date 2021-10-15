import { mode } from '@chakra-ui/theme-tools';

export const CardStyles = {
  baseStyle: (props: any) => ({
    bg: mode('light.card', 'dark.card')(props),
    boxShadow: 'sm',
    borderRadius: 'md',
  }),
};
