import React, { useState, useEffect, MouseEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

import m from '../lib/magic-client';

import useFetch from '../utils/useFetch';

import styles from '../styles/Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [userMsg, setUserMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  //
  const router = useRouter();

  useEffect((): VoidFunction => {
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
    return (): void => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    setUserMsg('');
    setEmail(value);
  };

  const handleLogin = async (e: MouseEvent): Promise<boolean | void> => {
    e.preventDefault();
    if (!email) return setUserMsg('Enter a valid email address');

    try {
      setIsLoading(true);
      // Get didToken from Magic Link
      const didToken = await m.auth.loginWithMagicLink({ email });

      if (didToken) {
        // Call login api
        const { authenticated } = await useFetch('/api/login', didToken);

        // Redirect client
        if (authenticated) {
          router.push('/', '/browse');
        } else {
          setIsLoading(false);
          setUserMsg('Something went wrong loggin in');
        }
      }
    } catch (ex) {
      console.error('Something went wrong with MagicLink', ex);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix SignIn</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link href='/' as='/browse'>
            <a className={styles.logoLink}>
              <div className={styles.logoWrapper}>
                <Image
                  src='/static/netflix.svg'
                  alt='Netflix logo'
                  width='128px'
                  height='34px'
                />
              </div>
            </a>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>

          <input
            type='email'
            name='email'
            placeholder='Email address'
            className={styles.emailInput}
            onChange={handleOnChange}
          />

          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleLogin} className={styles.loginBtn}>
            {isLoading ? 'Loading...' : 'Sign In'}
          </button>
        </div>
      </main>
    </div>
  );
}
