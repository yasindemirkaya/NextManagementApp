import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/global.scss';
import React from 'react'; // React'ı import etmeyi unutmayın

export default function App({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  );
}