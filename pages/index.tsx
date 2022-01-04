import Head from 'next/head';
import useRedirectUser from '../utils/redirectUser';
import Navbar from '../components/nav/Navbar';
import Banner from '../components/banner/Banner';
import SectionCards from '../components/card/SectionCards';

import {
  getVideos,
  getPopularVideos,
  getWatchItAgainVideos,
} from '../lib/videos';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import styles from '../styles/Home.module.css';

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { userId, token } = await useRedirectUser(ctx);

  const disneyVideos = await getVideos('disney%20trailer');
  const travelVideos = await getVideos('travel');
  const productivityVideos = await getVideos('productivity');
  const popularVideos = await getPopularVideos();
  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);

  return {
    props: {
      disneyVideos,
      travelVideos,
      productivityVideos,
      popularVideos,
      watchItAgainVideos,
    },
  };
};

export default function Home({
  disneyVideos,
  travelVideos,
  productivityVideos,
  popularVideos,
  watchItAgainVideos = [],
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Home - Netflix</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Navbar />
        <Banner
          title='Clifford The Red Dog'
          subTitle='A very cute dog.'
          imgUrl='/static/clifford.webp'
          videoId='4zH5iYM4wJo'
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title='Disney' videos={disneyVideos} size='large' />
          {watchItAgainVideos && (
            <SectionCards
              title='Watch It Again'
              videos={watchItAgainVideos}
              size='small'
            />
          )}
          <SectionCards title='Travel' videos={travelVideos} size='small' />
          <SectionCards
            title='Productivity'
            videos={productivityVideos}
            size='medium'
          />
          <SectionCards title='Popular' videos={popularVideos} size='small' />
        </div>
      </main>
    </div>
  );
}
