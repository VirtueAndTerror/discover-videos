import React, { useEffect, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';
import magic from '../lib/magic-client';
import Loading from '../components/loading/Loading';
import '../styles/globals.css';

function MyApp({ Component, pageProps }): JSX.Element {
  const router: NextRouter = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect((): void => {
    (async () => {
      const isLoggedIn = await magic.user.isLoggedIn();

      isLoggedIn ? router.push('/') : router.push('/login');
    })();
  }, [isLoading]);

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
