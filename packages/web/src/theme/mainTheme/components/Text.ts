import { mode } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

export const TextStyles = {
  variants: {
    faded: (props: Dict[]): any => ({
      color: mode('light.faded', 'dark.faded')(props),
    }),
  },
};
