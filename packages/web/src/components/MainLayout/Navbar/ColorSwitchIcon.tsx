import { IconButton, useColorMode } from '@chakra-ui/react';
import { RiMoonLine, RiSunLine } from 'react-icons/ri';

export const ColorSwitchIcon = (): JSX.Element => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Toggle Color Mode"
      onClick={toggleColorMode}
      icon={colorMode === 'dark' ? <RiSunLine /> : <RiMoonLine />}
      variant="ghost"
      fontSize={20}
      color="white"
      _hover={{
        bg: 'whiteAlpha.200',
      }}
    />
  );
};
