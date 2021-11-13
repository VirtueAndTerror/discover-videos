import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

import styles from '../styles/Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [userMsg, setUserMsg] = useState('');

  const router = useRouter();

  const handleOnChange = e => {
    setUserMsg('');
    const { value } = e.target;
    setEmail(value);
  };

  const handleLogin = e => {
    e.preventDefault();

    if (email !== 'arnaldo.e.diaz@gmail.com')
      return setUserMsg('Enter a valid email address');

    router.push('/');
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
            {/* {isLoading ? 'Loading...' : 'Sign In'} */} Sign In
          </button>
        </div>
      </main>
    </div>
  );
}
