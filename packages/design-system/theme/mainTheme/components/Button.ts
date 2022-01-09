import { mode } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

export const ButtonStyles = {
  variants: {
    solid: (props: Dict[]): any => ({
      bg: mode('gray.600', 'whiteAlpha.200')(props),
      boxShadow: 'md',
      color: mode('white', 'white')(props),
      _hover: {
        bg: mode('gray.500', 'whiteAlpha.300')(props),
      },
      _active: {
        bg: mode('gray.500', 'whiteAlpha.400')(props),
      },
    }),
  },
};
