import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Script from 'next/script';


import { AppProvider } from '@/core/';
import { useCunninghamTheme } from '@/cunningham';
import { useOffline, useSWRegister } from '@/features/service-worker/';
import '@/i18n/initI18n';
import { NextPageWithLayout } from '@/types/next';
import { useAnalytics } from '@/libs/Analytics';

import './globals.css';



type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  useSWRegister();
  useOffline();
  const getLayout = Component.getLayout ?? ((page) => page);
  const { t } = useTranslation();
  const { componentTokens } = useCunninghamTheme();
  const favicon = componentTokens['favicon'];
  const { asPath } = useRouter();
  const { AnalyticsProvider } = useAnalytics();



  return (
    <>
      <Head>
        <title>Aether — Эфирная Коллаборация Документов</title>
        <meta property="og:title" content="Aether — Эфирная Коллаборация Документов" key="title" />
        <meta
          name="description"
          content="Aether — революционная платформа для совместной работы с документами. Минималистичный дизайн, максимальная продуктивность. Создавайте, редактируйте и делитесь документами в реальном времени."
        />
        
        {/* Open Graph метаданные */}
        <meta 
          property="og:description" 
          content="Революционная платформа для совместной работы с документами. Минималистичный дизайн, максимальная продуктивность."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/assets/aether-logo.svg" />
        
        {/* Twitter метаданные */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Aether — Эфирная Коллаборация Документов" />
        <meta 
          name="twitter:description" 
          content="Революционная платформа для совместной работы с документами."
        />
        
        {/* Дополнительные метаданные */}
        <meta name="keywords" content="aether, документы, коллаборация, notion, markdown, open source, эфир" />
        <meta name="author" content="Aether Team" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#171717" />
        
        {/* Фавиконки */}
        <link rel="icon" href="/assets/aether-favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/assets/aether-favicon.svg" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Script id="register-sw" strategy="afterInteractive">
        {`
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
              }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
              });
            });
          }
        `}
      </Script>
      <AppProvider>
        <AnalyticsProvider>
          {getLayout(<Component {...pageProps} />)}
        </AnalyticsProvider>
      </AppProvider>
    </>
  );
}
