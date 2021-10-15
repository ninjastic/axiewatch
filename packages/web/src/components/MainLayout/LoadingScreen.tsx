import { Box, useStyleConfig } from '@chakra-ui/react';

import { BallScaleLoading } from '../BallScaleLoading';

export const LoadingScreen = (): JSX.Element => {
  const styles = useStyleConfig('LoadingScreen', {});

  return (
    <Box __css={styles}>
      <BallScaleLoading />
    </Box>
  );
};
