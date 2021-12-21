import Link from 'next/link';
import React from 'react';
import Card from './Card';
import styles from './SectionCards.module.css';

type SCardsProps = {
  title: string;
  videos: {
    id: number;
    imgUrl: string;
  }[];
  size: string;
};

const SectionCards: React.FC<SCardsProps> = ({ title, videos = [], size }) => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
        {videos.map((video, idx) => (
          <Link key={idx} href={`/video/${video.id}`}>
            <a>
              <Card key={idx} id={idx} imgUrl={video.imgUrl} size={size} />
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SectionCards;
