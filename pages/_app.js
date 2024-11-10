import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.scss';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';

import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "@/redux/store"; // store ve persistor'ı import ediyoruz

import { useRouter } from 'next/router';
import { useAuthRedirect } from '@/utils/authGuard';

import DefaultLayout from '@/components/Layouts/Default/index';
import NotFoundLayout from '@/components/Layouts/404';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // handleAuthRedirect'i burada kullanıyoruz
  const handleAuthRedirect = useAuthRedirect();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setToken(null);
    }

    setLoading(false);

    // auth kontrol fonksiyonunu çağırıyoruz
    if (storedToken !== null) {
      handleAuthRedirect(storedToken, router.pathname);  // Yönlendirme işlemi burada yapılacak
    } else if (storedToken === null && router.pathname !== '/login' && router.pathname !== '/register') {
      // Eğer token yoksa ve login ya da register sayfası değilse yönlendirme yapılacak
      router.push('/login');
    }
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const Layout = router.pathname === '/404' ? NotFoundLayout : DefaultLayout;

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PersistGate>
    </Provider>
  );
}