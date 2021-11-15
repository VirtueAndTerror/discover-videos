import { useRouter } from 'next/router';
import Modal from 'react-modal';
import cls from 'classnames';

import Navbar from '../../components/nav/Navbar';
import { getYoutubeVideoById } from '../../lib/videos';

import styles from '../../styles/Video.module.css';

Modal.setAppElement('#__next');

export async function getStaticProps(ctx) {
  const videoId = ctx.params.videoId;

  const [video] = await getYoutubeVideoById(videoId);

  return {
    props: {
      video,
    },
    revalidate: 5,
  };
}

export async function getStaticPaths() {
  const videosList = [];

  const paths = videosList.map(videoId => ({
    params: { videoId },
  }));

  return { paths, fallback: 'blocking' };
}

const Video = ({ video }) => {
  const router = useRouter();
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
          type='text/html'
          width='100%'
          height='360'
          src={src}
          frameborder='0'
        ></iframe>

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
