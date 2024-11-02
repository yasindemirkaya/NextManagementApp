import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/global.scss';

import { Provider } from "react-redux";
import store from "@/redux/store";

import React from 'react';

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}