import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import cls from 'classnames';

import Navbar from '../../components/nav/Navbar';
import Like from '../../components/icons/like-icon';
import Dislike from '../../components/icons/dislike-icons';

import { getYoutubeVideoById } from '../../lib/videos';

import styles from '../../styles/Video.module.css';
import { GetStaticProps, GetStaticPropsContext } from 'next';

Modal.setAppElement('#__next');

export const getStaticProps: GetStaticProps = async (
  ctx: GetStaticPropsContext
) => {
  const videoId = ctx.params.videoId.toString();

  const [video] = await getYoutubeVideoById(videoId);

  return {
    props: {
      video,
    },
    revalidate: 5,
  };
};

export async function getStaticPaths() {
  const videosList = [];

  const paths = videosList.map((videoId) => ({
    params: { videoId },
  }));

  return { paths, fallback: 'blocking' };
}

const Video: React.FC<any> = ({ video }) => {
  const router = useRouter();
  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDislike, setToggleDislike] = useState(false);

  const { videoId } = router.query;
  const BASE_URL = 'https://www.youtube.com/embed/';
  const otherParams = '?autoplay=1&controls=0&rel=0&origin=http://example.com';
  const src = `${BASE_URL}${videoId}${otherParams}`;
  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = video;

  useEffect((): void => {
    async function fetchStats() {
      const res = await fetch(`/api/stats?videoId=${videoId}`);
      const data = await res.json();
      if (data.length > 0) {
        const favorited = data[0].favorited;
        switch (favorited) {
          case 1:
            setToggleLike(true);
            break;
          case 2:
            setToggleDislike(true);
            break;
        }
      }
    }
    fetchStats();
  }, [videoId]);

  const runRatingService = async (favorited): Promise<Response> => {
    return await fetch('/api/stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoId,
        favorited,
      }),
    });
  };

  const handleToggleDislike = async (): Promise<void> => {
    const value = !toggleDislike;
    setToggleDislike(value);
    if (toggleLike) setToggleLike(toggleDislike);

    const favorited = value ? 2 : 0;
    await runRatingService(favorited);
  };

  const handleToggleLike = async (): Promise<void> => {
    const value = !toggleLike;
    setToggleLike(value);
    if (toggleDislike) setToggleDislike(toggleLike);
    const favorited = value ? 1 : 0;
    await runRatingService(favorited);
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <Modal
        isOpen={true}
        contentLabel='Watch the video'
        onRequestClose={() => router.back()}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          className={styles.videoPlayer}
          id='ytplayer'
          // type='text/html'
          width='100%'
          height='360'
          src={src}
          frameBorder='0'
        ></iframe>

        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={toggleLike} />
              </div>
            </button>
          </div>
          <button onClick={handleToggleDislike}>
            <div className={styles.btnWrapper}>
              <Dislike selected={toggleDislike} />
            </div>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={cls(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={cls(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
