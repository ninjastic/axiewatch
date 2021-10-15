import { useColorMode } from '@chakra-ui/react';

import styles from './styles.module.css';

export const BallScaleLoading = (): JSX.Element => {
  const { colorMode } = useColorMode();

  const className = colorMode === 'dark' ? styles['la-ball-fall'] : `${styles['la-ball-fall']} ${styles['la-dark']}`;

  return (
    <div className={className}>
      <div />
      <div />
      <div />
    </div>
  );
};
