import { Box, BoxProps, useStyleConfig, forwardRef } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<BoxProps>;

export const Card = forwardRef<CardProps, 'div'>(({ children, ...rest }, ref) => {
  const styles = useStyleConfig('Card', {});

  return (
    <Box __css={styles} ref={ref} {...rest}>
      {children}
    </Box>
  );
});
