import { mode } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

export const SelectStyles = {
  parts: ['field', 'icon'],
  baseStyle: (props: Dict[]): any => ({
    field: {
      '> option, > optgroup': {
        bg: mode('light.background', 'dark.background')(props),
      },
    },
  }),
};
