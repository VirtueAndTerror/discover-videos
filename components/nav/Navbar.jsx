import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

import styles from './Navbar.module.css';

const Navbar = ({ username }) => {
  const [toggleHidden, setToggleHidden] = useState(false);
  const router = useRouter();

  const handleHome = e => {
    e.preventDefault();
    router.push('/');
  };
  const handleMyList = e => {
    e.preventDefault();
    router.push('browse/my-list');
  };

  const handleSignOut = () => {};
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
                  <Link href='/login'>
                    <a className={styles.linkName} onClick={handleSignOut}>
                      Sign out
                    </a>
                  </Link>
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
