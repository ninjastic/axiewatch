import { Flex, chakra, Text, Link, Stack, Button } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { useRecoilValue } from 'recoil';

import { useCreateModal } from '../../services/hooks/useCreateModal';
import { useGameStatus } from 'src/services/hooks/useGameStatus';
import { LoadingScreen } from './LoadingScreen';
import { ResetPasswordModal } from './ResetPasswordModal';
import { Sidebar } from './Sidebar';
import Header from './Navbar';
import { MaintenanceScreen } from '../MaintenanceScreen';
import { modalSelector } from 'src/recoil/modal';

const ShuttingDownModal = (): JSX.Element => {
  const { onClose } = useRecoilValue(modalSelector('shuttingDownModal'));

  return (
    <Stack spacing="5" py={3}>
      <Text fontWeight="bold" fontSize="2xl">
        Axie Watch will be shutting down on the 1st May.
      </Text>

      <Text>
        It was a great experience to develop this tool that was used by so many people (300k+ unique scholars), but my
        lack of interest on the Axie Infinity ecosystem leaves me with no time to keep working on the project which
        bills were being paid out of my own pocket for the last few months.
      </Text>

      <Text>
        The code is now open source for whoever wants to continue the work or get some inspiration for their own
        tracker/project.
      </Text>

      <Link href="https://github.com/ninjastic/axiewatch" fontWeight="bold">
        https://github.com/ninjastic/axiewatch
      </Link>

      <Text>Thanks everyone for the support so far.</Text>

      <Button onClick={onClose}>Ok</Button>
    </Stack>
  );
};

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const gameStatus = useGameStatus();

  const { onOpen, setExtra } = useCreateModal({
    id: 'resetPasswordModal',
    title: 'Reset Password',
    content: <ResetPasswordModal />,
  });

  const shuttingDownModal = useCreateModal({
    id: 'shuttingDownModal',
    title: 'End of the journey...',
    content: <ShuttingDownModal />,
    size: '2xl',
  });

  useEffect(() => {
    const loadingFallback = setTimeout(() => setIsLoading(false), 3000);

    if (process.browser) {
      window.onload = () => {
        setIsLoading(false);
        clearInterval(loadingFallback);
      };

      const hash = window.location.hash.split('&');
      const hasType = hash.find(entry => entry.startsWith('type='));
      const hasAccessToken = hash.find(entry => entry.startsWith('#access_token='));

      if (hasType && hasAccessToken) {
        const type = hasType.match(/type=(.*)/);
        const accessToken = hasAccessToken.match(/access_token=(.*)/);
        if (type && type[1] === 'recovery' && accessToken) {
          setExtra({ accessToken: accessToken[1] });
          onOpen();
        }
      }
    }
  }, [setExtra, onOpen]);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isLoading]);

  useEffect(() => {
    shuttingDownModal.onOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuttingDownModal.onOpen]);

  const pageTitles = {
    scholars: 'Scholars',
    axies: 'Axies',
    calendar: 'Calendar',
    wallet: 'Wallet',
    calculator: 'Calculator',
    payments: 'Payments',
  } as { [route: string]: string };

  const getSeoTitle = (): string => {
    const defaultTitle = 'Scholarship Tracker';
    const route = router.route.replace('/', '');

    if (!route) {
      return defaultTitle;
    }

    const title = pageTitles[route];
    return title || defaultTitle;
  };

  const shouldShowMaintenance = useMemo(() => {
    const maintenanceAffectedPages = ['', 'scholars', 'calendar', 'dashboard/[slug]'];
    const pageMatches = maintenanceAffectedPages.includes(router.route.replace('/', ''));

    return gameStatus.isMaintenance && pageMatches;
  }, [gameStatus.isMaintenance, router.route]);

  return (
    <>
      <NextSeo title={getSeoTitle()} />

      {isLoading && <LoadingScreen />}

      <Header currentTool="Tracker" />
      <Flex pt="65px" h="full" id="mainLayout">
        <Sidebar />

        {shouldShowMaintenance && <MaintenanceScreen />}

        {!shouldShowMaintenance && (
          <chakra.div w="full" h="full" pl={{ md: '0px', '2xl': '235px' }}>
            {children}
          </chakra.div>
        )}
      </Flex>
    </>
  );
};
