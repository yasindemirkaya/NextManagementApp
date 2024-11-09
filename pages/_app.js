import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.scss';

import { Provider } from "react-redux";
import { persistor } from "@/redux/config";
import { PersistGate } from 'redux-persist/integration/react';
import Head from 'next/head';

import store from "@/redux/store";
import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/components/Layouts/Default/index';
import { useRouter } from 'next/router';
import { handleAuthRedirect } from '@/utils/authGuard';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setToken(null);
    }

    setLoading(false);

    // auth kontrol fonksiyonunu çağırıyoruz
    handleAuthRedirect(storedToken, router.pathname);
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </PersistGate>
    </Provider>
  );
}