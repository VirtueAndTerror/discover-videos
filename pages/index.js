import Head from 'next/head';

import Navbar from '../components/nav/Navbar';
import Banner from '../components/banner/Banner';
import SectionCards from '../components/card/SectionCards';

import { getVideos, getPopularVideos } from '../lib/videos';

import styles from '../styles/Home.module.css';

export async function getServerSideProps() {
  const disneyVideos = await getVideos('disney%20trailer');
  const travelVideos = await getVideos('travel');
  const productivityVideos = await getVideos('productivity');
  const popularVideos = await getPopularVideos();

  return {
    props: {
      disneyVideos,
      travelVideos,
      productivityVideos,
      popularVideos,
    },
  };
}

export default function Home({
  disneyVideos,
  travelVideos,
  productivityVideos,
  popularVideos,
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Home - Netflix</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Navbar username='arnaldo.e.diaz@gmail.com' />
        <Banner
          title='Along Came A Spider'
          subTitle='I name it'
          imgUrl='/static/demoImg.jpg'
          videoId='4zH5iYM4wJo'
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title='Disney' videos={disneyVideos} size='large' />
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
