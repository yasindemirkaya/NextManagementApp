import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.scss'

import { Provider } from "react-redux";
import { persistor } from "@/redux/config"
import { PersistGate } from 'redux-persist/integration/react'
import Head from 'next/head'

import store from "@/redux/store";
import React from 'react';
import DefaultLayout from '@/components/Layouts/Default/index';



export default function App({ Component, pageProps: { session, ...pageProps } }) {
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