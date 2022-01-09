import { mode } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

export const TabsStyles = {
  parts: ['root', 'tab', 'tabpanels'],
  variants: {
    'soft-rounded': (props: Dict[]): any => ({
      tab: {
        borderRadius: 'full',
        fontWeight: 'semibold',
        color: 'gray.500',
        _selected: {
          color: mode('white', 'black')(props),
          bg: mode('gray.600', 'white')(props),
        },
      },
    }),
  },
};
