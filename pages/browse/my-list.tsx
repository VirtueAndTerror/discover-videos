import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import SectionCards from '../../components/card/SectionCards';
import Navbar from '../../components/nav/Navbar';

import { getMyList } from '../../lib/videos';
import getCurrentUser from '../../utils/getCurrentUser';

import styles from '../../styles/MyList.module.css';

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { userId, token } = await getCurrentUser(ctx);
  const myListVideos = await getMyList(userId, token);
  return {
    props: {
      myListVideos,
    },
  };
};

const MyList = ({ myListVideos }) => {
  return (
    <div>
      <Head>
        <title>My List</title>
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title='My List'
            videos={myListVideos || []}
            size='small'
            shouldWrap
            shouldScale={false}
          />
        </div>
      </main>
    </div>
  );
};

export default MyList;
