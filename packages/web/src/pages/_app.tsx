import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';
import { DefaultSeo } from 'next-seo';
import { ToastContainer, cssTransition } from 'react-toastify';
import { QueryClientProvider, QueryClient } from 'react-query';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental';
import Head from 'next/head';
import '@fontsource/inter';
import '@fontsource/bowlby-one-sc';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/global.css';

import { mainTheme } from '../theme';
import { MainLayout } from '../components/MainLayout';
import { ModalController } from '../components/ModalController';
import { TrackingScripts } from '../components/TrackingScripts';

const queryClient = new QueryClient();

if (process.browser) {
  const localStoragePersistor = createWebStoragePersistor({ storage: window.localStorage });

  persistQueryClient({
    queryClient,
    persistor: localStoragePersistor,
  });
}

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ChakraProvider theme={mainTheme}>
          <DefaultSeo
            title="Scholarship Tracker"
            titleTemplate="EBC Tracker | %s"
            description="The best free scholarship management tool in Lunacia. Track your axie infinity scholars and axies with ease."
            canonical="https://axie.watch"
            openGraph={{
              title: 'EBC Tracker',
              locale: 'en-US',
              images: [
                {
                  url: '/images/banner.png',
                },
              ],
            }}
            twitter={{
              handle: '@axiewatch',
              cardType: 'summary_large_image',
            }}
          />
          <Head>
            <link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-icon-57x57.png" />
            <link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-icon-60x60.png" />
            <link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-icon-72x72.png" />
            <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-icon-76x76.png" />
            <link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-icon-114x114.png" />
            <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-icon-120x120.png" />
            <link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-icon-144x144.png" />
            <link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-icon-152x152.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png" />
            <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-icon-192x192.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
            <link rel="manifest" href="/favicon/manifest.json" />
            <meta name="msapplication-TileColor" content="#000000" />
            <meta name="msapplication-TileImage" content="/favicon/ms-icon-144x144.png" />
            <meta name="theme-color" content="#000000" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
          </Head>
          <MainLayout>
            <Component {...pageProps} />
            <ModalController />
            <ToastContainer
              position="top-right"
              theme="dark"
              autoClose={4000}
              transition={cssTransition({
                enter: 'fade-in',
                exit: 'fade-out',
              })}
            />
            <TrackingScripts />
          </MainLayout>
        </ChakraProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default MyApp;
