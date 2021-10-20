import { mode } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

export const LoadingScreenStyles = {
  baseStyle: (props: Dict[]): any => ({
    bg: mode('light.background', 'dark.background')(props),
    d: 'flex',
    w: '100%',
    h: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    zIndex: 9999,
  }),
};
