import { mode } from '@chakra-ui/theme-tools';

export const SliderStyles = {
  parts: ['filledTrack'],
  baseStyle: (props: any) => ({
    filledTrack: {
      bg: mode('darkGray.800', 'white')(props),
    },
  }),
};
