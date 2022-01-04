import React from 'react';
import Link from 'next/link';
import cls from 'classnames';
import Card from './Card';

import styles from './SectionCards.module.css';

type SCardsProps = {
  title: string;
  videos: {
    id: number;
    imgUrl: string;
  }[];
  size: string;
  shouldWrap?: boolean;
  shouldScale?: boolean;
};

const SectionCards: React.FC<SCardsProps> = ({
  title,
  videos = [],
  size,
  shouldWrap = false,
  shouldScale = true,
}) => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={cls(shouldWrap && styles.wrap, styles.cardWrapper)}>
        {videos.map((video, idx) => (
          <Link key={idx} href={`/video/${video.id}`}>
            <a>
              <Card
                key={idx}
                id={idx}
                imgUrl={video.imgUrl}
                size={size}
                shouldScale={shouldScale}
              />
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SectionCards;
