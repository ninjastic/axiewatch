import { mode } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

export const CardStyles = {
  baseStyle: (props: Dict[]): any => ({
    bg: mode('light.card', 'dark.bgLevel2')(props),
    boxShadow: mode('0 7px 20px -10px rgba(150,170,180,0.3)', 'md')(props),
    borderRadius: 'lg',
    borderWidth: mode('1px', '0px')(props),
    borderColor: mode('gray.200', 'darkGray.600')(props),
  }),
};
