import { extendTheme, ThemeConfig } from '@chakra-ui/react';

import { styles } from './styles';
import { colors } from './colors';
import { components } from './components';
import { fonts } from './fonts';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const mainTheme = extendTheme({
  config,
  styles,
  colors,
  components,
  fonts,
});
