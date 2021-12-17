import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import magic from '../lib/magic-client';
import Loading from '../components/loading/Loading';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
    return () => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.on('routeChangeError', handleComplete);
    };
  }, [router]);

  useEffect(() => {
    async function isLoggedIn() {
      const res = await magic.user.isLoggedIn();
      return res;
    }
    isLoggedIn();

    if (isLoggedIn === true) return router.push('/');

    router.push('/login');
  }, []);
  return isLoading ? <Loading /> : <Component {...pageProps} />;
}

export default MyApp;
