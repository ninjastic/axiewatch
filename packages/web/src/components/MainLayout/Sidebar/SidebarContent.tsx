import { Flex } from '@chakra-ui/react';
import { FiHome, FiCalendar } from 'react-icons/fi';
import { MdPets, MdPayment } from 'react-icons/md';
import { RiUser3Line } from 'react-icons/ri';
import { BiCalculator, BiWalletAlt } from 'react-icons/bi';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';

import { preferencesAtom } from '../../../recoil/preferences';
import { SidebarButton } from './SidebarButton';

type WindowWithVars = Window & {
  enableExperimental(): void;
};

declare let window: WindowWithVars;

export const SidebarContent = (): JSX.Element => {
  const [preferences, setPreferences] = useRecoilState(preferencesAtom);

  useEffect(() => {
    window.enableExperimental = () =>
      setPreferences(old => ({
        ...old,
        hasExperimentalFeatures: true,
      }));
  }, [setPreferences]);

  const isLocal = process.browser && window.location.hostname === 'localhost';

  return (
    <Flex pt={5} flex="1" flexDir="column" h="100%">
      <SidebarButton name="Dashboard" path="/" leftIcon={<FiHome />} />

      <SidebarButton name="Scholars" path="/scholars" leftIcon={<RiUser3Line />} />

      <SidebarButton name="Axies" path="/axies" leftIcon={<MdPets />} />

      <SidebarButton name="Calendar" path="/calendar" leftIcon={<FiCalendar />} />

      <SidebarButton name="Wallet" path="/wallet" leftIcon={<BiWalletAlt />} />

      <SidebarButton name="Calculator" path="/calculator" leftIcon={<BiCalculator />} />

      {(preferences.hasExperimentalFeatures || isLocal) && (
        <SidebarButton name="Payments" path="/payments" leftIcon={<MdPayment />} />
      )}
    </Flex>
  );
};
