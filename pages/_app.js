import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.scss';

import React, { useEffect } from 'react';
import Head from 'next/head';

import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "@/redux/store";

import { useRouter } from 'next/router';

import DefaultLayout from '@/components/Layouts/Default/index';
import NotFoundLayout from '@/components/Layouts/404';

import { isTokenExpired } from '@/helpers/tokenVerifier';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const Layout = router.pathname === '/404' ? NotFoundLayout : DefaultLayout;

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    checkToken();
  }, [router]);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Next Management App</title>
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PersistGate>
    </Provider>
  );
}
