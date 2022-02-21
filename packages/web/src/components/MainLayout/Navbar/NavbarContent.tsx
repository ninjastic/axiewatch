import { Flex, Box, Link, Icon, useColorMode } from '@chakra-ui/react';
import { FiHome, FiCalendar } from 'react-icons/fi';
import { MdPets, MdPayment } from 'react-icons/md';
import { RiUser3Line, RiMoonLine, RiSunLine } from 'react-icons/ri';
import { BiCalculator, BiWalletAlt } from 'react-icons/bi';
import { FaDiscord } from 'react-icons/fa';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';

import { preferencesAtom } from '../../../recoil/preferences';
import { SidebarButton } from './SidebarButton';

type WindowWithVars = Window & {
  enableExperimental(): void;
};

declare let window: WindowWithVars;

export const NavbarContent = (): JSX.Element => {
  const [preferences, setPreferences] = useRecoilState(preferencesAtom);

  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    window.enableExperimental = () =>
      setPreferences(old => ({
        ...old,
        hasExperimentalFeatures: true,
      }));
  }, [setPreferences]);

  const isLocal = process.browser && window.location.hostname === 'localhost';

  return (
    <Flex pt={5} flex="1" flexDir="column">
      <SidebarButton name="Dashboard" path="/" leftIcon={<FiHome />} />

      <SidebarButton name="Scholars" path="/scholars" leftIcon={<RiUser3Line />} />

      <SidebarButton name="Axies" path="/axies" leftIcon={<MdPets />} />

      <SidebarButton name="Calendar" path="/calendar" leftIcon={<FiCalendar />} />

      <SidebarButton name="Wallet" path="/wallet" leftIcon={<BiWalletAlt />} />

      <SidebarButton name="Calculator" path="/calculator" leftIcon={<BiCalculator />} />

      {(preferences.hasExperimentalFeatures || isLocal) && (
        <SidebarButton name="Payments" path="/payments" leftIcon={<MdPayment />} />
      )}

      <Box p={8}>
        <Flex justify="space-between" align="center">
          <Link href="https://discord.com/invite/mAHcqzmt8h" target="_blank">
            <FaDiscord size={20} />
          </Link>

          <Icon
            aria-label="Toggle Color Mode"
            onClick={toggleColorMode}
            cursor="pointer"
            as={colorMode === 'dark' ? RiSunLine : RiMoonLine}
            _hover={{ opacity: 0.75 }}
            fontSize={20}
          />
        </Flex>
      </Box>
    </Flex>
  );
};
