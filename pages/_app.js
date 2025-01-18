import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.scss';

import React, { useEffect } from 'react';
import Head from 'next/head';

import { Provider } from "react-redux";
import store, { persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";

import { useRouter } from 'next/router';

import DefaultLayout from '@/components/Layouts/Default/index';
import NotFoundLayout from '@/components/Layouts/404';

import { NextIntlClientProvider } from 'next-intl';

import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const Layout = router.pathname === '/404' ? NotFoundLayout : DefaultLayout;

  return (
    <div className={montserrat.className}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Next Management App</title>
          </Head>

          <NextIntlClientProvider locale={router.locale} messages={pageProps.messages}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </NextIntlClientProvider>

        </PersistGate>
      </Provider>
    </div>
  );
}
