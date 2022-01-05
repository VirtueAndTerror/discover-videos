import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import m from '../lib/magic-client';

import Loading from '../components/loading/Loading';

import '../styles/globals.css';

function MyApp({ Component, pageProps }): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect((): void => {
    async function getIsLoggedIn() {
      const isLoggedIn = await m.user.isLoggedIn();
      console.log({ isLoggedIn });

      isLoggedIn ? router.push('/', '/browse') : router.push('/login', '/');
    }
    getIsLoggedIn();
  }, []);

  useEffect((): VoidFunction => {
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
    return (): void => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);
  return isLoading ? <Loading /> : <Component {...pageProps} />;
}

export default MyApp;
