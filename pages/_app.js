import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.scss';

import React, { useEffect } from 'react';
import Head from 'next/head';

import { Provider, useDispatch } from 'react-redux';
import store from '../redux/store';

import { useRouter } from 'next/router';

import DefaultLayout from '@/components/Layouts/Default/index';
import NotFoundLayout from '@/components/Layouts/404';

import { checkAuth, isTokenExpiredClient } from '@/helpers/tokenVerifier';
import protectedPages from '@/static/data/protectedPages';
import { clearUser } from '../redux/userSlice';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const Layout = router.pathname === '/404' ? NotFoundLayout : DefaultLayout;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const isProtected = protectedPages.some((path) =>
      router.pathname.startsWith(path)
    );

    if (isProtected) {
      checkAuth(token, router);
    } else {
      if (token && isTokenExpiredClient(token)) {
        localStorage.removeItem('token');
        dispatch(clearUser());
        router.push('/');
      }
    }
  }, [router.pathname, token]);

  return (
    <Provider store={store}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Next Management App</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
