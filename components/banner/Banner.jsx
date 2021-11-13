import Image from 'next/image';
import styles from './Banner.module.css';

const Banner = ({ title, subTitle, imgUrl }) => {
  const handlePlay = () => {};
  return (
    <div className={styles.container}>
      <div className={styles.leftWrapper}>
        <div className={styles.left}>
          <div className={styles.nseriesWapper}>
            <div className={styles.letter}>
              <Image
                src='/static/netflix_logo_icon_170919.svg'
                alt='netflix favicon'
                width='18px'
                height='18px'
              />
              <p className={styles.series}>S E R I E S</p>
            </div>
          </div>
          <h3 className={styles.title}>{title}</h3>
          <h3 className={styles.subTitle}>{subTitle}</h3>

          <div className={styles.playBtnWrapper}>
            <button className={styles.btnWithIcon} onClick={handlePlay}>
              <Image
                src='/static/play_arrow_black_24dp.svg'
                alt='play image'
                width='32px'
                height='32px'
              />
              <span className={styles.playText}>Play</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${imgUrl})`,
        }}
      ></div>
    </div>
  );
};

export default Banner;
