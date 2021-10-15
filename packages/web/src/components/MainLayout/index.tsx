import { Flex, chakra } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import { useCreateModal } from '../../services/hooks/useCreateModal';
import { LoadingScreen } from './LoadingScreen';
import { Sidebar } from './Sidebar';
import Header from './Navbar';
import { ResetPasswordModal } from './ResetPasswordModal';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const { onOpen, setExtra } = useCreateModal({
    id: 'resetPasswordModal',
    title: () => 'Reset Password',
    content: () => <ResetPasswordModal />,
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

  return (
    <>
      <NextSeo title={getSeoTitle()} />

      {isLoading && <LoadingScreen />}

      <Header currentTool="Tracker" />
      <Flex pt="65px" h="full">
        <Sidebar />

        <chakra.div w="full" h="full">
          {children}
        </chakra.div>
      </Flex>
    </>
  );
};
