import React, { useState } from 'react';
import Image from 'next/image';

import cls from 'classnames';
import { motion } from 'framer-motion';

import styles from './Card.module.css';

type CardProps = {
  id: number;
  imgUrl: string;
  size: string;
  shouldScale?: boolean;
};

const Card: React.FC<CardProps> = ({
  id,
  imgUrl,
  size = 'medium',
  shouldScale = true,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(imgUrl);

  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  const handleError = (): void => {
    console.error('Hello Error!');
    setImgSrc(
      'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    );
  };

  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };
  const shouldHover = shouldScale && { whileHover: { ...scale } };
  return (
    <div className={styles.container}>
      <motion.div
        className={cls(styles.imgMotionWrapper, classMap[size])}
        {...shouldHover}
      >
        <Image
          className={styles.cardImg}
          src={imgSrc}
          alt='card-img'
          layout='fill'
          onError={handleError}
        />
      </motion.div>
    </div>
  );
};

export default Card;
