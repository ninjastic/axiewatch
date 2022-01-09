import { mode } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

export const TooltipStyles = {
  baseStyle: (props: Dict[]): any => ({
    color: mode('black', 'white')(props),
    bg: mode('light.card', 'dark.card')(props),
    rounded: 'md',
    boxShadow: 'md',
    borderWidth: 1,
    p: 2,
  }),
};
