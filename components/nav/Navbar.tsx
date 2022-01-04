import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import m from '../../lib/magic-client';

import styles from './Navbar.module.css';

const Navbar = (): JSX.Element => {
  const [toggleHidden, setToggleHidden] = useState(false);
  const [username, setUsername] = useState('');
  const [didToken, setDidToken] = useState('');
  const router = useRouter();

  useEffect((): void => {
    async function fetchData(): Promise<void> {
      try {
        const { email } = await m.user.getMetadata();
        // Just to use this in the backend
        const didToken = await m.user.getIdToken();
        if (email) {
          setUsername(email);
          setDidToken(didToken);
        }
      } catch (ex) {
        console.error('Error retrieving email - Navbar', ex);
      }
    }

    fetchData();
  }, []);

  const handleHome = (e: FormEvent): void => {
    e.preventDefault();
    router.push('/');
  };
  const handleMyList = (e: FormEvent): void => {
    e.preventDefault();
    router.push('/browse/my-list');
  };

  const handleSignOut = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await m.user.logout();
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${didToken}`,
          'Content-Type': 'application/json',
        },
      });
      router.replace('/login');
    } catch (ex) {
      console.error('Error signing out', ex);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link href='/'>
          <a className={styles.logoLink}>
            <div className={styles.logoWrapper}>
              <Image
                src='/static/netflix.svg'
                alt='netflix logo'
                width='128px'
                height='34px'
              />
            </div>
          </a>
        </Link>
        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleHome}>
            Home
          </li>
          <li className={styles.navItem} onClick={handleMyList}>
            My list
          </li>
        </ul>

        <nav className={styles.navContainer}>
          <div>
            <button
              className={styles.usernameBtn}
              onClick={() => setToggleHidden(!toggleHidden)}
            >
              <p className={styles.username}>{username}</p>
              <Image
                src='/static/expand_more_white_24dp.svg'
                alt='toggle dropdown'
                width='24'
                height='24'
              />
            </button>
            {toggleHidden && (
              <div className={styles.navDropdown}>
                <div>
                  <a className={styles.linkName} onClick={handleSignOut}>
                    Sign out
                  </a>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
