import React from 'react';
import m from '../lib/magic-client';
import '../styles/globals.css';

function MyApp({ Component, pageProps }): JSX.Element {
  return <Component {...pageProps} />;
}

export default MyApp;
