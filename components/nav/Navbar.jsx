import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import magic from '../../lib/magic-client';

import styles from './Navbar.module.css';

const Navbar = () => {
  const [toggleHidden, setToggleHidden] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    try {
      async function fetchData() {
        const { email } = await magic.user.getMetadata();

        const didToken = await magic.user.getIdToken();
        console.log({ didToken });

        if (email) return setUsername(email);
      }

      fetchData();
    } catch (ex) {
      console.error(ex);
    }
  }, []);

  const handleHome = e => {
    e.preventDefault();
    router.push('/');
  };
  const handleMyList = e => {
    e.preventDefault();
    router.push('/browse/my-list');
  };

  const handleSignOut = async e => {
    e.preventDefault();
    try {
      await magic.user.logout();
      console.log('Successfuly logged out!');
      router.push('/login');
    } catch (ex) {
      console.error('Error signing out', ex);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
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
            {toggleHidden ? (
              <div className={styles.navDropdown}>
                <div>
                  <a className={styles.linkName} onClick={handleSignOut}>
                    Sign out
                  </a>

                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            ) : null}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
