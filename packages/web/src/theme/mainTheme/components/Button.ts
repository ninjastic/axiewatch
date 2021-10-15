import { mode } from '@chakra-ui/theme-tools';

export const ButtonStyles = {
  variants: {
    solid: (props: any) => ({
      bg: mode('darkGray.600', 'whiteAlpha.200')(props),
      color: mode('white', 'white')(props),
      _hover: {
        bg: mode('darkGray.700', 'whiteAlpha.300')(props),
        _disabled: {
          bg: mode('darkGray.800', 'whiteAlpha.200')(props),
        },
      },
      _active: {
        bg: mode('darkGray.800', 'whiteAlpha.400')(props),
      },
    }),
    ghost: {
      bg: 'transparent',
    },
  },
};
