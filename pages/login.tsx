import React, { useState, useEffect, MouseEvent, ChangeEvent } from 'react';
import { NextRouter, useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

import magic from '../lib/magic-client';

import styles from '../styles/Login.module.css';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [userMsg, setUserMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router: NextRouter = useRouter();

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
    setUserMsg('');
    const { value } = e.target;
    setEmail(value);
  };

  const handleLogin = async (e: MouseEvent): Promise<boolean | void> => {
    e.preventDefault();
    if (!email) return setUserMsg('Enter a valid email address');

    try {
      setIsLoading(true);

      const didToken = await magic.auth.loginWithMagicLink({
        email,
      });

      if (didToken) {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${didToken}`,
            'Content-Type': 'application/json',
          },
        });
        const loggedInResponse = await response.json();
        if (loggedInResponse.done) {
          return router.push('/');
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
          <a className={styles.logoLink} href='/'>
            <div className={styles.logoWrapper}>
              <Image
                src='/static/netflix.svg'
                alt='Netflix logo'
                width='128px'
                height='34px'
              />
            </div>
          </a>
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
